/**
 * Authentication middleware to verify JWT tokens
 */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { config } from "../config/config";
import { AppError } from "./error-handler";
import User, { IUser } from "../models/user";

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return next(
      new AppError(
        "Not authorized to access this route",
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    // Set user to req.user
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return next(
      new AppError(
        "Not authorized to access this route",
        StatusCodes.UNAUTHORIZED
      )
    );
  }
};
