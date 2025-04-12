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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.searchProducts = exports.getProductsBySubcategory = exports.getProductsByCategory = exports.getProduct = exports.getProducts = void 0;
const http_status_codes_1 = require("http-status-codes");
const error_handler_1 = require("../middleware/error-handler");
const product_service_1 = require("../service/product-service");
// Get all products
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // to get all products set limit to -1 and page to 1
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const products = yield product_service_1.productService.getPaginatedProducts(page, limit);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            count: products.data.length,
            total: products.total,
            page: products.page,
            pages: products.pages,
            data: products.data,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProducts = getProducts;
// Get single product
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_service_1.productService.getProductById(req.params.id);
        if (!product) {
            return next(new error_handler_1.AppError('Product not found', http_status_codes_1.StatusCodes.NOT_FOUND));
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: product
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProduct = getProduct;
// Get products by category
const getProductsByCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_service_1.productService.getProductsByCategory(req.params.categoryId);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            count: products.length,
            data: products
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProductsByCategory = getProductsByCategory;
// Get products by subcategory
const getProductsBySubcategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_service_1.productService.getProductsBySubcategory(req.params.subcategoryId);
        console.log(products, "products");
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            count: products.length,
            data: products
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProductsBySubcategory = getProductsBySubcategory;
// Search products
const searchProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query.q;
        if (!query) {
            return next(new error_handler_1.AppError('Search query is required', http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        const products = yield product_service_1.productService.searchProducts(query);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            count: products.length,
            data: products
        });
    }
    catch (error) {
        next(error);
    }
});
exports.searchProducts = searchProducts;
// Create product
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new error_handler_1.AppError('Not authorized', http_status_codes_1.StatusCodes.UNAUTHORIZED));
        }
        const product = yield product_service_1.productService.createProduct(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            data: product
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
exports.createProduct = createProduct;
// Update product
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new error_handler_1.AppError('Not authorized', http_status_codes_1.StatusCodes.UNAUTHORIZED));
        }
        const product = yield product_service_1.productService.updateProduct(req.params.id, req.body);
        if (!product) {
            return next(new error_handler_1.AppError('Product not found', http_status_codes_1.StatusCodes.NOT_FOUND));
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: product
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
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new error_handler_1.AppError('Not authorized', http_status_codes_1.StatusCodes.UNAUTHORIZED));
        }
        const product = yield product_service_1.productService.deleteProduct(req.params.id);
        if (!product) {
            return next(new error_handler_1.AppError('Product not found', http_status_codes_1.StatusCodes.NOT_FOUND));
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: {}
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProduct = deleteProduct;
