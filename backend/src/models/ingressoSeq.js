// src/models/ingressoSeq.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Ingresso = sequelize.define("Ingresso", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  preco: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  usado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  eventoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'eventos',
      key: 'id'
    }
  },
  tipoIngressoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tipos_ingressos',
      key: 'id'
    }
  }
}, {
  tableName: "ingressos",
  timestamps: true
});

module.exports = Ingresso;