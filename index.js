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

    try {

      bot.onText(/\start/, msg => {
        const helloText = `Здравствуй, ${msg.from.first_name}\nВыберите команду для начала работы:`;
        bot.sendMessage(chatId, helloText)
      })


      if (text === "/start") {
        const userChatId = await UsersModel.findOne({ where: { chatId: chatId } });

        if (userChatId) {
          return (
            bot.sendMessage(
              chatId,
              `Добро пожаловать в телеграм бот VAG клуба Чебоксар!`,
              allBtns
            )
          )
        } else {
          // return UsersModel.create({ chatId });

          user = {};
          await bot.sendMessage(
            chatId,
            'Как Вас зовут?',
          );
          bot.onText(/[A-Za-zА-Яа-яЁё]+(\s+[A-Za-zА-Яа-яЁё]+)?/, async (text) => {
            user.userName = text.text;
            await bot.sendMessage(
              chatId,
              `Здравствуй ${user.userName}!`);
          })
          await bot.sendMessage(
            chatId,
            'Назови свою фамилию',
          );
          bot.onText(/[A-Za-zА-Яа-яЁё]+(\s+[A-Za-zА-Яа-яЁё]+)?/, async (text) => {
            user.userSurName = text.text;
            await bot.sendMessage(
              chatId,
              `Записал!\n\nНа чем ездишь?)`);
          })

          // await bot.sendMessage(
          //   chatId,
          //   'Ваша фамилия?'
          // );
          // await bot.onText(/[A-Za-zА-Яа-яЁё]+(\s+[A-Za-zА-Яа-яЁё]+)?/, async (text) => {
          //   user.userSurName = text.text;
          //   return bot.sendMessage(chatId, "Ваша фамилия добавлена");
          // });
          // await bot.sendMessage(
          //   chatId,
          //   'На каком авто Вы ездите? пример:Skoda Octavia, Volkswagen Passat'
          // );
          // await bot.onText(/[A-Za-zА-Яа-яЁё]+(\s+[A-Za-zА-Яа-яЁё]+)?/, async (text) => {
          //   user.carModel = text.text;
          //   return bot.sendMessage(chatId, "Ваше авто добавлено");
          // });
          // await bot.sendMessage(
          //   chatId,
          //   'Год выпуска авто?'
          // );
          // await bot.onText(/[A-Za-zА-Яа-яЁё]+(\s+[A-Za-zА-Яа-яЁё]+)?/, async (text) => {
          //   user.carYear = text.text;
          //   return bot.sendMessage(chatId, "Год добавлен");
          // });
          // await bot.sendMessage(
          //   chatId,
          //   'Номер вашего авто?'
          // );
          // await bot.onText(/[A-Za-zА-Яа-яЁё]+(\s+[A-Za-zА-Яа-яЁё]+)?/, async (text) => {
          //   user.carGRZ = text.text;
          //   return bot.sendMessage(chatId, "ГРЗ добавлен");
          // });
          // await bot.sendMessage(
          //   chatId,
          //   'Модель вашего двигателя?'
          // );
          // await bot.onText(/[A-Za-zА-Яа-яЁё]+(\s+[A-Za-zА-Яа-яЁё]+)?/, async (text) => {
          //   user.carEngineModel = text.text;
          //   return bot.sendMessage(chatId, "Модель двигателя добавлена");
          // });
        }
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
    if (data === '/reg') {
    }
  });
};

start();
