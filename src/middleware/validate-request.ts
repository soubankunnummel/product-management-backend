/**
 * Middleware for validating request data using Joi schemas
 */
import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { StatusCodes } from "http-status-codes";
import { AppError } from "./error-handler";

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return next(new AppError(message, StatusCodes.BAD_REQUEST));
    }

    next();
  };
};
