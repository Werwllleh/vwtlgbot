const TelegramApi = require("node-telegram-bot-api");

const sequelize = require('./db');

const { menu, reg, partners, ourcars, back, profile, editprofile } = require('./keyboards');
const Users = require("./models");

const token = "5632609691:AAHJ6CvPeasSSrUHoGZePHEeLudoZv3sIR4";

const bot = new TelegramApi(token, { polling: true });

process.env["NTBA_FIX_350"] = 1;

const express = require('express')

const PORT = 5000;

const app = express()

app.use(express.json())
app.use(express.static('static'))
// app.use(fileUpload({}))
// app.use('/api', router)

async function startApp() {
  try {
    app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
  } catch (e) {
    console.log(e)
  }
}


const continueSos = async (chatId) => {
  return bot.on('message', async (msg) => {
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
        bot.removeListener("message")
      )
    } else if (msg.text === '/Вернуться к меню') {
      return (
        bot.removeListener("message")
      )
    } else {
      return (
        bot.sendMessage(chatId, `Ваше сообщение слишком короткое, попробуйте описать проблему подробнее`),
        bot.removeListener("message")
      )
    }
  })
}

const showProfile = async (chatId) => {
  try {
    let profile = await Users.findOne({ where: { chatId: chatId } });
    if (profile.carImage) {
      await bot.sendPhoto(chatId, `${profile.carImage}`)
    }
    return (
      bot.sendMessage(chatId, `Вы: ${profile.userName} ${profile.userSurName}\nВаше авто: ${profile.carModel}\nГод выпуска: ${profile.carYear}\nНомер авто: ${profile.carGRZ}\nПримечание: ${profile.carEngineModel}`)
    )
  } catch (error) {
    console.log(error);
  }
}

