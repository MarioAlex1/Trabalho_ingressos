const express = require("express");
const cors = require("cors");

console.log('Iniciando servidor Express...');

const app = express();

console.log('Express criado');

app.use(cors());
app.use(express.json());

console.log('Middlewares configurados');

app.get('/api/test', (req, res) => {
    console.log('Endpoint /api/test acessado');
    res.json({ message: 'Express funcionando!', timestamp: new Date() });
});

console.log('Rotas configuradas');

app.listen(3000, () => {
    console.log("✅ Servidor Express rodando na porta 3000");
}).on('error', (err) => {
    console.error('❌ Erro ao iniciar servidor:', err);
});