//Configurações do sistema (banco, chaves, etc)
// config/database.js
const { Sequelize } = require("sequelize");
const path = require("path");

// Cria conexão com o banco SQLite
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "../database.sqlite"), // o arquivo vai ficar na raiz do projeto
    logging: false // tira os logs de SQL no console (opcional)
});

module.exports = sequelize;