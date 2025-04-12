/**
 * Service for product related business logic
 */
import Product, { IProduct, IVariant } from '../models/product';
import Category from '../models/category';
import { AppError } from '../middleware/error-handler';
import { StatusCodes } from 'http-status-codes';

interface ProductData {
  title: string;
  description: string;
  basePrice: number;
  category: string;
  subcategory: string;
  variants: IVariant[];
  images?: string[];
  featured?: boolean;
}

export const productService = {
  /**
   * Get all products with basic info 
   * 
   */
  getPaginatedProducts: async (page: number, limit: number): Promise<{
    data: IProduct[];
    total: number;
    page: number;
    pages: number;
  }> => {
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    const total = await Product.countDocuments(); // Get the total number of products
    const pages = Math.ceil(total / limit); // Calculate the total number of pages
  
    const data = await Product.find()
      .skip(skip)
      .limit(limit)
      .populate('category', 'name')
      .populate('subcategory', 'name');
  
    return { data, total, page, pages };
  },
//   getAllProducts: async (): Promise<IProduct[]> => {
//     return await Product.find()
//       .populate('category', 'name')
//       .populate('subcategory', 'name');
//   },

  /**
   * Get product by ID with full details
   */
  getProductById: async (id: string): Promise<IProduct | null> => {
    return await Product.findById(id)
      .populate('category', 'name')
      .populate('subcategory', 'name');
  },

  /**
   * Get products by category
   */
  getProductsByCategory: async (categoryId: string): Promise<IProduct[]> => {
    return await Product.find({ category: categoryId })
      .populate('category', 'name')
      .populate('subcategory', 'name');
  },

  /**
   * Get products by subcategory
   */
  getProductsBySubcategory: async (subcategoryId: string): Promise<IProduct[]> => {
    return await Product.find({ subcategory: subcategoryId })
      .populate('category', 'name')
      .populate('subcategory', 'name');
  },

  /**
   * Create a new product
   */
  createProduct: async (productData: ProductData): Promise<IProduct> => {


    // Verify Product exists
    const productExists = await Product.findOne({ title: productData.title });
    console.log(`productExists: ${productExists}`);
    if (productExists) {
      throw new AppError('Product already exists', StatusCodes.BAD_REQUEST);
    }
   

    // Verify that subcategory exists
    const subcategoryExists = await Category.findById(productData.subcategory);
    if (!subcategoryExists) {
      throw new AppError('Subcategory not found', StatusCodes.NOT_FOUND);
    }

    console.log(`subcategoryExists.parent: ${subcategoryExists.parent}`);

     // Verify that category exists
     const categoryExists = await Category.findById(subcategoryExists.parent);
     if (!categoryExists) {
       throw new AppError('Category not found', StatusCodes.NOT_FOUND);
     }

     const newProductData = {
       ...productData,
       category: categoryExists._id
     };

    return await Product.create(newProductData);
  },

  /**
   * Update an existing product
   */
  updateProduct: async (id: string, productData: Partial<ProductData>): Promise<IProduct | null> => {
    // If category is being updated, verify it exists
    if (productData.category) {
      const categoryExists = await Category.findById(productData.category);
      if (!categoryExists) {
        throw new AppError('Category not found', StatusCodes.NOT_FOUND);
      }
    }

    // If subcategory is being updated, verify it exists
    if (productData.subcategory) {
      const subcategoryExists = await Category.findById(productData.subcategory);
      if (!subcategoryExists) {
        throw new AppError('Subcategory not found', StatusCodes.NOT_FOUND);
      }

      // If both category and subcategory are being updated, verify relationship
      if (productData.category && subcategoryExists.parent && 
          subcategoryExists.parent.toString() !== productData.category) {
        throw new AppError('Subcategory does not belong to the specified category', StatusCodes.BAD_REQUEST);
      } 
      
      // If only subcategory is being updated, get current product to check category
      if (!productData.category) {
        const currentProduct = await Product.findById(id);
        if (currentProduct && subcategoryExists.parent && 
            subcategoryExists.parent.toString() !== currentProduct.category.toString()) {
          throw new AppError('Subcategory does not belong to the product\'s category', StatusCodes.BAD_REQUEST);
        }
      }
    }

    return await Product.findByIdAndUpdate(
      id, 
      productData, 
      { new: true, runValidators: true }
    ).populate('category', 'name').populate('subcategory', 'name');
  },

  /**
   * Delete a product
   */
  deleteProduct: async (id: string): Promise<IProduct | null> => {
    return await Product.findByIdAndDelete(id);
  },

  /**
   * Search products
   */
  searchProducts: async (query: string): Promise<IProduct[]> => {
    return await Product.find(
      { $text: { $search: query } }, 
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } })
      .populate('category', 'name')
      .populate('subcategory', 'name');
  }
};