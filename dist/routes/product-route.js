"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controller/product-controller");
const auth_1 = require("../middleware/auth");
const validate_request_1 = require("../middleware/validate-request");
const product_validation_1 = require("../validations/product-validation");
const router = express_1.default.Router();
// Base routes
router.route('/')
    .get(auth_1.protect, product_controller_1.getProducts)
    .post(auth_1.protect, (0, validate_request_1.validateRequest)(product_validation_1.createProductSchema), product_controller_1.createProduct);
// Search route
router.get('/search', product_controller_1.searchProducts);
// Category/subcategory filtered routes
router.get('/category/:categoryId', product_controller_1.getProductsByCategory);
router.get('/subcategory/:subcategoryId', product_controller_1.getProductsBySubcategory);
// Individual product routes
router.route('/:id')
    .get(product_controller_1.getProduct)
    .put(auth_1.protect, (0, validate_request_1.validateRequest)(product_validation_1.updateProductSchema), product_controller_1.updateProduct)
    .delete(auth_1.protect, product_controller_1.deleteProduct);
exports.default = router;
