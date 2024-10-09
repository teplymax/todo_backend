import express from "express";
import { db } from "../db";

const apiRouter = express.Router();

apiRouter.get("/helloWorld", async (_req, res) => {
  try {
    const todos = await db.query("SELECT * FROM Todos");

    res.status(200).send(`Hello World! Todos: ${JSON.stringify(todos)}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default apiRouter;
