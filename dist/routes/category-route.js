"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Category related routes
 */
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controller/category-controller");
const auth_1 = require("../middleware/auth");
const validate_request_1 = require("../middleware/validate-request");
const category_validation_1 = require("../validations/category-validation");
const router = express_1.default.Router();
router.get("/root", category_controller_1.getRootCategories);
router.get("/", category_controller_1.getAllCategories);
router.get("/:id", category_controller_1.getCategory);
router.get("/:id/subcategories", category_controller_1.getSubcategories);
router.post("/", auth_1.protect, (0, validate_request_1.validateRequest)(category_validation_1.createCategorySchema), category_controller_1.createCategory);
router.put("/:id", auth_1.protect, (0, validate_request_1.validateRequest)(category_validation_1.updateCategorySchema), category_controller_1.updateCategory);
router.delete("/:id", auth_1.protect, category_controller_1.deleteCategory);
exports.default = router;
