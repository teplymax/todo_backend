import express from "express";

import { authMiddleware } from "@middlewares/auth.middleware";

import { db } from "../db";
import { Todo } from "../db/entities/Todo.entity";

import authRouter from "./auth.router";

const apiRouter = express.Router();

apiRouter.get("/helloWorld", authMiddleware, async (_req, res) => {
  try {
    const todos = await db.getRepository(Todo).find();

    res.status(200).json({ todos });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

apiRouter.use("/auth", authRouter);

export default apiRouter;
