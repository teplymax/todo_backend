import * as yup from "yup";

import { validationRules } from "../rules";

export const loginValidator = yup.object().shape({
  login: validationRules.login.required("Login is required!"),
  password: validationRules.password.required("Password is required!")
});
