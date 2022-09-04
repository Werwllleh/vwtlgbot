// Настройки для отправки сообщения

module.exports = {
	allBtns: {
		reply_markup: JSON.stringify({
			// Добавляем наши кнопки
			inline_keyboard: [
				[{ text: 'О клубе', callback_data: "/info" }, { text: 'Партнеры', callback_data: "/partners" }],
				[{ text: 'Наши авто', callback_data: "/ourcars" }, { text: 'Мероприятия', callback_data: "/events" }],
				[{ text: 'Поиск авто по ГРЗ', callback_data: "/searchcar" }, { text: 'Запросить помошь', callback_data: "/sos" }],
				[{ text: 'Поддержать клуб', callback_data: "/donate" }, { text: 'Продажа авто', callback_data: "/salecars" }]
			],
		})
	}
}