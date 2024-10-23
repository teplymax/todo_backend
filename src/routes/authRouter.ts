import express from "express";
import { db } from "../db";
import { Todo } from "../db/entities/Todo.entity";

const authRouter = express.Router();

authRouter.post("/register");

export default authRouter;
