import { Request, Response, NextFunction } from 'express';

// Global error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack); // Log the full error stack to console

  const statusCode = err.status || 500; // Default to 500 Internal Server Error
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
