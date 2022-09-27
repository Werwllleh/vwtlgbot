const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
	"postgres",
	"postgres",
	"2k85anMk2V72",
	{
		host: "193.164.149.140",
		port: "5432",
		dialect: "postgres",
	}
);
