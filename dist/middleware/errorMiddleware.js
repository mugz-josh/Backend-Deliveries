"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the full error stack to console
    const statusCode = err.status || 500; // Default to 500 Internal Server Error
    const message = err.message || 'Something went wrong';
    res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.errorHandler = errorHandler;
