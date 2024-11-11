import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import config from "@config";
import apiRouter from "@routes";
import { errorHandler } from "@utils/errors/errorHandler";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`, config.db);
});

app.use("/api", apiRouter);

app.use(errorHandler);
