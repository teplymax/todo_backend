import express from "express";
import { db } from "../db";
import { Todo } from "../db/entities/Todo.entity";

const apiRouter = express.Router();

apiRouter.get("/helloWorld", async (_req, res) => {
  try {
    const todos = await db.getRepository(Todo).find();

    res.status(200).json({ todos });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default apiRouter;
