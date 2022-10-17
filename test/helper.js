export const mockChat = {
  id: 642130106,
  first_name: 'Brondy',
  username: 'Tomgunny',
  type: 'private',
}

export const mockText = '/visit 1 deal mip jl_padi'

export const mockEntities = [
  {
    offset: 0,
    length: 6,
    type: 'bot_command',
  },
]

export const mockBody = ({chat, text, entities}) => ({
  body: {
    update_id: 188660855,
    message: {
      message_id: 1824,
      from: {
        id: 642130106,
        is_bot: false,
        first_name: 'Brondy',
        username: 'Tomgunny',
        language_code: 'en',
      },
      chat,
      date: 1665043366,
      text,
      entities,
    },
  },
})
