const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
	"postgres",
	"postgres",
	"2k85anMk2V72",
	{
		host: "localhost",
		port: "5432",
		dialect: "postgres",
	}
);
