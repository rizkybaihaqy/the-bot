import {Json} from 'fluture-express'
import Future from 'fluture'

export default (_) => (_) => {
  const welcome = 'stranger'
  return Future.resolve (Json ({welcome}))
}
