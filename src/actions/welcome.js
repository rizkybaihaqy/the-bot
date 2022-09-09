import F from 'fluture'
import {Json} from 'fluture-express'

export default (_) => (_) => {
  const welcome = 'stranger'
  return F.resolve (Json ({welcome}))
}
