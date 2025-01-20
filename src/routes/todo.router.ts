import express from "express";

import { todoController } from "@controllers/TodoController";
import { authMiddleware } from "@middlewares/auth.middleware";
import { validationMiddleware } from "@middlewares/validation.middleware";

const todoRouter = express.Router();

todoRouter.get("/", authMiddleware, todoController.getTodos);

todoRouter.get("/:todoId", authMiddleware, todoController.getTodo);

todoRouter.post("/", authMiddleware, validationMiddleware("createTodoValidator"), todoController.createTodo);

todoRouter.patch("/:todoId", authMiddleware, validationMiddleware("editTodoValidator"), todoController.editTodo);

todoRouter.delete("/:todoId", authMiddleware, todoController.deleteTodo);

export default todoRouter;
