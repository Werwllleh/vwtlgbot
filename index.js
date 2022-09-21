const TelegramApi = require("node-telegram-bot-api");

const sequelize = require('./db');
const UsersModel = require('./models');
const { menu, reg, partners_cat, back } = require('./keyboards');

const token = "5632609691:AAHJ6CvPeasSSrUHoGZePHEeLudoZv3sIR4";

const bot = new TelegramApi(token, { polling: true });

const searchCar = async (chatId) => {
  await bot.sendMessage(chatId, `Введи номер автомобиля латинскими буквами в формате X999XX99/999`, back)
  return bot.on('message', async (msg) => {
    queryGrz = String(msg.text).toUpperCase();
    carNum = await UsersModel.findOne({ where: { carGRZ: queryGrz } });
    console.log(msg.from.is_bot);
  })
}

/* if (queryGrz === carNum.carGRZ) {
  bot.sendMessage(
    chatId,
    `Владелец: ${carNum.userName} ${carNum.userSurName}\nАвтомобиль: ${carNum.carModel}\nГод выпуска: ${carNum.carYear}`
  )
} else {
  bot.sendMessage(
    chatId,
    `Автомобиль с таким номером не найден`
  )
} */

/* bot.setMyCommands([
              { command: "/info", description: "Информация о клубе" },
              { command: "/partners", description: "Партнеры клуба" },
              { command: "/ourcars", description: "Наши авто" },
              { command: "/events", description: "Мероприятия" },
              { command: "/searchcar", description: "Поиск авто по ГРЗ" },
              { command: "/sos", description: "Запросить помошь" },
              { command: "/donate", description: "Донат на поддержку клуба" },
              { command: "/salecars", description: "Продажа авто" }
            ]) */

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    console.log('Connection has been established successfully.');
  } catch (e) {
    console.log('Подключение к бд сломалось');
    console.log(e);
  }

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    try {
      if (text === "/start") {
        const userChatId = await UsersModel.findOne({ where: { chatId: chatId } });
        if (userChatId) {
          return (
            bot.sendMessage(
              chatId,
              `Добро пожаловать в телеграм бот VAG клуба Чебоксар!`,
              menu
            )
          )
        } else {
          // return UsersModel.create({ chatId });
          return bot.sendMessage(
            chatId,
            `Добро пожаловать в телеграм бот VAG клуба Чебоксар!\nПожалуйста зарегистрируйтесь`,
            reg
          )
        }
      }
      if (text === "/info" || text === "Информация о клубе") {
        return bot.sendMessage(
          chatId,
          `Мы VAG клуб Чебоксар!\nИ прочий текст`,
          back
        )
      }
      if (text === "Показать меню" || text === "Вернуться к меню") {
        return (
          bot.sendMessage(
            chatId,
            `Что вас интересует?`,
            menu
          )
        )
      }
      if (text === "/partners" || text === "Партнеры" || text === "Партнеры клуба") {
        return (
          bot.sendMessage(
            chatId,
            `Выберите категорию:`,
            partners_cat
          )
        )
      }
      if (text === "/searchcar" || text === "Поиск авто по ГРЗ" || text === "Искать еще раз") {
        return (
          bot.sendMessage(
            chatId,
            `Введи номер автомобиля латинскими буквами в формате X999XX99/999`
          )
        )
      }
    } catch (e) {
      return bot.sendMessage(chatId, "Произошла какая-то ошибка");
    }
  });

  bot.on("web_app_data", async (msg) => {
    // bot.sendMessage(msg.chat.id, msg.web_app_data.data);
    let strMsg = msg.web_app_data.data;
    let arrData = strMsg.split(',');

    let name = arrData[0].trim();
    let surname = arrData[1].trim();
    let car = arrData[2].trimEnd();

    return (
      UsersModel.create({
        chatId: msg.chat.id,
        userName: name[0].toUpperCase() + name.substring(1),
        userSurName: surname[0].toUpperCase() + surname.substring(1),
        carModel: car.toLowerCase(),
        carYear: arrData[3],
        carGRZ: arrData[4].toUpperCase(),
        carEngineModel: arrData[5].toUpperCase()
      }),
      bot.sendMessage(
        msg.chat.id,
        `Добро пожаловать ${name[0].toUpperCase() + name.substring(1)}!\nЧто тебя интересует?`,
        menu
      )
    )
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/back') {
      return (
        bot.sendMessage(
          chatId,
          `Что вас интересует?`,
          menu
        )
      )
    }
    if (data === '/searchAgain') {
      return searchCar(chatId)
    }
  });
};

start();