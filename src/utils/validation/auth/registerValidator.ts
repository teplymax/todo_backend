import * as yup from "yup";

import { validationRules } from "../rules";

export const registerValidator = yup.object().shape({
  email: validationRules.email.required("Email is required!"),
  nickname: validationRules.email.required("Nickname is required!"),
  password: validationRules.password.required("Password is required!"),
  name: validationRules.name,
  surname: validationRules.surname
});
