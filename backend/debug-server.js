const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rota de teste simples
app.get('/api/test', (req, res) => {
    console.log('Recebida requisição GET em /api/test');
    res.json({ 
        message: 'Servidor funcionando!', 
        timestamp: new Date().toISOString() 
    });
});

// Rota POST de teste
app.post('/api/tipos-ingressos', (req, res) => {
    console.log('Recebida requisição POST em /api/tipos-ingressos');
    console.log('Body:', req.body);
    res.json({ 
        message: 'Endpoint tipos-ingressos funcionando!',
        received: req.body
    });
});

// Middleware de erro
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`✅ Servidor de teste rodando na porta ${port}`);
    console.log(`🌐 Teste: http://localhost:${port}/api/test`);
}).on('error', (err) => {
    console.error('❌ Erro ao iniciar servidor:', err);
});