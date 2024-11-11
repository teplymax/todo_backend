import express from "express";

import { authController } from "@controllers/AuthController";
import { validationMiddleware } from "@middlewares/validationMiddleware";

const authRouter = express.Router();

authRouter.post("/register", validationMiddleware("registerValidator"), authController.register);

authRouter.post("/verify", authController.verify);

authRouter.post("/login", validationMiddleware("loginValidator"), authController.login);

authRouter.post("/logout");

authRouter.post("/refresh");

export default authRouter;
