//classe abstrata
class Usuario {
    constructor(nome, email, senha, cpf, telefone) {
        if (new.target === Usuario) {
            throw new TypeError("Não é possível criar instâncias de classes abstratas diretamente.");
        }

        if (!nome || !email || !senha || !cpf) {
            throw new Error("Todos os campos são obrigatórios");
        }

        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.cpf = cpf;
        this.telefone = telefone;
    }

    realizarLogin(email, senha) {
        return this.email === email && this.senha === senha;
    }

    getTipoUsuario() {
        throw new Error("O método 'getTipoUsuario' deve ser implementado pelas subclasse.");
    }
}

module.exports = Usuario;