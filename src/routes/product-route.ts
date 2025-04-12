import express, { Router } from 'express';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProductsByCategory,
  searchProducts,
  getProductsBySubcategory,
  
} from '../controller/product-controller';
import { protect } from '../middleware/auth';
import { validateRequest } from '../middleware/validate-request';
import { createProductSchema, updateProductSchema } from '../validations/product-validation';

const router: Router = express.Router();

// Base routes
router.route('/')
  .get( protect,getProducts)
  .post(protect, validateRequest(createProductSchema), createProduct);

// Search route
router.get('/search', searchProducts);

// Category/subcategory filtered routes
router.get('/category/:categoryId', getProductsByCategory);
router.get('/subcategory/:subcategoryId', getProductsBySubcategory);

// Individual product routes
router.route('/:id')
  .get(getProduct)
  .put(protect, validateRequest(updateProductSchema), updateProduct)
  .delete(protect, deleteProduct);

export default router;