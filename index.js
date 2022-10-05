const TelegramApi = require("node-telegram-bot-api");

const express = require('express');
const cors = require('cors');

const sequelize = require('./db');

const { menu, reg, partners, profileFields, searchAgain, back } = require('./keyboards');
const Users = require("./models");

const token = "5632609691:AAHJ6CvPeasSSrUHoGZePHEeLudoZv3sIR4";

const bot = new TelegramApi(token, { polling: true });

const app = express();

app.use(express.json());
app.use(cors());

process.env["NTBA_FIX_350"] = 1;

bot.setMyCommands();

let searchCar = () => {
  let regExp = /^[abekmhopctyxABEKMHOPCTYX]\d{3}(?<!000)[abekmhopctyxABEKMHOPCTYX]{2}\d{2,3}$/;
  bot.onText(regExp, async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    queryGrz = String(text).toUpperCase();
    carNum = await Users.findOne({ where: { carGRZ: queryGrz } });
    if (carNum) {
      if (carNum.carImage) {
        await bot.sendPhoto(chatId, `${carNum.carImage}`)
      }
      return (
        bot.sendMessage(chatId, `Владелец: ${carNum.userName} ${carNum.userSurName}\nАвтомобиль: ${carNum.carModel}\nГод выпуска: ${carNum.carYear}\nМодель двигателя: ${carNum.carEngineModel}`),
        bot.removeTextListener(regExp)
      )
    } else {
      return (
        bot.sendMessage(chatId, `Ничего не найдено(`),
        bot.removeTextListener(regExp)
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
        start(chatId)
      )
    } else if (msg.text === 'Вернуться к меню') {
      return (
        bot.removeListener("message"),
        start(chatId)
      )
    } else {
      return (
        bot.sendMessage(chatId, `Ваше сообщение слишком короткое, попробуйте описать проблему подробнее`),
        bot.removeListener("message"),
        start(chatId)
      )
    }
  })
}

const editProfile = async (chatId) => {
  return bot.addListener('message', async (msg) => {
    if (msg.text === 'Поменять авто') {
      await bot.sendMessage(chatId, `Напишите марку и модель латинскими буквами`, back)
      return bot.addListener('message', async (msg) => {
        if (/^[a-zA-Z\s]+\s[a-zA-Z0-9\s]+$/.test(msg.text)) {
          return (
            Users.update({ carModel: `${msg.text.toLowerCase().trimEnd()}` }, {
              where: {
                chatId: msg.chat.id
              }
            }),
            bot.sendMessage(chatId, `Вы обновили марку и модель авто`, back),
            bot.removeListener("message"),
            start(chatId)
          )
        } else if (msg.text === 'Вернуться к меню') {
          return (
            bot.removeListener("message"),
            start(chatId)
          )
        } else {
          return (
            bot.sendMessage(chatId, `Некорректный ввод, попробуйте еще раз`, back),
            bot.removeListener("message"),
            start(chatId)
          )
        }
      })
    } else if (msg.text === 'Сменить номер') {
      await bot.sendMessage(chatId, `Напишите гос. номер латинскими буквами\n(формат A000AA00 или A000AA000)`, back)
      return bot.addListener('message', async (msg) => {
        if (/^[АВЕКМНОРСТУХABEKMHOPCTYX]\d{3}(?<!000)[АВЕКМНОРСТУХABEKMHOPCTYX]{2}\d{2,3}$/.test(msg.text)) {
          return (
            Users.update({ carGRZ: `${msg.text.toUpperCase().trimEnd()}` }, {
              where: {
                chatId: msg.chat.id
              }
            }),
            bot.sendMessage(chatId, `Вы обновили гос. номер вашего автомобиля`, back),
            bot.removeListener("message"),
            start(chatId)
          )
        } else if (msg.text === 'Вернуться к меню') {
          return (
            bot.removeListener("message"),
            start(chatId)
          )
        } else {
          return (
            bot.sendMessage(chatId, `Некорректный ввод, попробуйте еще раз`, back),
            bot.removeListener("message"),
            start(chatId)
          )
        }
      })
    } else if (msg.text === 'Добавить/изменить модель двигателя') {
      await bot.sendMessage(chatId, `Напишите модель вашего двигателя\n(формат XXXX)`, back)
      return bot.addListener('message', async (msg) => {
        if (/^[a-zA-Z]+$/.test(msg.text)) {
          return (
            Users.update({ carEngineModel: `${msg.text.toUpperCase().trimEnd()}` }, {
              where: {
                chatId: msg.chat.id
              }
            }),
            bot.sendMessage(chatId, `Вы обновили модель вашего двигателя`, back),
            bot.removeListener("message"),
            start(chatId)
          )
        } else if (msg.text === 'Вернуться к меню') {
          return (
            bot.removeListener("message"),
            start(chatId)
          )
        } else {
          return (
            bot.sendMessage(chatId, `Некорректный ввод, попробуйте еще раз`, back),
            bot.removeListener("message"),
            start(chatId)
          )
        }
      })
    } else if (msg.text === 'Изменить год авто') {
      await bot.sendMessage(chatId, `Напишите год выпуска вашего авто`, back)
      return bot.addListener('message', async (msg) => {
        let date = new Date();
        let year = date.getFullYear();
        if (/^\d+$/.test(msg.text) && msg.text >= 1900 && msg.text <= year) {
          return (
            Users.update({ carYear: `${msg.text.trimEnd()}` }, {
              where: {
                chatId: msg.chat.id
              }
            }),
            bot.sendMessage(chatId, `Вы обновили год выпуска вашего авто`, back),
            bot.removeListener("message"),
            start(chatId)
          )
        } else if (msg.text === 'Вернуться к меню') {
          return (
            bot.removeListener("message"),
            start(chatId)
          )
        } else {
          return (
            bot.sendMessage(chatId, `Некорректный ввод, попробуйте еще раз`, back),
            bot.removeListener("message"),
            start(chatId)
          )
        }
      })
    } else if (msg.text === 'Добавить/поменять фото авто') {
      await bot.sendMessage(chatId, `Загрузите одно изображение вашего автомобиля`, back)
      return bot.addListener('message', async (msg) => {
        if (msg.photo) {
          let carImg = msg.photo[0].file_id;
          return (
            Users.update({ carImage: `${carImg}` }, {
              where: {
                chatId: msg.chat.id
              }
            }),
            bot.sendMessage(chatId, `Вы обновили фото вашего авто`, back),
            bot.removeListener("message"),
            start(chatId)
          )
        } else if (msg.text === 'Вернуться к меню') {
          return (
            bot.removeListener("message"),
            start(chatId)
          )
        } else {
          return (
            bot.sendMessage(chatId, `Вы не загрузили фотографию`, back),
            bot.removeListener("message"),
            start(chatId)
          )
        }
      })
    }
  })
}