const start = async () => {
  startApp()
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    console.log('Connection has been established successfully.');
  } catch (e) {
    console.log('Подключение к бд сломалось', e);
  }

  bot.setMyCommands([
    { command: '/help', description: 'Как пользоваться ботом?' },
    { command: '/info', description: 'О клубе' },
  ])

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    try {
      if (text === "/start") {
        let userChatId = await Users.findOne({ where: { chatId: chatId } });
        if (userChatId) {
          return (
            bot.sendMessage(
              chatId,
              `Привет, что тебя интересует? `,
              menu
            )
          )
        } else {
          return bot.sendMessage(
            chatId,
            `Добро пожаловать в телеграм бот VAG клуба Чебоксар!\nПожалуйста пройди регистрацию`,
            reg
          )
        }
      }
      if (text === "Мероприятия") {
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
      if (text === "Запросить помощь") {
        return (
          bot.sendMessage(
            chatId,
            "Надеюсь вы не шутите, ведь ваша просьба прилетит всем зарегистрированным участникам сообщества",
            {
              reply_markup: {
                keyboard: [
                  [{ text: '/Вернуться к меню', callback_data: "/leaveSos" }],
                  [{ text: 'Все серьезно, у меня беда.\nХочу продолжить', callback_data: "/continueSos" }],
                ],
              }
            }
          )
        )
      }
      if (text === "Все серьезно, у меня беда.\nХочу продолжить") {
        await bot.sendMessage(
          chatId,
          "Коротко опишите вашу проблему и сообщите адрес, где вы находитесь.\nВажно!!!\nНе забудьте написать номер вашего телефона или оставьте ссылку на ваш телеграмм-профиль, иначе с вами не смогут связаться",
          {
            reply_markup: {
              keyboard: [
                [{ text: '/Вернуться к меню', callback_data: "/leaveSos" }],
              ],
            }
          }
        )
        return (
          bot.once('message', continueSos(chatId))
        )
      }
      if (text === "Продажа авто") {
        return (
          bot.sendMessage(chatId, `Этот отдел еще в разработке`, back)
        )
      }
      if (text === "Наши авто") {
        return (
          bot.sendMessage(chatId, `Перейдите для просмотра автомобилей участников ↓`, ourcars)
        )
      }
      if (text === "Профиль") {
        return bot.sendMessage(chatId, 'Выбери:', profile);
      }
      if (text === "Посмотреть мой профиль") {
        showProfile(chatId)
      }
      if (text === "Изменить авто") {
        await bot.sendMessage(chatId, 'Используй команду /editcar\nНапример: /editcar volkswagen golf');
      }
      if (text === "Отредактировать профиль") {
        return bot.sendMessage(chatId, 'Что хочешь изменить?', editprofile);
      }
      if (text === "/help") {
        return (
          bot.sendMessage(
            chatId,
            `Команды, которые могут тебе пригодиться:\n\n/nomer НОМЕРАВТО - поиск авто одноклубника по номеру(использовать формат A000AA00 или A000AA000 и только латинские буквы)\nПример:/nomer K868OP21\n\n/editcar МАРКА МОДЕЛЬ - изменить марку и модель автомобиля\nПример:/editcar volkswagen tiguan\n\n/editnomer НОМЕРАВТО - сменить номер автомобиля (использовать формат A000AA00 или A000AA000 и только латинские буквы)\nПример:/editnomer K868OP21\n\n/edityear ГГГГ - команда для смены года выпуска автомобиля\nПример:/edityear 2017\n\n/editeng XXXX - смена модели двигателя\nПример:/editeng CZDA\n`,
          )
        )
      }
      if (text === "/info") {
        return (
          bot.sendMessage(
            chatId,
            `Привет привееет!\nНа связи VW/SK CLUB 21 - крупнейшее автосообщество ваговодов Чувашии☝🏻\n\nМы - одна большая семья, которая держится друг за друга, делится своими радостями и неудачами, а все остальные переживают это, помогают в решении вопроса и поддерживают!\nВсе любят покрасоваться своими ласточками и мы не исключение💥\nВвиду этого у нас стабильно проходят автовстречи, где собирается вся наша дружная семья и обсуждает все события в большом кругу.\nА затем флаги в руки и в конвой.\nМы проезжаем по центральным улицам Чебоксар, чтобы показать нашу активность и дружность.\nНе забудем сказать и про партнеров, которых у нас немало. И этот список постоянно пополняется. От доставки еды до ремонта турбины - огромное количество сфер готовы предоставить клубную скидку для таких умничек и молодцов😂😂\n\nУ тебя нет ВАГа, но ты настоящий фанат немецкого автопрома? Не переживай и приходи на встречу🥰 Мы любим и уважаем каждого участника.\nДумаем, что стало немного понятнее.\nПоэтому чего ждать - добро пожаловать к нам в клуб!!!🎉🎊🎉🎊🎉`
          )
        )
      }
    } catch (e) {
      return bot.sendMessage(chatId, 'Произошла какая то ошибка!');
    }
  });

};



