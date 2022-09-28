const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const Users = sequelize.define('user', {
	id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
	chatId: { type: DataTypes.INTEGER, unique: true },
	userName: { type: DataTypes.STRING, allowNull: false },
	userSurName: { type: DataTypes.STRING, allowNull: false },
	carModel: { type: DataTypes.STRING, allowNull: false },
	carYear: { type: DataTypes.INTEGER, allowNull: false },
	carGRZ: { type: DataTypes.STRING, unique: true, allowNull: false },
	carEngineModel: { type: DataTypes.STRING, allowNull: false },
}, {
	timestamps: false
})

module.exports = Users;