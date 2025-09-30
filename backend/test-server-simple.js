const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste
app.get("/api/test", (req, res) => {
    res.json({ message: "Servidor funcionando!" });
});

// Rota POST para tipos-ingressos
app.post("/api/tipos-ingressos", (req, res) => {
    console.log("Recebido POST em tipos-ingressos:", req.body);
    res.json({ 
        message: "Endpoint tipos-ingressos funcionando!",
        received: req.body 
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor de teste rodando na porta ${PORT}`);
    
    // Manter o processo vivo
    process.on('SIGTERM', () => {
        console.log('Recebido SIGTERM');
    });
    
    process.on('SIGINT', () => {
        console.log('Recebido SIGINT');
    });
});