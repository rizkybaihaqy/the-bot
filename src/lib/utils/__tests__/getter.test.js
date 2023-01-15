import {S} from '../../sanctuary'
import {getArrayElement} from '../getter'

describe ('getArrayElement', () => {
  it ('Should get single element from array at index 1', () => {
    const elm = getArrayElement (0) ([1, 2, 3, 4])
    expect (S.show (elm)).toBe ('Just (1)')
  })

  it ('Should return Nothing if requested index is out of bound', () => {
    const elm = getArrayElement (5) ([1, 2, 3, 4])
    const empty = getArrayElement (1) ([])
    expect (S.show (elm)).toBe ('Nothing')
    expect (S.show (empty)).toBe ('Nothing')
  })

  it ('Should return Nothing if requested index is < 0', () => {
    const elm = getArrayElement (-1) ([1, 2, 3, 4])
    const empty = getArrayElement (-1) ([1, 2, 3, 4])
    expect (S.show (elm)).toBe ('Nothing')
    expect (S.show (empty)).toBe ('Nothing')
  })
})
