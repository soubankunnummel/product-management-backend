"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
/**
 * Service for category related business logic
 */
const category_1 = __importDefault(require("../models/category"));
const error_handler_1 = require("../middleware/error-handler");
const http_status_codes_1 = require("http-status-codes");
exports.categoryService = {
    /**
     * Get all top-level categories
     */
    getAllRootCategories: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield category_1.default.find({ parent: { $exists: false } });
    }),
    /**
     * Get all categories (flat list)
     */
    getAllCategories: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield category_1.default.find();
    }),
    /**
     * Get category by ID with its subcategories
     */
    getCategoryById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield category_1.default.findById(id).populate('subcategories');
    }),
    /**
     * Get subcategories of a category
     */
    getSubcategories: (parentId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield category_1.default.find({ parent: parentId });
    }),
    /**
     * Create a new category
     */
    createCategory: (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
        // If parent ID is provided, ensure it exists
        if (categoryData.parent) {
            const parentExists = yield category_1.default.findById(categoryData.parent);
            if (!parentExists) {
                throw new error_handler_1.AppError('Parent category not found', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
        }
        return yield category_1.default.create(categoryData);
    }),
    /**
     * Update an existing category
     */
    updateCategory: (id, categoryData) => __awaiter(void 0, void 0, void 0, function* () {
        // If parent ID is provided, ensure it exists
        if (categoryData.parent) {
            const parentExists = yield category_1.default.findById(categoryData.parent);
            if (!parentExists) {
                throw new error_handler_1.AppError('Parent category not found', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            // Prevent circular reference
            if (categoryData.parent === id) {
                throw new error_handler_1.AppError('Category cannot be its own parent', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
        }
        return yield category_1.default.findByIdAndUpdate(id, categoryData, { new: true, runValidators: true });
    }),
    /**
     * Delete a category
     */
    deleteCategory: (id) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if category has subcategories
        const hasSubcategories = yield category_1.default.findOne({ parent: id });
        if (hasSubcategories) {
            throw new error_handler_1.AppError('Cannot delete category with subcategories. Delete subcategories first or reassign them.', http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        return yield category_1.default.findByIdAndDelete(id);
    })
};
