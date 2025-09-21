//herda de Usuario, adiciona empresa e pode criar eventos.
const Usuario = require("./usuario");

class Organizador extends Usuario {
    constructor(nome, email, senha, cpf, telefone, empresa) {
        super(nome, email, senha, cpf, telefone);

        if (!empresa) {
            throw new Error("Empresa é obrigatória para Organizador");
        }

        this.empresa = empresa;
    }

    criarEvento(nomeEvento, data) {
        return `Evento "${nomeEvento}" criado para a data ${data}`;
    }

    getTipoUsuario() {
        return "Organizador";
    }
}

module.exports = Organizador;