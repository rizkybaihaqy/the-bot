import {
  mockBody,
  mockEntities,
} from '../../../../test/helper'
import {isBotCommand} from '../predicate'

describe ('isBotCommand', () => {
  it ('Should return true when entities with type bot command detected', () => {
    const ret = isBotCommand (
      mockBody ({entities: mockEntities}),
    )
    expect (ret).toBe (true)
  })

  it ('Should return true when entities with type bot command detected', () => {
    const ret = isBotCommand (
      mockBody ({
        entities: {offset: 0, length: 6, type: 'mention'},
      }),
    )
    expect (ret).toBe (false)
  })
})
