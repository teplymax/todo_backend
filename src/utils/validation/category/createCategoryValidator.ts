import * as yup from "yup";

import { validationRules } from "../rules";

export const createCategoryValidator = yup.object().shape({
  name: validationRules.categoryName.required("Category name is required!")
});
