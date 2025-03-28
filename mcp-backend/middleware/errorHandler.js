const errorHandler = (err, req, res, next) => {
    console.error(`Error: ${err.name} - ${err.message}`);
    console.error(err.stack); // Logs full stack trace for debugging

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message).join(", ");
    }

    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
        statusCode = 409;
        message = `Duplicate field value entered: ${JSON.stringify(err.keyValue)}`;
    }

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

module.exports = errorHandler;
