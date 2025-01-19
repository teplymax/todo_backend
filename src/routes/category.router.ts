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
  "/edit/:id",
  authMiddleware,
  validationMiddleware("editCategoryValidator"),
  categoryController.editCategory
);

categoryRouter.delete("/delete/:id", authMiddleware, categoryController.deleteCategory);

export default categoryRouter;
