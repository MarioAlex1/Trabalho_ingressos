const express = require("express");
const cors = require("cors");
const app = express();

// Primeiro vamos configurar o servidor básico
console.log("🚀 Iniciando servidor...");

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir arquivos estáticos
app.use('/assets', express.static('public/assets'));

// Middleware de log
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// Rota de teste (sempre funciona)
app.get('/api/test', (req, res) => {
    console.log('✅ Endpoint de teste acessado');
    res.json({ message: 'Servidor funcionando!', timestamp: new Date().toISOString() });
});

// Configurar rotas básicas primeiro, depois tentar conectar o banco
let sequelize, usuarioRoutes;

try {
    sequelize = require("./src/config");
    usuarioRoutes = require("./src/routes");
    const { Usuario, Evento, Ingresso } = require("./src/models/associations");
    
    app.use("/api", usuarioRoutes);
    
    console.log("📦 Tentando sincronizar banco de dados...");
    
    // Não bloquear o servidor por causa do banco
    sequelize.sync()
        .then(() => {
            console.log("✅ Banco sincronizado com sucesso!");
        })
        .catch(err => {
            console.error("⚠️ Erro no banco (servidor continuando):", err.message);
        });
        
} catch (error) {
    console.error("⚠️ Erro ao carregar módulos do banco (servidor continuando):", error.message);
}

// Tratamento de erro
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor sempre, independente do banco
let tentativaPorta = 3001;
let tentativas = 0;
const maxTentativas = 2;

function iniciarServidor() {
    const server = app.listen(tentativaPorta, '127.0.0.1', () => {
        console.log(`🌐 Servidor rodando na porta ${tentativaPorta}`);
        console.log(`🔗 Teste: http://localhost:${tentativaPorta}/api/test`);
    });

    server.on('error', (err) => {
        console.error("❌ Erro ao iniciar servidor:", err);
        if (err.code === 'EADDRINUSE' && tentativas < maxTentativas) {
            tentativas++;
            tentativaPorta = 3000 + tentativas;
            console.log(`Porta ocupada, tentando porta ${tentativaPorta}...`);
            setTimeout(() => iniciarServidor(), 1000);
        } else if (tentativas >= maxTentativas) {
            console.error("❌ Não foi possível iniciar o servidor em nenhuma porta disponível.");
            console.error("💡 Dica: Pare outros processos Node.js com: taskkill /f /im node.exe");
            process.exit(1);
        }
    });
}

iniciarServidor();

// Manter processo vivo
setInterval(() => {
    // Keep alive heartbeat
}, 30000);

console.log("✅ Servidor configurado e rodando!");

//pra o front comunicar com o back vai precisar de axios
//assim como o back precisa do cors pra permitir a comunicação com o front