import { TELEGRAM_API } from "../../constants/telegram";
import { flAxios } from "../fluture";

export const echo = (chatId) => (text) =>
  flAxios(
    ("POST",
    {
      url: `${TELEGRAM_API}/sendMessage`,
      data: {
        chat_id: chatId,
        text: text,
      },
    })
  );
