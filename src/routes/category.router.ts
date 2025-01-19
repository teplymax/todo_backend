import express from "express";

import { categoryController } from "@controllers/CategoryController";
import { authMiddleware } from "@middlewares/auth.middleware";
import { validationMiddleware } from "@middlewares/validation.middleware";

const categoryRouter = express.Router();

categoryRouter.get("/", authMiddleware, categoryController.getCategories);

categoryRouter.post(
  "/create",
  authMiddleware,
  validationMiddleware("createCategoryValidator"),
  categoryController.createCategory
);

categoryRouter.post(
  "/edit/:categoryId",
  authMiddleware,
  validationMiddleware("editCategoryValidator"),
  categoryController.editCategory
);

categoryRouter.delete("/delete/:categoryId", authMiddleware, categoryController.deleteCategory);

export default categoryRouter;
