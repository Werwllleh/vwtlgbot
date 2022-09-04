const TelegramApi = require("node-telegram-bot-api");

const sequelize = require('./db');
const UserModel = require('./models');
const { allBtns } = require('./keyboards');

const token = "5632609691:AAHJ6CvPeasSSrUHoGZePHEeLudoZv3sIR4";

const bot = new TelegramApi(token, { polling: true });

const start = async () => {

  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (e) {
    console.log('Подключение к бд сломалось');
  }

  bot.setMyCommands([
    { command: "/start", description: "Приветствие" },
    { command: "/info", description: "Информация о клубе" },
    { command: "/partners", description: "Партнеры клуба" },
    { command: "/ourcars", description: "Наши авто" },
    { command: "/events", description: "Мероприятия" },
    { command: "/searchcar", description: "Поиск авто по ГРЗ" },
    { command: "/sos", description: "Запросить помошь" },
    { command: "/donate", description: "Донат на поддержку клуба" },
    { command: "/salecars", description: "Продажа авто" }
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log(msg);

    try {
      if (text === "/start") {
        await UserModel.create({ chatId });
        await bot.sendSticker(
          chatId,
          "https://tlgrm.ru/_/stickers/f05/e49/f05e49e1-57e9-31b7-a7de-1d0b09fea98e/5.webp"
        );
        return bot.sendMessage(
          chatId,
          `Добро пожаловать в телеграм бот VAG клуба Чебоксар!`,
        );
      }
      if (text === "/info") {
        return bot.sendMessage(
          chatId,
          `Мы VAG клуб Чебоксар!`,
          allBtns
        );
      }
      if (text === "/partners") {
        return bot.sendMessage(
          chatId,
          `Партнеры клуба`,
          allBtns
        );
      }
      if (text === "/ourcars") {
        return bot.sendMessage(
          chatId,
          `Наши авто`,
          allBtns
        );
      }
      if (text === "/events") {
        return bot.sendMessage(
          chatId,
          `Мероприятия`,
          allBtns
        );
      }
      if (text === "/searchcar") {
        return bot.sendMessage(
          chatId,
          `Поиск авто по ГРЗ`,
          allBtns
        );
      }
      if (text === "/sos") {
        return bot.sendMessage(
          chatId,
          `Запросить помошь`,
          allBtns
        );
      }
      if (text === '/donate') {
        return bot.sendMessage(
          chatId,
          `Донат на поддержку клуба`,
          allBtns
        );
      }
      if (text === '/salecars') {
        return bot.sendMessage(
          chatId,
          `Продажа авто`,
          allBtns
        );
      }
      return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!");
    } catch (e) {
      return bot.sendMessage(chatId, "Произошла какая-то ошибка");
    }
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/info') {
      return bot.sendMessage(
        chatId,
        `Мы VAG клуб Чебоксар!`,
        allBtns
      );
    }
    if (data === '/partners') {
      return bot.sendMessage(
        chatId,
        `Партнеры`,
        allBtns
      );
    }
    if (data === '/ourcars') {
      return bot.sendMessage(
        chatId,
        `Наши авто`,
        allBtns
      );
    }
    if (data === '/events') {
      return bot.sendMessage(
        chatId,
        `Мероприятия`,
        allBtns
      );
    }
    if (data === '/searchcar') {
      return bot.sendMessage(
        chatId,
        `Поиск авто по ГРЗ`,
        allBtns
      );
    }
    if (data === '/sos') {
      return bot.sendMessage(
        chatId,
        `Запросить помошь`,
        allBtns
      );
    }
    if (data === '/donate') {
      return bot.sendMessage(
        chatId,
        `Поддержать клуб`,
        allBtns
      );
    }
    if (data === '/salecars') {
      return bot.sendMessage(
        chatId,
        `Продажа авто`,
        allBtns
      );
    }
  });
};

start();
