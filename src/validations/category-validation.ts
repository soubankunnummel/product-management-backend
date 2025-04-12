/**
 * Validation schemas for category related requests
 */
import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().optional(),
  parent: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional() // means self-referencing 
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  description: Joi.string().optional(),
  parent: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional()
}).min(1);