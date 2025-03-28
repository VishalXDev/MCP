import { useEffect, useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import OrderCard from '../components/orders/OrderCard';
import orderService from '../services/orderService';
import partnerService from '../services/partnerService';
import CreateOrderModal from '../components/orders/CreateOrderModal';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, partnersRes] = await Promise.all([
          orderService.getOrders(token),
          partnerService.getPartners(token),
        ]);
        setOrders(ordersRes);
        setPartners(partnersRes);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleAssignOrder = async (orderId, partnerId) => {
    try {
      const updatedOrder = await orderService.assignOrder(
        orderId,
        partnerId,
        token
      );
      setOrders(
        orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    } catch (err) {
      console.error('Failed to assign order:', err);
    }
  };

  const handleCreateOrder = async (orderData) => {
    try {
      const newOrder = await orderService.createOrder(orderData, token);
      setOrders([newOrder, ...orders]);
      setOpenCreateModal(false);
    } catch (err) {
      console.error('Failed to create order:', err);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading orders...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Orders Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenCreateModal(true)}
        >
          New Order
        </Button>
      </Box>

      {orders.length === 0 ? (
        <Typography>No orders found</Typography>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            partners={partners}
            onAssign={handleAssignOrder}
          />
        ))
      )}

      <CreateOrderModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSubmit={handleCreateOrder}
      />
    </Container>
  );
}