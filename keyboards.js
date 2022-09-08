// Настройки для отправки сообщения


module.exports = {
	menu: {
		reply_markup: JSON.stringify({
			// Добавляем все кнопки
			keyboard: [
				[{ text: 'Информация о клубе', callback_data: "/info" }, { text: 'Партнеры', callback_data: "/partners" }],
				[{ text: 'Наши авто', callback_data: "/ourcars" }, { text: 'Мероприятия', callback_data: "/events" }],
				[{ text: 'Поиск авто по ГРЗ', callback_data: "/searchcar" }, { text: 'Запросить помошь', callback_data: "/sos" }],
				[{ text: 'Поддержать клуб', callback_data: "/donate" }, { text: 'Продажа авто', callback_data: "/salecars" }]
			],
		})
	},
	back: {
		reply_markup: JSON.stringify({
			// Добавляем кнопку регистрации
			keyboard: [
				[{ text: 'Вернуться к меню', callback_data: "/back" }],
			],
		})
	},
}