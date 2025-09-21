// models/usuarioSeq.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Usuario = sequelize.define("Usuario", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipoUsuario: {
        type: DataTypes.STRING, // pode ser "cliente", "organizador" etc
        allowNull: false
    }
}, {
    tableName: "usuarios", // nome da tabela no banco
    timestamps: true // cria colunas createdAt e updatedAt
});

module.exports = Usuario;