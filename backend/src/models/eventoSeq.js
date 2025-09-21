// src/models/eventoSeq.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Evento = sequelize.define("Evento", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false
  },
  local: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  preco: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  cancelado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: "eventos",
  timestamps: true
});

module.exports = Evento;