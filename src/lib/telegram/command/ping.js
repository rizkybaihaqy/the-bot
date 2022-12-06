import {JSONData} from '../../fluture'
import {S} from '../../sanctuary'
import {reply} from '../reply'

export const ping = S.pipe ([ reply ('pong'), S.map (JSONData) ])
