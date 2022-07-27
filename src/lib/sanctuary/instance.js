import sanctuary from "sanctuary";
import { env as flutureEnv } from "fluture-sanctuary-types";

export const S = sanctuary.create({
  checkTypes: true,
  env: sanctuary.env.concat(flutureEnv),
});
