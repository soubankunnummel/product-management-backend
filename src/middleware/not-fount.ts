/**
 * Middleware to handle requests to non-existent routes
 */
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(StatusCodes.NOT_FOUND);
  next(error);
};