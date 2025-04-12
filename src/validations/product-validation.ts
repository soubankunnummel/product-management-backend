/**
 * Validation schemas for product related requests
 */
import Joi from 'joi';

const variantSchema = Joi.object({
    attributes: Joi.object().pattern(
      Joi.string(), 
      Joi.string()
    ).required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).required(),
  });
  
  export const createProductSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    description: Joi.string().required(),
    basePrice: Joi.number().min(0).required(),
    subcategory: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    variants: Joi.array().items(variantSchema).min(1).required(),
    images: Joi.array().items(Joi.string()).optional(),
    featured: Joi.boolean().optional()
  });
  
  export const updateProductSchema = Joi.object({
    title: Joi.string().min(2).max(100).optional(),
    description: Joi.string().optional(),
    basePrice: Joi.number().min(0).optional(),
    category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    subcategory: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    variants: Joi.array().items(variantSchema).min(1).optional(),
    images: Joi.array().items(Joi.string()).optional(),
    featured: Joi.boolean().optional()
  }).min(1);