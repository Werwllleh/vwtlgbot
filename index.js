const TelegramApi = require("node-telegram-bot-api");

const sequelize = require('./db');
const UsersModel = require('./models');
const { menu, reg, partners_cat, back } = require('./keyboards');

const token = "5632609691:AAHJ6CvPeasSSrUHoGZePHEeLudoZv3sIR4";

const bot = new TelegramApi(token, { polling: true });

const searchCar = async (chatId) => {
  return bot.addListener('message', async (msg) => {
    if (/^[aвекмнорстухabekmhopctyxАВЕКМНОРСТУХABEKMHOPCTYX]\d{3}(?<!000)[aвекмнорстухabekmhopctyxАВЕКМНОРСТУХABEKMHOPCTYX]{2}\d{2,3}$/.test(msg.text)) {
      queryGrz = String(msg.text).toUpperCase();
      carNum = await UsersModel.findOne({ where: { carGRZ: queryGrz } });
      return (
        bot.sendMessage(chatId, `Владелец: ${carNum.userName} ${carNum.userSurName}\nАвтомобиль: ${carNum.carModel}\nГод выпуска: ${carNum.carYear}`),
        bot.removeListener("message"),
        start()
      )
    } else {
      return (
        bot.sendMessage(chatId, `Не найдено`),
        bot.removeListener("message"),
        start()
      )
    }
  })
}


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
      if (text === "/searchcar" || text === "Поиск авто по ГРЗ") {
        await bot.sendMessage(chatId, "Тебе нужно будет ввести номер в формате X999XX99/999 используя латинские буквы");
        return searchCar(chatId)
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

    // if (data === '/back') {}
  });
};


start();

