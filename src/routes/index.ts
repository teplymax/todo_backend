import express from "express";

const apiRouter = express.Router();

apiRouter.get("/helloWorld", (_req, res) => {
  res.send("Hello World!");
});

export default apiRouter;
