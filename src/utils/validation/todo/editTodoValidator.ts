import * as yup from "yup";

import { validationRules } from "../rules";

//TODO: Will be enhanced
export const editTodoValidator = yup.object().shape({
  title: validationRules.todoTitle,
  description: validationRules.todoDescription,
  categories: validationRules.todoCategories
});
