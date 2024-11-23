//TODO: create Authorization middleware
import express from "express";

import { authController } from "@controllers/AuthController";
import { validationMiddleware } from "@middlewares/validation.middleware";

const authRouter = express.Router();

authRouter.post("/register", validationMiddleware("registerValidator"), authController.register);

authRouter.post("/verify", authController.verify);

//TODO: Do it in worker as we don't care if this job is successful or not
authRouter.post("/resendVerification", authController.resendVerification);

authRouter.post("/login", validationMiddleware("loginValidator"), authController.login);

authRouter.post("/logout", authController.logout);

authRouter.post("/refresh", authController.refresh);

export default authRouter;
