//herda de Usuario, adiciona endereco e pode fazer reservas.
const Usuario = require("./usuario");

class Cliente extends Usuario {
    constructor(nome, email, senha, cpf, telefone, endereco) {
        super(nome, email, senha, cpf, telefone);

        if (!endereco) {
            throw new Error("Endereço é obrigatório para Cliente");
        }

        this.endereco = endereco;
    }

    getTipoUsuario() {
        return "Cliente";
    }
}

module.exports = Cliente;