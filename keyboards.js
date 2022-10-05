// Настройки для отправки сообщения


module.exports = {
	menu: {
		reply_markup: {
			// Добавляем все кнопки
			keyboard: [
				[{ text: 'Информация о клубе' }, { text: 'Партнеры' }],
				[{ text: 'Наши авто' }, { text: 'Мероприятия' }],
				[{ text: 'Поиск авто по ГРЗ' }, { text: 'Запросить помощь' }],
				[{ text: 'Поддержать клуб' }, { text: 'Продажа авто' }],
				[{ text: 'Посмотреть мой профиль' }],
				[{ text: 'Отредактировать профиль' }],
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
	profileFields: {
		reply_markup: {
			// Добавляем все кнопки
			keyboard: [
				[{ text: 'Поменять авто', callback_data: "/changeCar" }, { text: 'Сменить номер', callback_data: "/changeGrz" }],
				[{ text: 'Добавить/изменить модель двигателя', callback_data: "/changeEngine" }, { text: 'Изменить год авто', callback_data: "/changeCarYear" }],
				[{ text: 'Добавить/поменять фото авто', callback_data: "/changeCarImg" }, { text: 'Вернуться к меню', callback_data: "/back" }]
			],
		}
	},
	searchAgain: {
		reply_markup: {
			keyboard: [
				[{ text: 'Искать еще раз', callback_data: "/searchGrzAgain" }],
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