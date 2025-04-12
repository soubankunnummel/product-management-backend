/**
 * Category related routes
 */
import express, { Router } from "express";
import {
  getRootCategories,
  getAllCategories,
  getCategory,
  getSubcategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/category-controller";
import { protect } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category-validation";

const router: Router = express.Router();

router.get("/root", getRootCategories);
router.get("/", getAllCategories);
router.get("/:id", getCategory);
router.get("/:id/subcategories", getSubcategories);
router.post(
  "/",
  protect,
  validateRequest(createCategorySchema),
  createCategory
);
router.put(
  "/:id",
  protect,
  validateRequest(updateCategorySchema),
  updateCategory
);
router.delete("/:id", protect, deleteCategory);

export default router;
