import cookieParser from "cookie-parser";
import cors from "cors";
import express, { json } from "express";

import config from "@config/index";
import apiRouter from "@routes";
import { errorHandler } from "@utils/errors/errorHandler";

const app = express();
const port = config.port;

app.use(json());
app.use(cookieParser());
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use("/api", apiRouter);

app.use(errorHandler);
