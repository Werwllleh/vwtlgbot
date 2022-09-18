const TelegramApi = require("node-telegram-bot-api");

const sequelize = require('./db');
const UsersModel = require('./models');
const { menu, reg, partners_cat, searchcarAgain, back } = require('./keyboards');

const token = "5632609691:AAHJ6CvPeasSSrUHoGZePHEeLudoZv3sIR4";

const bot = new TelegramApi(token, { polling: true });


const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Напиши только цифры или ГРЗ полностью`, searchcarAgain);
  // const randomNumber = Math.floor(Math.random() * 10)
  // chats[chatId] = randomNumber;
  //await bot.sendMessage(chatId, 'Отгадывай');
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

  bot.setMyCommands([
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
            `Добро пожаловать в телеграм бот VAG клуба Чебоксар!\n\nПожалуйста зарегистрируйтесь`,
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
      if (text === "/searchcar" || text === "Поиск авто по ГРЗ" || text === "Искать авто еще раз") {
        return startGame(chatId)
      }
    } catch (e) {
      return bot.sendMessage(chatId, "Произошла какая-то ошибка");
    }
  });

  bot.on("web_app_data", async (msg) => {
    // bot.sendMessage(msg.chat.id, msg.web_app_data.data);
    let strMsg = msg.web_app_data.data;
    let arrData = strMsg.split(',');

    console.log(arrData);
    return (
      UsersModel.create({
        chatId: msg.chat.id,
        userName: arrData[0],
        userSurName: arrData[1],
        carModel: arrData[2],
        carYear: arrData[3],
        carGRZ: arrData[4],
        carEngineModel: arrData[5]
      }),
      bot.sendMessage(
        msg.chat.id,
        `Добро пожаловать в телеграм бот VAG клуба Чебоксар!`,
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