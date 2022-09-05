const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
	"postgres",
	"postgres",
	"qwerty",
	{
		host: "localhost",
		port: "5432",
		dialect: "postgres",
	}
);
