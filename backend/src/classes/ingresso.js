class Ingresso {
    constructor(evento, cliente, preco, codigo) {
        if (!evento || !cliente || !preco || !codigo) {
            throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
        }

        // Validação de tipo
        const EventoClass = require("./evento");
        const ClienteClass = require("./cliente");

        if (!(evento instanceof EventoClass)) {
            throw new Error("Evento inválido");
        }

        if (!(cliente instanceof ClienteClass)) {
            throw new Error("Somente clientes podem ter ingressos");
        }

        this.evento = evento;     
        this.cliente = cliente;   
        this.preco = preco;
        this.codigo = codigo;     
        this.usado = false;
    }

    exibirIngresso() {
        return `Ingresso do evento: ${this.evento.nome}, Cliente: ${this.cliente.nome}, Código: ${this.codigo}`;
    }

    validarIngresso() {
        if (this.usado) {
            throw new Error("Ingresso já foi utilizado.");
        }
        this.usado = true;
        return "Ingresso validado com sucesso!";
    }
}

module.exports = Ingresso;