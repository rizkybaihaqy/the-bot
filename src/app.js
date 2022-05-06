import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { dispatcher } from "fluture-express";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";

const app = express();

const dispatch = dispatcher(path.resolve(__dirname, "actions"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.get("/json", dispatch("welcome"));

export default app;
