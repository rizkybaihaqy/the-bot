import {tap} from './index'

const mockDebug = jest.fn ()
jest.mock ('debug', () => {
  return () => mockDebug
})

describe ('tap', () => {
  it ('should expose a function', () => {
    expect (tap).toBeDefined ()
  })

  it ('should call debug function', () => {
    tap ('test') ('test text') ('test value')
    expect (mockDebug).toBeCalled ()
  })

  it ('should return expected output', () => {
    expect (tap ('test') ('test text') ('test value')).toBe (
      'test value',
    )
  })
})
