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