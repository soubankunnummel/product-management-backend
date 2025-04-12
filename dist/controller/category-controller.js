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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getSubcategories = exports.getCategory = exports.getAllCategories = exports.getRootCategories = void 0;
const http_status_codes_1 = require("http-status-codes");
const error_handler_1 = require("../middleware/error-handler");
const category_service_1 = require("../service/category-service");
// Get all root categories
const getRootCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_service_1.categoryService.getAllRootCategories();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getRootCategories = getRootCategories;
// Get all categories (flat list)
const getAllCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_service_1.categoryService.getAllCategories();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllCategories = getAllCategories;
// Get single category with subcategories
const getCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_service_1.categoryService.getCategoryById(req.params.id);
        if (!category) {
            return next(new error_handler_1.AppError("Category not found", http_status_codes_1.StatusCodes.NOT_FOUND));
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCategory = getCategory;
// Get subcategories
const getSubcategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subcategories = yield category_service_1.categoryService.getSubcategories(req.params.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            count: subcategories.length,
            data: subcategories,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getSubcategories = getSubcategories;
// Create category
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new error_handler_1.AppError("Not authorized", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        }
        const isExistingCategory = yield category_service_1.categoryService.getAllCategories();
        console.log(isExistingCategory);
        if (isExistingCategory.some((category) => category.name === req.body.name)) {
            return next(new error_handler_1.AppError("  category already exists", http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        const category = yield category_service_1.categoryService.createCategory(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        if (error instanceof error_handler_1.AppError) {
            next(error);
        }
        else {
            next(new error_handler_1.AppError(error.message, http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
    }
});
exports.createCategory = createCategory;
// Update category
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new error_handler_1.AppError("Not authorized", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        }
        const category = yield category_service_1.categoryService.updateCategory(req.params.id, req.body);
        if (!category) {
            return next(new error_handler_1.AppError("Category not found", http_status_codes_1.StatusCodes.NOT_FOUND));
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        if (error instanceof error_handler_1.AppError) {
            next(error);
        }
        else {
            next(new error_handler_1.AppError(error.message, http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
    }
});
exports.updateCategory = updateCategory;
// Delete category
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new error_handler_1.AppError("Not authorized", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        }
        const category = yield category_service_1.categoryService.deleteCategory(req.params.id);
        if (!category) {
            return next(new error_handler_1.AppError("Category not found", http_status_codes_1.StatusCodes.NOT_FOUND));
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: {},
        });
    }
    catch (error) {
        if (error instanceof error_handler_1.AppError) {
            next(error);
        }
        else {
            next(new error_handler_1.AppError(error.message, http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
    }
});
exports.deleteCategory = deleteCategory;
