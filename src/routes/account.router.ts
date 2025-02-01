import express from "express";

import { accountController } from "@controllers/AccountController";
import { authMiddleware } from "@middlewares/auth.middleware";
import { validationMiddleware } from "@middlewares/validation.middleware";

const accountRouter = express.Router();

accountRouter.get("/", authMiddleware, accountController.getAccount);

accountRouter.patch("/", authMiddleware, validationMiddleware("editAccountValidator"), accountController.editAccount);

accountRouter.delete("/", authMiddleware, accountController.deleteAccount);

export default accountRouter;
