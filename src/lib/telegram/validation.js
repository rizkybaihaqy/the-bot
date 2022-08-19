import $ from "sanctuary-def";
import { S } from "../sanctuary/instance";

export const isTextAvailable = S.ifElse(
  S.pipe([S.get(S.is($.String))("text"), S.isNothing])
)((_) =>
  S.Left("No Text Found. Did not support other chat type other than text")
)(S.Right);

export const isChatIdAvailable = S.ifElse(
  S.pipe([S.gets(S.is($.Number))(["chat", "id"]), S.isNothing])
)((_) =>
  S.Left("No Text Found. Who Are You?")
)(S.Right);