bot.onText(/Меню/, async (msg) => {
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

bot.onText(/\/nomer (.+)/, async (msg, [source, match]) => {
  const chatId = msg.chat.id;
  let regExp = /^[abekmhopctyxABEKMHOPCTYX]\d{3}(?<!000)[abekmhopctyxABEKMHOPCTYX]{2}\d{2,3}$/;

  if (regExp.test(match)) {
    let queryGrz = match.toUpperCase().trimEnd();
    let carNum = await Users.findOne({ where: { carGRZ: queryGrz } });

    if (carNum) {
      if (carNum.carImage) {
        await bot.sendPhoto(chatId, `${carNum.carImage}`)
      }
      return (
        bot.sendMessage(chatId, `Владелец: ${carNum.userName} ${carNum.userSurName}\nАвтомобиль: ${carNum.carModel}\nГод выпуска: ${carNum.carYear}\nМодель двигателя: ${carNum.carEngineModel}`)
      )
    } else {
      return (
        bot.sendMessage(chatId, `Я не нашел пользователя с таким номером авто(`)
      )
    }
  } else {
    return (
      bot.sendMessage(chatId, `Неправильный формат номера`)
    )
  }

})

bot.onText(/\/editcar (.+)/, async (msg, [source, match]) => {
  const chatId = msg.chat.id;
  let regExp = /^[a-zA-Z\s]+\s[a-zA-Z0-9\s]+$/;

  if (regExp.test(match)) {
    let carName = match.toLowerCase().trimEnd();
    await Users.update({ carModel: carName }, {
      where: {
        chatId: msg.chat.id
      }
    })
    return (
      bot.sendMessage(chatId, `Вы обновили марку и модель авто`)
    )
  } else {
    return (
      bot.sendMessage(chatId, `Некорректный ввод, попробуйте еще раз`)
    )
  }
})

bot.onText(/\/editnomer (.+)/, async (msg, [source, match]) => {
  const chatId = msg.chat.id;
  let regExp = /^[abekmhopctyxABEKMHOPCTYX]\d{3}(?<!000)[abekmhopctyxABEKMHOPCTYX]{2}\d{2,3}$/;

  if (regExp.test(match)) {
    let queryGrz = match.toUpperCase().trimEnd();
    await Users.update({ carGRZ: queryGrz }, {
      where: {
        chatId: chatId
      }
    })
    return (
      bot.sendMessage(chatId, `Вы обновили гос. номер вашего автомобиля`)
    )
  } else {
    return (
      bot.sendMessage(chatId, `Некорректный ввод, попробуйте еще раз`)
    )
  }
})

bot.onText(/\/edityear (.+)/, async (msg, [source, match]) => {
  const chatId = msg.chat.id;
  let date = new Date();
  let year = date.getFullYear();

  let regExp = /^\d+$/;

  if (regExp.test(match) && match >= 1900 && match <= year) {
    let carYear = match.trimEnd()
    await Users.update({ carYear: carYear }, {
      where: {
        chatId: chatId
      }
    })
    return (
      bot.sendMessage(chatId, `Вы обновили год выпуска вашего авто`)
    )
  } else {
    return (
      bot.sendMessage(chatId, `Некорректный ввод, попробуйте еще раз`)
    )
  }

})

bot.onText(/\/editeng (.+)/, async (msg, [source, match]) => {
  const chatId = msg.chat.id;

  let regExp = /^[a-zA-Z]+$/;

  if (regExp.test(match)) {
    let engModel = match.toUpperCase().trimEnd();
    await Users.update({ carEngineModel: engModel }, {
      where: {
        chatId: chatId
      }
    })
    return (
      bot.sendMessage(chatId, `Вы обновили модель вашего двигателя`)
    )
  } else {
    return (
      bot.sendMessage(chatId, `Некорректный ввод, попробуйте еще раз`)
    )
  }

})

bot.on("web_app_data", async (msg) => {
  // bot.sendMessage(msg.chat.id, msg.web_app_data.data);
  let strMsg = msg.web_app_data.data;
  let arrData = strMsg.split(',');

  let name = arrData[0].trim();
  let surname = arrData[1].trim();
  let car = arrData[2].trimEnd();
  let carYear = arrData[3].trim();
  let carGRZ = arrData[4].trimEnd();

  if (name == '' || surname == '' || surname == '' || car == '' || carYear == '' || carGRZ == '') {
    return bot.sendMessage(
      msg.chat.id,
      `Пожалуйста введите верные данные, попробуйте еще раз`,
      reg
    )
  } else {
    await Users.create({
      chatId: msg.chat.id,
      userName: name[0].toUpperCase() + name.substring(1),
      userSurName: surname[0].toUpperCase() + surname.substring(1),
      carModel: car.toLowerCase(),
      carYear: carYear,
      carGRZ: arrData[4].toUpperCase(),
      carEngineModel: arrData[5].toUpperCase()
    })
    return (
      bot.sendMessage(
        msg.chat.id,
        `Добро пожаловать ${name[0].toUpperCase() + name.substring(1)}!\nЧто тебя интересует?`,
        menu
      )
    )
  }
});


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

start();

