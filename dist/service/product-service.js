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
exports.productService = void 0;
/**
 * Service for product related business logic
 */
const product_1 = __importDefault(require("../models/product"));
const category_1 = __importDefault(require("../models/category"));
const error_handler_1 = require("../middleware/error-handler");
const http_status_codes_1 = require("http-status-codes");
exports.productService = {
    /**
     * Get all products with basic info
     *
     */
    getPaginatedProducts: (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        const skip = (page - 1) * limit; // Calculate the number of documents to skip
        const total = yield product_1.default.countDocuments(); // Get the total number of products
        const pages = Math.ceil(total / limit); // Calculate the total number of pages
        const data = yield product_1.default.find()
            .skip(skip)
            .limit(limit)
            .populate('category', 'name')
            .populate('subcategory', 'name');
        return { data, total, page, pages };
    }),
    //   getAllProducts: async (): Promise<IProduct[]> => {
    //     return await Product.find()
    //       .populate('category', 'name')
    //       .populate('subcategory', 'name');
    //   },
    /**
     * Get product by ID with full details
     */
    getProductById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield product_1.default.findById(id)
            .populate('category', 'name')
            .populate('subcategory', 'name');
    }),
    /**
     * Get products by category
     */
    getProductsByCategory: (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield product_1.default.find({ category: categoryId })
            .populate('category', 'name')
            .populate('subcategory', 'name');
    }),
    /**
     * Get products by subcategory
     */
    getProductsBySubcategory: (subcategoryId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield product_1.default.find({ subcategory: subcategoryId })
            .populate('category', 'name')
            .populate('subcategory', 'name');
    }),
    /**
     * Create a new product
     */
    createProduct: (productData) => __awaiter(void 0, void 0, void 0, function* () {
        // Verify Product exists
        const productExists = yield product_1.default.findOne({ title: productData.title });
        console.log(`productExists: ${productExists}`);
        if (productExists) {
            throw new error_handler_1.AppError('Product already exists', http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        // Verify that subcategory exists
        const subcategoryExists = yield category_1.default.findById(productData.subcategory);
        if (!subcategoryExists) {
            throw new error_handler_1.AppError('Subcategory not found', http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        console.log(`subcategoryExists.parent: ${subcategoryExists.parent}`);
        // Verify that category exists
        const categoryExists = yield category_1.default.findById(subcategoryExists.parent);
        if (!categoryExists) {
            throw new error_handler_1.AppError('Category not found', http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        const newProductData = Object.assign(Object.assign({}, productData), { category: categoryExists._id });
        return yield product_1.default.create(newProductData);
    }),
    /**
     * Update an existing product
     */
    updateProduct: (id, productData) => __awaiter(void 0, void 0, void 0, function* () {
        // If category is being updated, verify it exists
        if (productData.category) {
            const categoryExists = yield category_1.default.findById(productData.category);
            if (!categoryExists) {
                throw new error_handler_1.AppError('Category not found', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
        }
        // If subcategory is being updated, verify it exists
        if (productData.subcategory) {
            const subcategoryExists = yield category_1.default.findById(productData.subcategory);
            if (!subcategoryExists) {
                throw new error_handler_1.AppError('Subcategory not found', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            // If both category and subcategory are being updated, verify relationship
            if (productData.category && subcategoryExists.parent &&
                subcategoryExists.parent.toString() !== productData.category) {
                throw new error_handler_1.AppError('Subcategory does not belong to the specified category', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // If only subcategory is being updated, get current product to check category
            if (!productData.category) {
                const currentProduct = yield product_1.default.findById(id);
                if (currentProduct && subcategoryExists.parent &&
                    subcategoryExists.parent.toString() !== currentProduct.category.toString()) {
                    throw new error_handler_1.AppError('Subcategory does not belong to the product\'s category', http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
            }
        }
        return yield product_1.default.findByIdAndUpdate(id, productData, { new: true, runValidators: true }).populate('category', 'name').populate('subcategory', 'name');
    }),
    /**
     * Delete a product
     */
    deleteProduct: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield product_1.default.findByIdAndDelete(id);
    }),
    /**
     * Search products
     */
    searchProducts: (query) => __awaiter(void 0, void 0, void 0, function* () {
        return yield product_1.default.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } })
            .populate('category', 'name')
            .populate('subcategory', 'name');
    })
};
