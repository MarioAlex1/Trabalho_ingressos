// src/classes/teste.js
const Cliente = require('./cliente');
const Organizador = require('./organizador');
const Evento = require('./evento');
const Ingresso = require('./ingresso');

try {
    const cliente1 = new Cliente(
        "Maru",
        "maru@email.com",
        "123456",
        "123.456.789-00",
        "999999999",
        "Rua das Flores, 123"
    );
    console.log("Cliente criado:", cliente1);

    const org1 = new Organizador(
        "Organizador",
        "org@email.com",
        "senha123",
        "987.654.321-00",
        "888888888",
        "Empresa XYZ"
    );
    console.log("Organizador criado:", org1);

    const evento1 = new Evento(
        "Show do Maru",
        new Date("2025-10-30"),
        "Arena Central",
        1000,
        50
    );
    console.log("Evento criado:", evento1);

    const ingresso1 = new Ingresso(evento1, cliente1, evento1.preco, "ABC123");
    console.log("Ingresso criado:", ingresso1);

    console.log(ingresso1.exibirIngresso());
    console.log(ingresso1.validarIngresso());

    try {
        console.log(ingresso1.validarIngresso());
    } catch (err) {
        console.error("Erro ao validar ingresso de novo:", err.message);
    }

} catch (err) {
    console.error("Erro no teste:", err.message);
}