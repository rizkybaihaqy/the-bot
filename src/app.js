require("dotenv").config();
import axios from "axios";
import cookieParser from "cookie-parser";
import express from "express";
import { dispatcher } from "fluture-express";
import logger from "morgan";
import path from "path";
import Future, { fork } from "fluture";
import { fromMaybe, gets, is, isNothing, pipe, props } from "sanctuary";
import $ from "sanctuary-def";
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";

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
  const getChatId = gets(is($.Integer))(["body", "message", "chat", "id"]);
  const getText = gets(is($.String))(["body", "message", "text"]);
  const chatId = getChatId(req);
  const text = getText(req);

  if (isNothing(chatId) && isNothing(text)) {
    return res.send();
  }

  const sendMessage = Future((rej, res) => {
    axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: fromMaybe(0)(chatId),
      text: fromMaybe("")(text),
    });
    return () => {};
  });

  const execute = fork((rej) => console.log("reject", rej))((res) =>
    console.log("resolve", res)
  );
  sendMessage.pipe(execute);

  return res.send();
});

export default app;
