import {isEmptyString} from '../predicate'

describe ('isEmptyString', () => {
  it ('Should return true when string is empty', () => {
    const ret = isEmptyString ('')
    expect (ret).toBe (true)
  })

  it ('Should return false when string is empty', () => {
    const ret = isEmptyString ('not empty')
    expect (ret).toBe (false)
  })
})
