import express from "express";

import { todoController } from "@controllers/TodoController";
import { authMiddleware } from "@middlewares/auth.middleware";
import { validationMiddleware } from "@middlewares/validation.middleware";

const todoRouter = express.Router();

todoRouter.get("/", authMiddleware, todoController.getTodos);

todoRouter.get("/:todoId", authMiddleware, todoController.getTodo);

todoRouter.post("/create", authMiddleware, validationMiddleware("createTodoValidator"), todoController.createTodo);

todoRouter.post("/edit/:todoId", authMiddleware, validationMiddleware("editTodoValidator"), todoController.editTodo);

todoRouter.delete("/delete/:todoId", authMiddleware, todoController.deleteTodo);

export default todoRouter;