try {
  sequelize.authenticate()
  sequelize.sync()
  console.log('Connection has been established successfully.');
} catch (e) {
  console.log('Подключение к бд сломалось', e);
}

const start = async () => {

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "Информация о клубе") {
      return (
        bot.sendMessage(
          chatId,
          `Привет привееет!\nНа связи VW/SK CLUB 21 - крупнейшее автосообщество ваговодов Чувашии☝🏻\n\nМы - одна большая семья, которая держится друг за друга, делится своими радостями и неудачами, а все остальные переживают это, помогают в решении вопроса и поддерживают!\nВсе любят покрасоваться своими ласточками и мы не исключение💥\nВвиду этого у нас стабильно проходят автовстречи, где собирается вся наша дружная семья и обсуждает все события в большом кругу.\nА затем флаги в руки и в конвой.\nМы проезжаем по центральным улицам Чебоксар, чтобы показать нашу активность и дружность.\nНе забудем сказать и про партнеров, которых у нас немало. И этот список постоянно пополняется. От доставки еды до ремонта турбины - огромное количество сфер готовы предоставить клубную скидку для таких умничек и молодцов😂😂\n\nУ тебя нет ВАГа, но ты настоящий фанат немецкого автопрома? Не переживай и приходи на встречу🥰 Мы любим и уважаем каждого участника.\nДумаем, что стало немного понятнее.\nПоэтому чего ждать - добро пожаловать к нам в клуб!!!🎉🎊🎉🎊🎉`
        )
      )
    }
    if (text === "Партнеры") {
      return (
        bot.sendMessage(
          chatId,
          `Перейдите для просмотра партнеров клуба ↓`,
          partners
        )
      )
    }
    if (text === "/sos" || text === "Запросить помощь") {
      return (
        bot.sendMessage(
          chatId,
          "Надеюсь вы не шутите, ведь ваша просьба прилетит всем зарегистрированным участникам сообщества",
          {
            reply_markup: {
              keyboard: [
                [{ text: 'Вернуться к меню', callback_data: "/leaveSos" }],
                [{ text: 'Все серьезно, у меня беда.\nХочу продолжить', callback_data: "/continueSos" }],
              ],
            }
          }
        )
      )
    }
    if (text === "Все серьезно, у меня беда.\nХочу продолжить") {
      return (
        bot.sendMessage(
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
    if (text === "Продажа авто") {
      return (
        bot.sendMessage(chatId, `Этот отдел еще в разработке`, back)
      )
    }
    if (text === "Поиск авто по ГРЗ") {
      await bot.sendMessage(chatId, "Введи номер авто в формате A000AA00 или A000AA000 используя латинские буквы", back);
      searchCar()
    }
    if (text === "Наши авто") {
      return (
        bot.sendMessage(chatId, `Этот отдел еще в разработке`, back)
      )
    }
    if (text === "Отредактировать профиль") {
      return bot.sendMessage(chatId, `Какие данные хотите изменить?`, profileFields)
    }

  });

};

