import express from "express";

import { authController } from "@controllers/AuthController";
import { authMiddleware } from "@middlewares/auth.middleware";
import { validationMiddleware } from "@middlewares/validation.middleware";

const authRouter = express.Router();

authRouter.post("/register", validationMiddleware("registerValidator"), authController.register);

authRouter.post("/verify", authMiddleware, authController.verify);

authRouter.post("/resendVerification", authMiddleware, authController.resendVerification);

authRouter.post("/login", validationMiddleware("loginValidator"), authController.login);

authRouter.post("/logout", authMiddleware, authController.logout);

authRouter.post("/refresh", authController.refresh);

export default authRouter;
