import * as yup from "yup";

import { validationRules } from "../rules";

export const createTodoValidator = yup.object().shape({
  title: validationRules.todoTitle.required("Title is required!"),
  description: validationRules.todoDescription,
  categories: validationRules.todoCategories
});
