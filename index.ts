import express from "express";

import config from "@config";
import apiRouter from "@routes";
import { errorHandler } from "@utils/errors/errorHandler";

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`, config.db);
});

app.use("/api", apiRouter);

app.use(errorHandler);
