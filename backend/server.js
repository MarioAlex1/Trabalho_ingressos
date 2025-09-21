const express = require("express");
const cors = require("cors"); // pra comunicar com o frontend
const app = express();
const sequelize = require("./src/config");
const usuarioRoutes = require("./src/routes");
const { Usuario, Evento, Ingresso } = require("./src/models/associations");

app.use(cors()); // permite comunicação com o frontend

app.use(express.json());
app.use("/api", usuarioRoutes);

sequelize.sync()
    .then(() => console.log("Banco sincronizado"))
    .catch(err => console.error("Erro ao sincronizar banco:", err));

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

//pra o front comunicar com o back vai precisar de axios
//assim como o back precisa do cors pra permitir a comunicação com o front