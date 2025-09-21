const Usuario = require("./usuarioSeq");
const Evento = require("./eventoSeq");
const Ingresso = require("./ingressoSeq");

// Relacionamentos

// Um usuário pode ter muitos ingressos
Usuario.hasMany(Ingresso, { foreignKey: "usuarioId" });

// Um evento pode ter muitos ingressos
Evento.hasMany(Ingresso, { foreignKey: "eventoId" });

// Um ingresso pertence a um usuário e a um evento
Ingresso.belongsTo(Usuario, { foreignKey: "usuarioId" });
Ingresso.belongsTo(Evento, { foreignKey: "eventoId" });

module.exports = { Usuario, Evento, Ingresso };