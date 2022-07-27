import $ from "sanctuary-def";
import { S } from "../sanctuary/instance";

export const getMessageFromRequest = S.pipe([
  S.gets(S.is($.Object))(["body", "message"]),
  S.maybeToEither("No Message Found. Did not support updated message"),
]);
