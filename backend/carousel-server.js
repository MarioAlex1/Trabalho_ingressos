const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3001;

// Middleware básico
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"] }));
app.use(express.json({ limit: '50mb' }));

// Servir arquivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Log de requisições
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// Rota de teste
app.get('/api/test', (req, res) => {
    console.log('✅ Endpoint de teste acessado');
    res.json({ message: 'Servidor funcionando!', timestamp: new Date().toISOString() });
});

// Rota para eventos (usando dados do arquivo JSON)
app.get('/api/eventos', (req, res) => {
    try {
        const dadosPath = path.join(__dirname, 'dados-servidor.json');
        const dados = JSON.parse(fs.readFileSync(dadosPath, 'utf8'));
        console.log('✅ Eventos carregados:', dados.eventos?.length || 0);
        res.json(dados.eventos || []);
    } catch (error) {
        console.error('❌ Erro ao carregar eventos:', error);
        res.status(500).json({ error: 'Erro ao carregar eventos' });
    }
});

// Iniciar servidor
app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🔗 Teste: http://localhost:${PORT}/api/test`);
    console.log(`🖼️ Assets: http://localhost:${PORT}/assets/`);
});

// Tratamento de erro
app.on('error', (err) => {
    console.error('❌ Erro do servidor:', err);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Erro não capturado:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Promise rejeitada:', err);
});