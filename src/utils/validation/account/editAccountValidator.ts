import * as yup from "yup";

import { validationRules } from "../rules";

//TODO: Add birthday date here an in register validator
//TODO: Add name validation tests here and in register validator
export const editAccountValidator = yup.object().shape({
  email: validationRules.email,
  nickname: validationRules.nickname,
  password: validationRules.password,
  name: validationRules.name,
  surname: validationRules.surname
});
