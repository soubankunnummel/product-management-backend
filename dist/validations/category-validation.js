"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
/**
 * Validation schemas for category related requests
 */
const joi_1 = __importDefault(require("joi"));
exports.createCategorySchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(50).required(),
    description: joi_1.default.string().optional(),
    parent: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).optional() // means self-referencing 
});
exports.updateCategorySchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(50).optional(),
    description: joi_1.default.string().optional(),
    parent: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).optional()
}).min(1);
