import express from "express";
import apiRouter from "./src/routes";
import config from "./src/config";

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`, config.db);
});

app.use("/api", apiRouter);
