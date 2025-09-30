const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

console.log('🚀 Iniciando servidor de teste...');

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'] }));
app.use(express.json({ limit: '50mb' }));

// Middleware de log
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// Rota de teste simples
app.get('/api/test', (req, res) => {
    console.log('✅ Endpoint /api/test acessado');
    res.json({ 
        message: 'Servidor funcionando!', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Rota POST para tipos-ingressos
app.post('/api/tipos-ingressos', (req, res) => {
    console.log('✅ POST /api/tipos-ingressos');
    console.log('Body recebido:', req.body);
    res.json({ 
        message: 'Tipos-ingressos endpoint funcionando!',
        received: req.body,
        timestamp: new Date().toISOString()
    });
});

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor de teste rodando na porta ${PORT}`);
    console.log(`📡 Acesse: http://localhost:${PORT}/test`);
});

// Tratamento de erros
process.on('uncaughtException', (err) => {
    console.error('❌ Erro não capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promessa rejeitada:', reason);
});