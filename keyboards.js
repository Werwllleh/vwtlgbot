// Настройки для отправки сообщения


module.exports = {
	menu: {
		reply_markup: {
			// Добавляем все кнопки
			keyboard: [
				[{ text: 'Информация о клубе', callback_data: "/info" }, { text: 'Партнеры', callback_data: "/partners" }],
				[{ text: 'Наши авто', callback_data: "/ourcars" }, { text: 'Мероприятия', callback_data: "/events" }],
				[{ text: 'Поиск авто по ГРЗ', callback_data: "/searchcar" }, { text: 'Запросить помошь', callback_data: "/sos" }],
				[{ text: 'Поддержать клуб', callback_data: "/donate" }, { text: 'Продажа авто', callback_data: "/salecars" }]
			],
		}
	},
	reg: {
		reply_markup: {
			keyboard: [
				[
					{
						text: "Регистрация",
						web_app: {
							url: "https://loud-cities-stop-85-234-6-154.loca.lt/form.html",
						},
					},
				],
			],
		},
	},
	back: {
		reply_markup: {
			// Добавляем кнопку регистрации
			keyboard: [
				[{ text: 'Вернуться к меню', callback_data: "/back" }],
			],
		}
	},
}