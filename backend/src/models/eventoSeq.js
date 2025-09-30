// src/models/eventoSeq.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Evento = sequelize.define("Evento", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endereco: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dataEvento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  capacidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  imagem: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  organizadorId: {
    type: DataTypes.INTEGER,
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