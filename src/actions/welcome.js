import {Json} from 'fluture-express'
import F from 'fluture'

export default (_) => (_) => {
  const welcome = 'stranger'
  return F.resolve (Json ({welcome}))
}
