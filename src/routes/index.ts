import express from "express";

import accountRouter from "./account.router";
import authRouter from "./auth.router";
import categoryRouter from "./category.router";
import todoRouter from "./todo.router";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);

apiRouter.use("/category", categoryRouter);

apiRouter.use("/todo", todoRouter);

apiRouter.use("/account", accountRouter);

export default apiRouter;
