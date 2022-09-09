import {env as flutureEnv} from 'fluture-sanctuary-types'
import sanctuary from 'sanctuary'

export const S = sanctuary.create ({
  checkTypes: true,
  env: sanctuary.env.concat (flutureEnv),
})
