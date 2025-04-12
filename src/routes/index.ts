/**
 * Combines all API routes into a single router
 */
import express, { Router } from 'express';
import authRoutes from './auth-route';
import productRoutes from './product-route';
import categoryRoutes from './category-route';

const router: Router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

export default router;