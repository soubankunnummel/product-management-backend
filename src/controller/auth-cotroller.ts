/**
 * Authentication controller with registration and login functionality
 */
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../middleware/error-handler";
import { AuthRequest } from "../middleware/auth";
import { userService } from "../service/user-service";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.registerUser(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    const err = error as Error;
    next(new AppError(err.message, StatusCodes.BAD_REQUEST));
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(
        new AppError(
          "Please provide an email and password",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const result = await userService.loginUser(email, password);

    res.status(StatusCodes.OK).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    const err = error as Error;
    next(new AppError(err.message, StatusCodes.UNAUTHORIZED));
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError("Not authorized", StatusCodes.UNAUTHORIZED));
    }

    const user = await userService.getUserById(req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
