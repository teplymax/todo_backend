import express from "express";
import dotenv from "dotenv";
import apiRouter from "./src/routes";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use("/api", apiRouter);
