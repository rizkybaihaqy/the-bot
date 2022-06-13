require("dotenv").config();
import axios from "axios";
import cookieParser from "cookie-parser";
import express from "express";
import Future, { fork, reject } from "fluture";
import { dispatcher } from "fluture-express";
import { env as flutureEnv } from "fluture-sanctuary-types";
import logger from "morgan";
import path from "path";
import sanctuary from "sanctuary";
import $ from "sanctuary-def";
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";

const S = sanctuary.create({
  checkTypes: true,
  env: sanctuary.env.concat(flutureEnv),
});

const app = express();

const { TOKEN } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;

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
  const tap = (x) => (console.log(x), x);

  const getMessageFromRequest = S.pipe([
    S.gets(S.is($.Object))(["body", "message"]),
    S.maybeToEither("No Message Found. Did not support updated message"),
  ]);

  const echo = (chatId) => (text) =>
    Future((rej, res) => {
      axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: text,
      });
      return () => {};
    });

  const execute = fork((rej) => console.log("reject", rej))((res) =>
    console.log("resolve", res)
  );

  const eitherToFuture = S.either(Future.reject)(Future.resolve);

  S.pipe([
    getMessageFromRequest,
    eitherToFuture,
    S.chain((msg) => echo(msg.chat.id)(msg.text)),
    execute,
  ])(req);

  return res.send();
});

export default app;
