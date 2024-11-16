import * as yup from "yup";

export const validationRules = {
  email: yup.string().email("Invalid email format"),
  nickname: yup.string().min(2, "Nickname should have 2 symbols or more"),
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
    .test("login", "Login should be either email or nickname", (value, { createError }) => {
      if (value.includes("@")) {
        const isValidEmail = yup.string().email().isValidSync(value);
        if (!isValidEmail) createError({ message: "Invalid email format" });

        return isValidEmail;
      }

      const isValidNickname = yup.string().min(2).isValidSync(value);
      if (!isValidNickname) createError({ message: "Nickname should have 2 symbols or more" });

      return isValidNickname;
    })
};
