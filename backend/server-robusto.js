const express = require("express");
const cors = require("cors");
const path = require("path");

// Configuração de log
function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

log("🚀 Iniciando servidor backend...");

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middlewares
app.use(cors({ 
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Log de requisições
app.use((req, res, next) => {
    log(`📥 ${req.method} ${req.url}`);
    next();
});

// Dados mockados para teste
const eventosMock = [
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
                eventoId: 1,
                tipo: "Pista",
                preco: 50,
                quantidade: 100,
                quantidadeVendida: 2
            }
        ],
        organizador: {
            id: 1,
            nome: "Test Organizer",
            email: "organizer@test.com"
        }
    }
];

let proximoIdTipoIngresso = 2;

// ROTAS
app.get('/api/test', (req, res) => {
    log('✅ Endpoint de teste acessado');
    res.json({ 
        message: 'Backend funcionando!', 
        timestamp: new Date().toISOString(),
        status: 'OK'
    });
});

app.get('/api/eventos', (req, res) => {
    log('✅ GET /api/eventos');
    res.json(eventosMock);
});

app.post('/api/tipos-ingressos', (req, res) => {
    log('✅ POST /api/tipos-ingressos');
    const { eventoId, tipo, preco, quantidade } = req.body;
    
    log(`Dados recebidos: eventoId=${eventoId}, tipo=${tipo}, preco=${preco}, quantidade=${quantidade}`);
    
    if (!eventoId || !tipo || preco === undefined || !quantidade) {
        log('❌ Campos obrigatórios faltando');
        return res.status(400).json({ 
            error: 'Campos obrigatórios faltando',
            details: 'eventoId, tipo, preco e quantidade são obrigatórios'
        });
    }

    const novoTipoIngresso = {
        id: proximoIdTipoIngresso++,
        eventoId: parseInt(eventoId),
        tipo,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade),
        quantidadeVendida: 0
    };

    // Adicionar ao evento mock
    const evento = eventosMock.find(e => e.id === parseInt(eventoId));
    if (evento) {
        evento.tiposIngressos.push(novoTipoIngresso);
    }

    log(`✅ Tipo de ingresso criado: ${JSON.stringify(novoTipoIngresso)}`);
    res.status(201).json(novoTipoIngresso);
});

app.get('/api/eventos/:eventoId/tipos-ingressos', (req, res) => {
    const eventoId = parseInt(req.params.eventoId);
    log(`✅ GET /api/eventos/${eventoId}/tipos-ingressos`);
    
    const evento = eventosMock.find(e => e.id === eventoId);
    if (evento) {
        res.json(evento.tiposIngressos);
    } else {
        res.status(404).json({ error: 'Evento não encontrado' });
    }
});

// Tratamento de erro
app.use((err, req, res, next) => {
    log(`❌ Erro: ${err.message}`);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// 404
app.use((req, res) => {
    log(`❌ 404: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Iniciar servidor
log(`🌐 Tentando iniciar servidor na porta ${PORT}...`);

const server = app.listen(PORT, () => {
    log(`✅ Servidor rodando na porta ${PORT}`);
    log(`🔗 Teste: http://localhost:${PORT}/api/test`);
    
    // Manter servidor vivo
    setInterval(() => {
        // Ping interno para manter vivo
        // log('💓 Servidor ativo...');
    }, 30000);
});

server.on('error', (err) => {
    log(`❌ Erro no servidor: ${err.message}`);
});

// Tratar sinais do sistema
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
    process.on(signal, () => {
        log(`🛑 Recebido sinal ${signal}, mantendo servidor ativo...`);
        // Não fechar o servidor
    });
});

process.on('uncaughtException', (err) => {
    log(`❌ Exceção não capturada: ${err.message}`);
    // Não sair do processo
});

process.on('unhandledRejection', (reason, promise) => {
    log(`❌ Promise rejeitada: ${reason}`);
    // Não sair do processo
});

log("✅ Configuração do servidor concluída!");
log("🚀 Servidor aguardando requisições...");