bot.on("web_app_data", async (msg) => {
  // bot.sendMessage(msg.chat.id, msg.web_app_data.data);
  let strMsg = msg.web_app_data.data;
  let arrData = strMsg.split(',');

  let name = arrData[0].trim();
  let surname = arrData[1].trim();
  let car = arrData[2].trimEnd();
  let carYear = arrData[3];
  let carGRZ = arrData[4].toUpperCase();

  if (name == '' || surname == '' || surname == '' || car == '' || carYear == '' || carGRZ == '') {
    return bot.sendMessage(
      msg.chat.id,
      `Пожалуйста введите верные данные, попробуйте еще раз`,
      reg
    )
  } else {
    return (
      Users.create({
        chatId: msg.chat.id,
        userName: name[0].toUpperCase() + name.substring(1),
        userSurName: surname[0].toUpperCase() + surname.substring(1),
        carModel: car.toLowerCase(),
        carYear: carYear,
        carGRZ: arrData[4].toUpperCase(),
        carEngineModel: arrData[5].toUpperCase()
      }),
      bot.sendMessage(
        msg.chat.id,
        `Добро пожаловать ${name[0].toUpperCase() + name.substring(1)}!\nЧто тебя интересует?`,
        menu
      )
    )
  }
});

bot.onText(/\/start/, async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  const userChatId = await Users.findOne({ where: { chatId: chatId } });
  if (userChatId) {
    return (
      bot.sendMessage(
        chatId,
        `Добро пожаловать в телеграм бот VAG клуба Чебоксар!`,
        menu
      )
    )
  } else {
    return bot.sendMessage(
      chatId,
      `Добро пожаловать в телеграм бот VAG клуба Чебоксар!\nПожалуйста зарегистрируйтесь`,
      reg
    )
  }
})

bot.onText(/Посмотреть мой профиль/, async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  profile = await Users.findOne({ where: { chatId: chatId } });
  return (
    bot.sendMessage(chatId, `Вы: ${profile.userName} ${profile.userSurName}\nВаше авто: ${profile.carModel}\nГод выпуска: ${profile.carYear}\nНомер авто: ${profile.carGRZ}\nМодель двигателя: ${profile.carEngineModel}`),
    bot.sendPhoto(
      chatId,
      `${profile.carImage}`
    )
  )
})

bot.onText(/Вернуться к меню/, async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  return (
    bot.removeAllListeners(),
    bot.sendMessage(
      chatId,
      `Что вас интересует?`,
      menu
    ),
    start()
  )
})

/* bot.onText(/\/chat$/, (msg) => {
  const chatId = msg.chat.id;
  let fullName = '';

  let resp = `May I take down your name, ${msg.chat.username}`;
  bot.sendMessage(chatId, resp).then(() => {
    return bot.sendMessage(chatId, msg => fullName = msg.text);
  }).then(() => {
    let resp = `It's a pleasure to meet you ${fullName}`;
    bot.sendMessage(chatId, resp)
  });
}); */

/* bot.sendMessage(chat_id, "1").then(() => {
  return (
    bot.sendMessage(chat_id, "2"))
}).then(() => {
  return (
    bot.sendMessage(chat_id, "3"))
}); */

/* bot.sendMessage(chat_id, "1").then(() => {
  return (
    bot.sendMessage(chat_id, "2"))
}).then(() => {
  return (
    bot.sendMessage(chat_id, "3"))
}); */

bot.onText(/Мероприятия/, async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  await bot.sendPhoto(
    chatId,
    'src/img/event1.jpeg'
  )
  return (
    bot.sendMessage(
      chatId,
      `Ближайшая запланированная встреча состоится 2 октября\nМесто проведения встречи: Театр оперы и балета\nВремя встречи: 20:00`
    )
  )
})

start();

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))