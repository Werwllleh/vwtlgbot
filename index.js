const TelegramApi = require("node-telegram-bot-api");

const sequelize = require('./db');
const UsersModel = require('./models');
const { allBtns, regBtn } = require('./keyboards');

const token = "5632609691:AAHJ6CvPeasSSrUHoGZePHEeLudoZv3sIR4";

const bot = new TelegramApi(token, { polling: true });

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
            {
              reply_markup: JSON.stringify({
                inline_keyboard: [
                  [{
                    text: 'Зарегистрироваться',
                    web_app: { url: 'https://cyan-monkeys-dream-85-234-6-154.loca.lt/form.html' }
                  }],
                ],
              })
            }
          )
        }
      }

    } catch (e) {
      return bot.sendMessage(chatId, "Произошла какая-то ошибка");
    }
  });


  user = {}

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/reg') {

    }

  });
};

start();