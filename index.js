const TelegramApi = require("node-telegram-bot-api");
const token = "5632609691:AAHJ6CvPeasSSrUHoGZePHEeLudoZv3sIR4";

const bot = new TelegramApi(token, { polling: true });

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Приветствие" },
    { command: "/info", description: "Информация о клубе" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/f05/e49/f05e49e1-57e9-31b7-a7de-1d0b09fea98e/5.webp"
      );
      return bot.sendMessage(
        chatId,
        `Добро пожаловать в телеграм бот VAG клуба Чебоксар!`
      );
    }

    if (text === "/info") {
      return bot.sendMessage(chatId, `Мы VAG клуб Чебоксар!`);
    }
    return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!");
  });
};

start();
