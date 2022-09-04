const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const Users = sequelize.define('user', {
	id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
	chatId: { type: DataTypes.STRING, unique: true },
	userName: { type: DataTypes.STRING, defaultValue: 0 },
	userSurName: { type: DataTypes.STRING, defaultValue: 0 },
})

// const User = sequelize.define('user', {
// 	id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
// 	chatId: { type: DataTypes.STRING, unique: true },
// 	userName: { type: DataTypes.STRING },
// 	userSurName: { type: DataTypes.STRING },
// 	carModel: { type: DataTypes.STRING },
// 	carYear: { type: DataTypes.DATE },
// 	carGRZ: { type: DataTypes.STRING, unique: true },
// 	carEngineModel: { type: DataTypes.STRING },
// })

module.exports = Users;