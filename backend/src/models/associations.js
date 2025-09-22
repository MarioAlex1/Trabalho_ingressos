const Usuario = require("./usuarioSeq");
const Evento = require("./eventoSeq");
const Ingresso = require("./ingressoSeq");

// Relacionamentos

Usuario.hasMany(Ingresso, { foreignKey: "usuarioId", as: "ingressos" });
Evento.hasMany(Ingresso, { foreignKey: "eventoId", as: "ingressos" });

Ingresso.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });
Ingresso.belongsTo(Evento, { foreignKey: "eventoId", as: "evento" });

// Um organizador pode criar muitos eventos
Usuario.hasMany(Evento, { foreignKey: "organizadorId", as: "eventosCriados" });
Evento.belongsTo(Usuario, { foreignKey: "organizadorId", as: "organizador" });

module.exports = { Usuario, Evento, Ingresso };