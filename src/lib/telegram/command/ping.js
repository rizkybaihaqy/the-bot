import { JSONData } from '../../fluture'
import { S } from '../../sanctuary/instance'
import { reply } from '../request'

export const ping = S.pipe ([ reply ('pong'), S.map (JSONData) ])
