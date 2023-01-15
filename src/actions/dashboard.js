import {Render} from 'fluture-express'
import {F} from '../lib/fluture'

export default locals => _ => {
  const user = 'you'
  return F.resolve (Render ('dashboard') ({user}))
}
