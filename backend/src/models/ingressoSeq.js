// src/models/ingressoSeq.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");
const Usuario = require("./usuarioSeq");
const Evento = require("./eventoSeq");

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
  }
}, {
  tableName: "ingressos",
  timestamps: true
});

// relacionamento: um ingresso pertence a um usuario e a um evento
Ingresso.belongsTo(Usuario, { foreignKey: "usuarioId" });
Ingresso.belongsTo(Evento, { foreignKey: "eventoId" });

module.exports = Ingresso;