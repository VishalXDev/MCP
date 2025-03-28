const Order = require("../models/Order");
const PickupPartner = require("../models/PickupPartner");
const Transaction = require("../models/Transaction");
const { ORDER_STATUS } = require('../constants/orderStatus');
const { TRANSACTION_TYPES } = require('../constants/transactionTypes');

// @desc    Pickup partner accepts an order
// @route   POST /api/partners/orders/accept
// @access  Private (Pickup Partner only)
exports.acceptOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const partnerId = req.user.id; // From auth middleware

        // Validate input
        if (!orderId) {
            return res.status(400).json({ 
                success: false,
                message: "Order ID is required" 
            });
        }

        // Find and validate the order
        const order = await Order.findOne({
            _id: orderId,
            partnerId: partnerId,
            status: ORDER_STATUS.ASSIGNED
        });

        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: "Order not found or not assigned to you" 
            });
        }

        // Update order status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { 
                status: ORDER_STATUS.IN_PROGRESS,
                acceptedAt: new Date() 
            },
            { new: true, runValidators: true }
        );

        // Update partner's status
        await PickupPartner.findByIdAndUpdate(
            partnerId,
            { 
                status: 'busy',
                lastActiveAt: new Date() 
            }
        );

        res.json({ 
            success: true, 
            message: "Order accepted successfully", 
            data: updatedOrder 
        });

    } catch (error) {
        console.error("Error accepting order:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to accept order",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get pickup partner's wallet balance and recent transactions
// @route   GET /api/partners/wallet
// @access  Private (Pickup Partner only)
exports.getWalletDetails = async (req, res) => {
    try {
        const partnerId = req.user.id; // From auth middleware

        // Get partner wallet balance
        const partner = await PickupPartner.findById(partnerId)
            .select('walletBalance name phone');

        if (!partner) {
            return res.status(404).json({ 
                success: false,
                message: "Pickup Partner not found" 
            });
        }

        // Get recent transactions (last 10)
        const transactions = await Transaction.find({ userId: partnerId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('amount type description createdAt');

        res.json({ 
            success: true,
            data: {
                balance: partner.walletBalance,
                partner: {
                    name: partner.name,
                    phone: partner.phone
                },
                recentTransactions: transactions
            }
        });

    } catch (error) {
        console.error("Error fetching wallet details:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch wallet details",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Complete an order and credit payment to partner's wallet
// @route   POST /api/partners/orders/complete
// @access  Private (Pickup Partner only)
exports.completeOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const partnerId = req.user.id;

        // Validate input
        if (!orderId) {
            return res.status(400).json({ 
                success: false,
                message: "Order ID is required" 
            });
        }

        // Find and validate the order
        const order = await Order.findOne({
            _id: orderId,
            partnerId: partnerId,
            status: ORDER_STATUS.IN_PROGRESS
        });

        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: "Order not found or not in progress" 
            });
        }

        // Start transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update order status
            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { 
                    status: ORDER_STATUS.COMPLETED,
                    completedAt: new Date() 
                },
                { new: true, session }
            );

            // Credit amount to partner's wallet
            await PickupPartner.findByIdAndUpdate(
                partnerId,
                { 
                    $inc: { walletBalance: order.amount },
                    $set: { status: 'available' },
                    $push: { completedOrders: orderId }
                },
                { session }
            );

            // Record transaction
            const transaction = new Transaction({
                userId: partnerId,
                amount: order.amount,
                type: TRANSACTION_TYPES.CREDIT,
                description: `Payment for order ${order.orderNumber}`,
                referenceId: orderId,
                balanceAfter: partner.walletBalance + order.amount
            });
            await transaction.save({ session });

            // Commit transaction
            await session.commitTransaction();

            res.json({ 
                success: true, 
                message: "Order completed successfully", 
                data: {
                    order: updatedOrder,
                    amountCredited: order.amount
                }
            });

        } catch (transactionError) {
            // Abort transaction on error
            await session.abortTransaction();
            throw transactionError;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error("Error completing order:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to complete order",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};