// src/models/tipoIngressoSeq.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const TipoIngresso = sequelize.define("TipoIngresso", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  eventoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantidadeVendida: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "tipos_ingressos",
  timestamps: true
});

module.exports = TipoIngresso;