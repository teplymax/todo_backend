import * as yup from "yup";

import { validationRules } from "../rules";

//TODO: Will be enhanced
export const editCategoryValidator = yup.object().shape({
  name: validationRules.categoryName.required("Category name is required!")
});
