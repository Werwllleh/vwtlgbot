// Настройки для отправки сообщения


module.exports = {
	menu: {
		reply_markup: {
			// Добавляем все кнопки
			keyboard: [
				[{ text: 'Информация о клубе' }, { text: 'Партнеры' }],
				[{ text: 'Наши авто' }, { text: 'Мероприятия' }],
				[{ text: 'Поддержать клуб' }, { text: 'Продажа авто' }],
				[{ text: 'Посмотреть мой профиль' }, { text: 'Запросить помощь' }],
			],
		}
	},
	reg: {
		reply_markup: {
			keyboard: [
				[{
					text: "Регистрация",
					web_app: {
						url: "https://193.164.149.140/form.html"
					}
				}],
			],
		}
	},
	partners: {
		reply_markup: {
			inline_keyboard: [
				[{
					text: "Список партнеров",
					web_app: {
						url: "https://193.164.149.140/partners.html"
					}
				}],
			],
		}
	},
	ourcars: {
		reply_markup: {
			inline_keyboard: [
				[{
					text: "Автомобили участников",
					web_app: {
						url: "https://193.164.149.140/ourcars.html"
					}
				}],
			],
		}
	},
	back: {
		reply_markup: {
			keyboard: [
				[{ text: '/Вернуться к меню', callback_data: "/back" }],
			],
		}
	},
}