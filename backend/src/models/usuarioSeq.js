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
            isEmail: true,
            notEmpty: true
        }
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [6, 100] // senha deve ter pelo menos 6 caracteres
        }
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tipoUsuario: {
        type: DataTypes.STRING, // pode ser "cliente", "organizador" etc
        allowNull: false,
        defaultValue: 'cliente'
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: true // só obrigatório para clientes
    },
    empresa: {
        type: DataTypes.STRING,
        allowNull: true // só obrigatorio para organizadores
    }
}, {
    tableName: "usuarios", // nome da tabela no banco
    timestamps: true // cria colunas createdAt e updatedAt
});

module.exports = Usuario;