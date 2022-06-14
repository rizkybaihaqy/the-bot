require("dotenv").config();
import axios from "axios";
import cookieParser from "cookie-parser";
import express from "express";
import Future, { encaseP, fork } from "fluture";
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

  const flAxios = encaseP(axios);

  const echo = (chatId) => (text) =>
    flAxios(
      ("POST",
      {
        url: `${TELEGRAM_API}/sendMessage`,
        data: {
          chat_id: chatId,
          text: text,
        },
      })
    );

  const execute = fork((rej) => (console.log(rej), rej))(
    (res) => (console.log(res), res)
  );

  const eitherToFuture = S.either(Future.reject)(Future.resolve);

  return S.pipe([
    getMessageFromRequest,
    eitherToFuture,
    S.chain((msg) => echo(msg.chat.id)(msg.text)),
    execute,
  ])(req);
});

export default app;
