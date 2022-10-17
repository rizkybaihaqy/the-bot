import {JSONData} from '../../fluture'
import {S} from '../../sanctuary'
import {reply} from '../request'

export const invalid = S.pipe ([
  reply ('Invalid Bot Command'),
  S.map (JSONData),
])
