import express from "express";

import { categoryController } from "@controllers/CategoryController";
import { authMiddleware } from "@middlewares/auth.middleware";
import { validationMiddleware } from "@middlewares/validation.middleware";

const categoryRouter = express.Router();

categoryRouter.get("/", authMiddleware, categoryController.getCategories);

categoryRouter.post(
  "/",
  authMiddleware,
  validationMiddleware("createCategoryValidator"),
  categoryController.createCategory
);

categoryRouter.patch(
  "/:categoryId",
  authMiddleware,
  validationMiddleware("editCategoryValidator"),
  categoryController.editCategory
);

categoryRouter.delete("/:categoryId", authMiddleware, categoryController.deleteCategory);

export default categoryRouter;
