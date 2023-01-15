import {
  mockBody,
  mockChat,
  mockEntities,
  mockText,
} from '../../../../test/helper'
import {S} from '../../sanctuary'
import {
  getBotCommandArgument,
  getBotCommandFromRequest,
  getChatIdFromRequest,
  getEntityFromRequest,
  getEntityLength,
  getEntityOffset,
  getMessageFromRequest,
  getNBotCommandArgumentsBySpace,
  getTextFromRequest,
} from '../getter'

describe ('getMessageFromRequest', () => {
  it ('Should return Right with message from request', () => {
    const msg = getMessageFromRequest (
      mockBody ({chat: mockChat})
    )
    expect (S.isRight (msg)).toBe (true)
    expect (S.show (msg)).toStartWith ('Right ({')
    expect (S.show (msg)).toInclude ('"message_id": 1824')
  })

  it ('Should return Left with error message', () => {
    const msg = getMessageFromRequest (null)
    expect (S.isLeft (msg)).toBe (true)
    expect (S.show (msg)).toBe (
      'Left ("No Message Found. Did not support updated message")'
    )
  })
})

describe ('getChatIdFromRequest', () => {
  it ('Should return Right with chat_id from request', () => {
    const msg = getChatIdFromRequest (
      mockBody ({chat: mockChat})
    )
    expect (S.isRight (msg)).toBe (true)
    expect (S.show (msg)).toBe ('Right (642130106)')
  })

  it ('Should return Left with error message', () => {
    const msg = getChatIdFromRequest (mockBody ({chat: null}))
    expect (S.isLeft (msg)).toBe (true)
    expect (S.show (msg)).toBe (
      'Left ("No Chat Id Found. Who are you?")'
    )
  })
})

describe ('getTextFromRequest', () => {
  it ('Should return Right with text from request', () => {
    const msg = getTextFromRequest (
      mockBody ({text: mockText})
    )
    expect (S.isRight (msg)).toBe (true)
    expect (S.show (msg)).toBe (
      'Right ("/visit 1 deal mip jl_padi")'
    )
  })

  it ('Should return Left with error message', () => {
    const msg = getTextFromRequest (mockBody ({text: null}))
    expect (S.isLeft (msg)).toBe (true)
    expect (S.show (msg)).toBe (
      'Left ("No Text Found. Did not support other chat type other than text")'
    )
  })
})

describe ('getEntityFromRequest', () => {
  it ('Should return Right with entity object from request', () => {
    const msg = getEntityFromRequest (
      mockBody ({entities: mockEntities})
    )
    expect (S.isRight (msg)).toBe (true)
    expect (S.show (msg)).toStartWith ('Right ({')
    expect (S.show (msg)).toIncludeMultiple ([
      'offset',
      'length',
      'type',
    ])
  })

  it ('Should return Left with error message', () => {
    const msg = getEntityFromRequest (
      mockBody ({entities: []})
    )
    expect (S.isLeft (msg)).toBe (true)
    expect (S.show (msg)).toBe (
      'Left ("No Entities Found, Maybe Its A Plain Text")'
    )
  })
})

describe ('getEntityOffset', () => {
  it ('Should return number from entity object', () => {
    const msg = getEntityOffset (
      mockBody ({entities: [{offset: 1}]})
    )
    expect (msg).toBe (1)
  })
})

describe ('getEntityLength', () => {
  it ('Should return number from entity object', () => {
    const msg = getEntityLength (
      mockBody ({entities: [{length: 6}]})
    )
    expect (msg).toBe (6)
  })
})

describe ('getBotCommandFromRequest', () => {
  it ('Should return Right with bot command string from request', () => {
    const msg = getBotCommandFromRequest (
      mockBody ({text: mockText, entities: mockEntities})
    )
    expect (S.isRight (msg)).toBe (true)
    expect (S.show (msg)).toBe ('Right ("/visit")')
  })

  it ('Should return Left with error message if no text found', () => {
    const msg = getBotCommandFromRequest (
      mockBody ({text: null, entities: mockEntities})
    )
    expect (S.isLeft (msg)).toBe (true)
    expect (S.show (msg)).toBe (
      'Left ("No Text Found. Did not support other chat type other than text")'
    )
  })

  it ('Should return Left with error message if no entities found', () => {
    const msg = getBotCommandFromRequest (
      mockBody ({text: mockText, entities: null})
    )
    expect (S.isLeft (msg)).toBe (true)
    expect (S.show (msg)).toBe (
      'Left ("Not A Bot Command, Maybe Its A Plain Text")'
    )
  })
})

describe ('getBotCommandArgument', () => {
  it ('Should return Right with bot command argument string from request', () => {
    const msg = getBotCommandArgument (
      mockBody ({
        text: '/order MYID-2122202231153',
        entities: [{offset: 0, length: 6}],
      })
    )
    expect (S.isRight (msg)).toBe (true)
    expect (S.show (msg)).toBe ('Right ("MYID-2122202231153")')
  })

  it ('Should return Left with error message', () => {
    const msg = getBotCommandArgument (
      mockBody ({
        text: '/order',
        entities: [{offset: 0, length: 6}],
      })
    )
    expect (S.isLeft (msg)).toBe (true)
    expect (S.show (msg)).toBe (
      'Left ("This Command Need At Least One Or More Argument")'
    )
  })
})

describe ('getNBotCommandArgumentsBySpace', () => {
  it ('Should return Right with array of bot command string from request', () => {
    const msg = getNBotCommandArgumentsBySpace (4) (
      mockBody ({
        text: '/visit\n1\ndeal\nmip\njl_padi',
        entities: mockEntities,
      })
    )
    expect (S.isRight (msg)).toBe (true)
    expect (S.show (msg)).toBe (
      'Right (["1", "deal", "mip", "jl_padi"])'
    )
  })

  it ('Should return Left with error message', () => {
    const msg = getNBotCommandArgumentsBySpace (4) (
      mockBody ({
        text: '/visit 1 mip deal',
        entities: mockEntities,
      })
    )
    expect (S.isLeft (msg)).toBe (true)
    expect (S.show (msg)).toBe (
      'Left ("Command Expect 4 Argument")'
    )
  })
})
