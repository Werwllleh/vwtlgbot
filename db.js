const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
	"vwtlg_bot",
	"postgres",
	"root",
	{
		host: "localhost",
		port: "5432",
		dialect: "postgres",
	}
);
