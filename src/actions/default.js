import {JSONData} from '../lib/fluture'
import {S} from '../lib/sanctuary'

export default locals => req =>
  S.pipe ([
    _ => 'Default Handler Only In Dev',
    locals.sendMessage ({remove_keyboard: true}),
    S.map (JSONData),
  ]) (req)
