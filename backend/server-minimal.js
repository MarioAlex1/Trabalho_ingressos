const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    console.log('Endpoint de teste acessado');
    res.json({ message: 'Servidor funcionando!', timestamp: new Date() });
});

app.listen(3000, () => {
    console.log("Servidor mínimo rodando na porta 3000");
});