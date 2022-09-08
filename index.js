const TelegramApi = require("node-telegram-bot-api");

const sequelize = require('./db');
const UsersModel = require('./models');
const { menu, back } = require('./keyboards');

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
              reply_markup: {
                keyboard: [
                  [
                    {
                      text: "Регистрация",
                      web_app: {
                        url: "https://fruity-bags-grow-85-234-6-154.loca.lt/form.html",
                      },
                    },
                  ],
                ],
              },
            }
          )
        }
      }
      if (text === "/info") {
        return bot.sendMessage(
          chatId,
          `Мы VAG клуб Чебоксар!\n\nЧто тебя интересует?`,
          {
            reply_markup: JSON.stringify({
              // Добавляем кнопку регистрации
              keyboard: [
                [{ text: 'Показать меню', callback_data: "/back" }],
              ],
            })
          }
        )
      }
      if (text === "Показать меню") {
        return (
          bot.sendMessage(
            chatId,
            `а`,
            {
              reply_markup: JSON.stringify({
                // Добавляем все кнопки
                keyboard: [
                  [{ text: 'Информация о клубе', callback_data: "/info" }, { text: 'Партнеры', callback_data: "/partners" }],
                  [{ text: 'Наши авто', callback_data: "/ourcars" }, { text: 'Мероприятия', callback_data: "/events" }],
                  [{ text: 'Поиск авто по ГРЗ', callback_data: "/searchcar" }, { text: 'Запросить помошь', callback_data: "/sos" }],
                  [{ text: 'Поддержать клуб', callback_data: "/donate" }, { text: 'Продажа авто', callback_data: "/salecars" }]
                ],
              })
            }
          )
        )
      }

    } catch (e) {
      return bot.sendMessage(chatId, "Произошла какая-то ошибка");
    }
  });


  user = {}

  bot.on("web_app_data", async (msg) => {
    bot.sendMessage(msg.chat.id, msg.web_app_data.data);
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/back') {

    }

  });
};

start();