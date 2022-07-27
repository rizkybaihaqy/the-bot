import cookieParser from "cookie-parser";
import express from "express";
import { dispatcher } from "fluture-express";
import logger from "morgan";
import path from "path";
import { URI } from "./constants/telegram";
import { eitherToFuture, execute } from "./lib/fluture";
import { S } from "./lib/sanctuary/instance";
import { getMessageFromRequest } from "./lib/telegram/getter";
import { echo } from "./lib/telegram/request";
import { isChatIdAvailable, isTextAvailable } from "./lib/telegram/validation";
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
// app.post(URI, dispatch("echo"));
app.post(URI, async (req, res) => {
  S.pipe([
    getMessageFromRequest,
    S.chain(isChatIdAvailable),
    S.chain(isTextAvailable),
    eitherToFuture,
    S.chain((msg) => echo(msg.chat.id)(msg.text)),
    execute,
  ])(req);

  res.send();
});

export default app;
