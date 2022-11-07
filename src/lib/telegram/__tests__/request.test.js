import { mockBody, mockChat } from '../../../../test/helper'
import { fetchTrackId, reply, sendMessage } from '../request'

describe ('sendMessage', () => {
  it ('Should return future of request telegram send message', () => {
    const ret = sendMessage (642130106) ('test')
    expect (ret.toString ()).toIncludeMultiple ([
      'encaseP',
      '"chat_id": 642130106',
      '"text": "test"',
    ])
  })
})

describe ('fetchTrackId', () => {
  it ('Should return future of request axios request to indihome api', () => {
    const ret = fetchTrackId ('MYID-2122202231153')
    expect (ret.toString ()).toIncludeMultiple ([
      'encaseP',
      '"trackId": "MYID-2122202231153"',
    ])
  })
})

describe ('reply', () => {
  it ('Should return future of request send Message from request', () => {
    const ret = reply ('test') (
      mockBody ({chat: mockChat, text: 'test'}),
    )
    expect (JSON.stringify (ret)).toIncludeMultiple ([
      '"type":"resolve"',
      '"args":[642130106]',
      '"type":"chain"',
    ])
  })
})
