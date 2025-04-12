"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
/**
 * Validation schemas for product related requests
 */
const joi_1 = __importDefault(require("joi"));
const variantSchema = joi_1.default.object({
    attributes: joi_1.default.object().pattern(joi_1.default.string(), joi_1.default.string()).required(),
    price: joi_1.default.number().min(0).required(),
    stock: joi_1.default.number().min(0).required(),
});
exports.createProductSchema = joi_1.default.object({
    title: joi_1.default.string().min(2).max(100).required(),
    description: joi_1.default.string().required(),
    basePrice: joi_1.default.number().min(0).required(),
    subcategory: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    variants: joi_1.default.array().items(variantSchema).min(1).required(),
    images: joi_1.default.array().items(joi_1.default.string()).optional(),
    featured: joi_1.default.boolean().optional()
});
exports.updateProductSchema = joi_1.default.object({
    title: joi_1.default.string().min(2).max(100).optional(),
    description: joi_1.default.string().optional(),
    basePrice: joi_1.default.number().min(0).optional(),
    category: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    subcategory: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    variants: joi_1.default.array().items(variantSchema).min(1).optional(),
    images: joi_1.default.array().items(joi_1.default.string()).optional(),
    featured: joi_1.default.boolean().optional()
}).min(1);
