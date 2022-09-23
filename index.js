const TelegramApi = require("node-telegram-bot-api");

const sequelize = require('./db');
const UsersModel = require('./models');
const { menu, reg, partners_cat, back } = require('./keyboards');
const Users = require("./models");

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
    } else if (msg.text === 'Вернуться к меню') {
      return (
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

const continueSos = async (chatId) => {
  return bot.addListener('message', async (msg) => {
    if (msg.text.length >= 25) {

      let allUsersId = await Users.findAll({
        attributes: ['chatId'],
      });

      console.log(msg);

      allUsersId.forEach(async (userId) => {

        if (userId.chatId != chatId) {
          await bot.sendMessage(userId.chatId, `Пришла просьба о помощи!\nНапиши ей/ему скорее!`)
          return bot.sendMessage(
            userId.chatId,
            msg.text,
            back
          )
        }
      })

      return (
        bot.sendMessage(chatId, `Ваша просьба о помощи отправлена, надеюсь вам в скором времени помогут :)`, back),
        bot.removeListener("message"),
        start()
      )
    } else if (msg.text === 'Вернуться к меню') {
      return (
        bot.removeListener("message"),
        start()
      )
    } else {
      return (
        bot.sendMessage(chatId, `Ваше сообщение слишком короткое, попробуйте описать проблему подробнее`),
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
    console.log(msg);
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
        await bot.sendPhoto(
          chatId,
          'src/img/logo.jpeg'
        )
        return (
          bot.sendMessage(
            chatId,
            `Мы VAG клуб Чебоксар!\nИ прочий текст`,
            back
          )
        )
      }
      if (text === "/events" || text === "Мероприятия") {
        await bot.sendPhoto(
          chatId,
          'src/img/event1.jpeg'
        )
        return (
          bot.sendMessage(
            chatId,
            `Ближайшая запланированная встреча состоится 1 октября\nМесто проведения встречи: Театр оперы и балета\nВремя встречи: 20:00`,
            back
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
        await bot.sendMessage(chatId, "Введи номер авто в формате A000AA00 или A000AA000 используя латинские буквы", back);
        return searchCar(chatId)
      }
      if (text === "/sos" || text === "Запросить помощь") {
        return bot.sendMessage(
          chatId,
          "Надеюсь вы не шутите, ведь ваша просьба прилетит всем зарегистрированным участникам сообщества",
          {
            reply_markup: {
              keyboard: [
                [{ text: 'Я передумал и хочу вернуться в меню', callback_data: "/leaveSos" }],
                [{ text: 'Все серьезно, у меня беда.\nХочу продолжить', callback_data: "/continueSos" }],
              ],
            }
          }
        )
      }
      if (text === "Все серьезно, у меня беда.\nХочу продолжить") {
        return (bot.sendMessage(
          chatId,
          "Коротко опишите вашу проблему и сообщите адрес, где вы находитесь.\nВажно!!!\nНе забудьте написать номер вашего телефона или оставьте ссылку на ваш телеграмм-профиль, иначе с вами не смогут связаться",
          {
            reply_markup: {
              keyboard: [
                [{ text: 'Вернуться к меню', callback_data: "/leaveSos" }],
              ],
            }
          }
        ),
          continueSos(chatId)
        )
      }
      if (text === "Показать меню" || text === "Вернуться к меню" || text === "Я передумал и хочу вернуться в меню") {
        return (
          bot.sendMessage(
            chatId,
            `Что вас интересует?`,
            menu
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
  });
};


start();

