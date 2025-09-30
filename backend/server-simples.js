// Servidor simples sem Sequelize para testar
const express = require("express");
const cors = require("cors");

console.log("🚀 Iniciando servidor simples...");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Log de requisições
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// Rotas simples para teste
app.get('/api/test', (req, res) => {
    console.log('✅ GET /api/test acessado');
    res.json({ 
        message: 'Servidor funcionando!', 
        timestamp: new Date().toISOString(),
        status: 'OK'
    });
});

app.post('/api/tipos-ingressos', (req, res) => {
    console.log('✅ POST /api/tipos-ingressos acessado');
    console.log('Body recebido:', req.body);
    res.json({
        success: true,
        message: 'Tipo de ingresso criado com sucesso!',
        data: req.body,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/eventos', (req, res) => {
    console.log('✅ GET /api/eventos acessado');
    res.json({
        eventos: [
            {
                id: 1,
                titulo: "Evento Teste",
                endereco: "Rua Teste 123",
                dataEvento: "2025-12-01T00:00:00.000Z",
                capacidade: 100,
                descricao: "Evento para teste",
                organizadorId: 1,
                cancelado: false,
                tiposIngressos: [
                    {
                        id: 1,
                        tipo: "Pista",
                        preco: 50,
                        quantidade: 100,
                        quantidadeVendida: 0
                    }
                ]
            }
        ]
    });
});

// Tratamento de erro
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
});

// Rota 404
app.use((req, res) => {
    console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Iniciar servidor
console.log("🌐 Iniciando servidor na porta", PORT);
const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`✅ Servidor rodando em http://127.0.0.1:${PORT}`);
    console.log(`🔗 Teste: http://127.0.0.1:${PORT}/api/test`);
});

server.on('error', (err) => {
    console.error("❌ Erro no servidor:", err);
});

console.log("✅ Servidor configurado e aguardando conexões...");