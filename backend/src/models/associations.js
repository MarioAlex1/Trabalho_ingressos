const Usuario = require("./usuarioSeq");
const Evento = require("./eventoSeq");
const Ingresso = require("./ingressoSeq");
const TipoIngresso = require("./tipoIngressoSeq");

// Relacionamentos

Usuario.hasMany(Ingresso, { foreignKey: "usuarioId", as: "ingressos" });
Evento.hasMany(Ingresso, { foreignKey: "eventoId", as: "ingressos" });
TipoIngresso.hasMany(Ingresso, { foreignKey: "tipoIngressoId", as: "ingressos" });

Ingresso.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });
Ingresso.belongsTo(Evento, { foreignKey: "eventoId", as: "evento" });
Ingresso.belongsTo(TipoIngresso, { foreignKey: "tipoIngressoId", as: "tipoIngresso" });

// Um organizador pode criar muitos eventos
Usuario.hasMany(Evento, { foreignKey: "organizadorId", as: "eventosCriados" });
Evento.belongsTo(Usuario, { foreignKey: "organizadorId", as: "organizador" });

// Um evento pode ter muitos tipos de ingressos
Evento.hasMany(TipoIngresso, { foreignKey: "eventoId", as: "tiposIngressos" });
TipoIngresso.belongsTo(Evento, { foreignKey: "eventoId", as: "evento" });

module.exports = { Usuario, Evento, Ingresso, TipoIngresso };