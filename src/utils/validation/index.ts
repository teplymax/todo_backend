import { loginValidator } from "./auth/loginValidator";
import { registerValidator } from "./auth/registerValidator";
import { createCategoryValidator } from "./category/createCategoryValidator";
import { editCategoryValidator } from "./category/editCategoryValidator";

export const VALIDATORS = {
  loginValidator,
  registerValidator,
  createCategoryValidator,
  editCategoryValidator
};
