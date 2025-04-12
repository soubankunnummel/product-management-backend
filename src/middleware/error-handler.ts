/**
 * Global error handling middleware for Express
 * Manages different types of errors and formats the response consistently
 */
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

interface MongooseError extends Error {
  code?: number;
  errors?: Record<string, { message: string }>;
  keyValue?: Record<string, any>;
  value?: any;
}

export const errorHandler = (
  err: MongooseError, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  let error = { ...err } as MongooseError;
  error.message = err.message;
  
  // Log the error
  logger.error(`${err.name}: ${err.message}`);
  
  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, StatusCodes.BAD_REQUEST) as MongooseError;
  }
  
  // Mongoose duplicate key
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value: ${field}. Please use another value.`;
    error = new AppError(message, StatusCodes.BAD_REQUEST) as MongooseError;
  }
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new AppError(message, StatusCodes.NOT_FOUND) as MongooseError;
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', StatusCodes.UNAUTHORIZED) as MongooseError;
  }
  
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired. Please log in again.', StatusCodes.UNAUTHORIZED) as MongooseError;
  }
  
  res.status((error as AppError).statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
