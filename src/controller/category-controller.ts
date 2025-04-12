/**
 * Controller for category related operations
 */
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../middleware/error-handler";
import { categoryService } from "../service/category-service";
import { AuthRequest } from "../middleware/auth";

// Get all root categories
export const getRootCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await categoryService.getAllRootCategories();

    res.status(StatusCodes.OK).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories (flat list)
export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await categoryService.getAllCategories();

    res.status(StatusCodes.OK).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Get single category with subcategories
export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);

    if (!category) {
      return next(new AppError("Category not found", StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Get subcategories
export const getSubcategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const subcategories = await categoryService.getSubcategories(req.params.id);

    res.status(StatusCodes.OK).json({
      success: true,
      count: subcategories.length,
      data: subcategories,
    });
  } catch (error) {
    next(error);
  }
};

// Create category
export const createCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError("Not authorized", StatusCodes.UNAUTHORIZED));
    }

    const isExistingCategory = await categoryService.getAllCategories();
    console.log(isExistingCategory);
    if (
      isExistingCategory.some((category) => category.name === req.body.name)
    ) {
      return next(
        new AppError("  category already exists", StatusCodes.BAD_REQUEST)
      );
    }

    const category = await categoryService.createCategory(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError((error as Error).message, StatusCodes.BAD_REQUEST));
    }
  }
};

// Update category
export const updateCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError("Not authorized", StatusCodes.UNAUTHORIZED));
    }

    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    );

    if (!category) {
      return next(new AppError("Category not found", StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError((error as Error).message, StatusCodes.BAD_REQUEST));
    }
  }
};

// Delete category
export const deleteCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError("Not authorized", StatusCodes.UNAUTHORIZED));
    }

    const category = await categoryService.deleteCategory(req.params.id);

    if (!category) {
      return next(new AppError("Category not found", StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: {},
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError((error as Error).message, StatusCodes.BAD_REQUEST));
    }
  }
};
