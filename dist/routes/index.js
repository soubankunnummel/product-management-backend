"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Combines all API routes into a single router
 */
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth-route"));
const product_route_1 = __importDefault(require("./product-route"));
const category_route_1 = __importDefault(require("./category-route"));
const router = express_1.default.Router();
// Mount routes
router.use('/auth', auth_route_1.default);
router.use('/products', product_route_1.default);
router.use('/categories', category_route_1.default);
exports.default = router;
