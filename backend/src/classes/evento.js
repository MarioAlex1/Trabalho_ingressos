class Evento {
    constructor(nome, data, local, capacidade, preco) {
        if (!nome || !data || !local || !capacidade || !preco) {
            throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
        }
        this.nome = nome;
        this.data = data;
        this.local = local;
        this.capacidade = capacidade;
        this.preco = preco;
        this.cancelado = false;
    }

    atualizarEvento({ nome, data, local, capacidade, preco }) {
        if (nome) this.nome = nome;
        if (data) this.data = data;
        if (local) this.local = local;
        if (capacidade) this.capacidade = capacidade;
        if (preco) this.preco = preco;
    }

    cancelarEvento() {
        this.cancelado = true;
    }
}

module.exports = Evento;