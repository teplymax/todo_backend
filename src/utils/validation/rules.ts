import * as yup from "yup";

export const validationRules = {
  email: yup.string().email("Invalid email format"),
  nickname: yup
    .string()
    .min(2, "Nickname should have 2 symbols or more")
    .test("nickname", "Nickname shouldn't consist of spaces", (value) => !value?.includes(" ")),
  name: yup.string().matches(/^[a-z ,.'’-]+$/i, "Name should consist of alphabets only"),
  surname: yup.string().matches(/^[a-z ,.'’-]+$/i, "Surname should consist of alphabets only"),
  password: yup
    .string()
    .min(8, "Password should consist at least 8 symbols including alphabets and numbers")
    .matches(/^(?=.*[A-Za-z])(?=.*[0-9]).*$/, "Password should consist of alphabets and numbers")
    .test("password", "Password shouldn't consist of spaces", (value) => !value?.includes(" ")),
  date: yup.string().test((dateString) => new Date(dateString ?? "").toString() !== "Invalid Date"),
  login: yup
    .string()
    .required("login is required")
    .test("login", "Login should be either email or valid nickname", (value, { createError }) => {
      //TODO:Investigate why this is not populating to error message
      if (value.includes("@")) {
        const isValidEmail = yup.string().email().isValidSync(value);
        if (!isValidEmail) createError({ message: "Invalid email format" });

        return isValidEmail;
      }

      //TODO:Investigate why this is not populating to error message
      const isValidNickname = yup.string().min(2).isValidSync(value);
      if (!isValidNickname) createError({ message: "Nickname should have 2 symbols or more" });

      return isValidNickname;
    })
    .test("password", "Login shouldn't consist of spaces", (value) => !value?.includes(" ")),
  categoryName: yup.string().min(2, "Category name should have 2 symbols or more"),
  todoTitle: yup.string().min(2, "Todo title should have 2 symbols or more"),
  todoDescription: yup.string().min(1, "Todo description should have 1 symbol or more"),
  todoCategories: yup.array().of(yup.string())
};
