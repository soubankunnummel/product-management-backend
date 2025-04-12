/**
 * Controller for product related operations
 */
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../middleware/error-handler';
import { productService } from '../service/product-service';
import { AuthRequest } from '../middleware/auth';

// Get all products
export const getProducts = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
    try {
        // to get all products set limit to -1 and page to 1
        const page = parseInt(req.query.page as string) || 1; // Default to page 1
        const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page
    
        const products = await productService.getPaginatedProducts(page, limit);
    
        res.status(StatusCodes.OK).json({
          success: true,
          count: products.data.length,
          total: products.total,
          page: products.page,
          pages: products.pages,
          data: products.data,
        });
      } catch (error) {
        next(error);
      }
};

// Get single product
export const getProduct = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const product = await productService.getProductById(req.params.id);
    
    if (!product) {
      return next(new AppError('Product not found', StatusCodes.NOT_FOUND));
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category
export const getProductsByCategory = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const products = await productService.getProductsByCategory(req.params.categoryId);
    
    res.status(StatusCodes.OK).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get products by subcategory
export const getProductsBySubcategory = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const products = await productService.getProductsBySubcategory(req.params.subcategoryId);
    console.log(products, "products");
    
    res.status(StatusCodes.OK).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Search products
export const searchProducts = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query.q as string;
    
    if (!query) {
      return next(new AppError('Search query is required', StatusCodes.BAD_REQUEST));
    }
    
    const products = await productService.searchProducts(query);
    
    res.status(StatusCodes.OK).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Create product
export const createProduct = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Not authorized', StatusCodes.UNAUTHORIZED));
    }
    
    const product = await productService.createProduct(req.body);
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError((error as Error).message, StatusCodes.BAD_REQUEST));
    }
  }
};

// Update product
export const updateProduct = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Not authorized', StatusCodes.UNAUTHORIZED));
    }
    
    const product = await productService.updateProduct(req.params.id, req.body);
    
    if (!product) {
      return next(new AppError('Product not found', StatusCodes.NOT_FOUND));
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError((error as Error).message, StatusCodes.BAD_REQUEST));
    }
  }
};

// Delete product
export const deleteProduct = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Not authorized', StatusCodes.UNAUTHORIZED));
    }
    
    const product = await productService.deleteProduct(req.params.id);
    
    if (!product) {
      return next(new AppError('Product not found', StatusCodes.NOT_FOUND));
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

 