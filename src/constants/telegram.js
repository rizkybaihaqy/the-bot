require("dotenv").config();

export const { TOKEN } = process.env;
export const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
export const URI = `/webhook/${TOKEN}`;
