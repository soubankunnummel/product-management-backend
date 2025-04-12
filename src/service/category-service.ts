/**
 * Service for category related business logic
 */
import Category, { ICategory } from '../models/category';
import { AppError } from '../middleware/error-handler';
import { StatusCodes } from 'http-status-codes';

interface CategoryData {
  name: string;
  description?: string;
  parent?: string;
}

export const categoryService = {
  /**
   * Get all top-level categories
   */
  getAllRootCategories: async (): Promise<ICategory[]> => {
    return await Category.find({ parent: { $exists: false } });
  },

  /**
   * Get all categories (flat list)
   */
  getAllCategories: async (): Promise<ICategory[]> => {
    return await Category.find();
  },

  /**
   * Get category by ID with its subcategories
   */
  getCategoryById: async (id: string): Promise<ICategory | null> => {
    return await Category.findById(id).populate('subcategories');
  },

  /**
   * Get subcategories of a category
   */
  getSubcategories: async (parentId: string): Promise<ICategory[]> => {
    return await Category.find({ parent: parentId });
  },

  /**
   * Create a new category
   */
  createCategory: async (categoryData: CategoryData): Promise<ICategory> => {
    // If parent ID is provided, ensure it exists
    if (categoryData.parent) {
      const parentExists = await Category.findById(categoryData.parent);
      if (!parentExists) {
        throw new AppError('Parent category not found', StatusCodes.NOT_FOUND);
      }
    }

    return await Category.create(categoryData);
  },

  /**
   * Update an existing category
   */
  updateCategory: async (id: string, categoryData: Partial<CategoryData>): Promise<ICategory | null> => {
    // If parent ID is provided, ensure it exists
    if (categoryData.parent) {
      const parentExists = await Category.findById(categoryData.parent);
      if (!parentExists) {
        throw new AppError('Parent category not found', StatusCodes.NOT_FOUND);
      }
      
      // Prevent circular reference
      if (categoryData.parent === id) {
        throw new AppError('Category cannot be its own parent', StatusCodes.BAD_REQUEST);
      }
    }

    return await Category.findByIdAndUpdate(
      id, 
      categoryData, 
      { new: true, runValidators: true }
    );
  },

  /**
   * Delete a category
   */
  deleteCategory: async (id: string): Promise<ICategory | null> => {
    // Check if category has subcategories
    const hasSubcategories = await Category.findOne({ parent: id });
    if (hasSubcategories) {
      throw new AppError(
        'Cannot delete category with subcategories. Delete subcategories first or reassign them.',
        StatusCodes.BAD_REQUEST
      );
    }

    return await Category.findByIdAndDelete(id);
  }
};