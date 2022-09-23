// Настройки для отправки сообщения


module.exports = {
	menu: {
		reply_markup: {
			// Добавляем все кнопки
			keyboard: [
				[{ text: 'Информация о клубе', callback_data: "/info" }, { text: 'Партнеры', callback_data: "/partners" }],
				[{ text: 'Наши авто', callback_data: "/ourcars" }, { text: 'Мероприятия', callback_data: "/events" }],
				[{ text: 'Поиск авто по ГРЗ', callback_data: "/searchcar" }, { text: 'Запросить помощь', callback_data: "/sos" }],
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
							url: "https://short-lies-yawn-85-234-6-154.loca.lt/form.html",
						},
					},
				],
			],
		}
	},
	partners_cat: {
		reply_markup: {
			keyboard: [
				[{ text: 'Страхование авто', callback_data: "/car_insurance" }, { text: 'Кузовной ремонт', callback_data: "/car_repair" }],
				[{ text: 'Стайлинг', callback_data: "/car_style" }, { text: 'Автохимия', callback_data: "/car_chemistry" }],
				[{ text: 'Выхлоп', callback_data: "/car_exhaust" }, { text: 'Обслуживание кондиционера', callback_data: "/car_conditioner" }],
				[{ text: 'Покраска', callback_data: "/car_painting" }, { text: 'Шумоизоляция авто', callback_data: "/car_insulation" }],
				[{ text: 'Вернуться к меню', callback_data: "/back" }],
			],
		}
	},
	back: {
		reply_markup: {
			keyboard: [
				[{ text: 'Вернуться к меню', callback_data: "/back" }],
			],
		}
	},
}