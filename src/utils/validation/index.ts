import { loginValidator } from "./auth/loginValidator";
import { registerValidator } from "./auth/registerValidator";
import { createCategoryValidator } from "./category/createCategoryValidator";
import { editCategoryValidator } from "./category/editCategoryValidator";
import { createTodoValidator } from "./todo/createTodoValidator";
import { editTodoValidator } from "./todo/editTodoValidator";

export const VALIDATORS = {
  loginValidator,
  registerValidator,
  createCategoryValidator,
  editCategoryValidator,
  createTodoValidator,
  editTodoValidator
};
