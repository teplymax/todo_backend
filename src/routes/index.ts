import express from "express";

import authRouter from "./auth.router";
import categoryRouter from "./category.router";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);

apiRouter.use("/category", categoryRouter);

export default apiRouter;
