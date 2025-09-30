const express = require("express");
const cors = require("cors");
const app = express();

console.log("📋 Iniciando servidor...");

// Configurações básicas
app.use(cors({ 
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

console.log("✅ Middlewares configurados");

// Dados mockados para teste
const usuariosMock = [
    { id: 1, nome: 'Test Organizer', email: 'organizer@test.com', tipoUsuario: 'organizador' },
    { id: 2, nome: 'Frontend Organizer', email: 'frontend@test.com', tipoUsuario: 'organizador' },
    { id: 3, nome: 'Test Client', email: 'client@test.com', tipoUsuario: 'cliente' }
];

// Rotas básicas para teste
app.get('/api/usuarios', (req, res) => {
    console.log('📞 GET /api/usuarios chamado');
    res.json(usuariosMock);
});

app.get('/api/usuarios/validar-organizador', (req, res) => {
    console.log('📞 GET /api/usuarios/validar-organizador chamado');
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido', isOrganizador: false });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const userId = parseInt(token);
    const usuario = usuariosMock.find(u => u.id === userId);
    
    if (!usuario) {
        return res.status(401).json({ error: 'Usuário não encontrado', isOrganizador: false });
    }
    
    res.json({
        isOrganizador: usuario.tipoUsuario === 'organizador',
        userId: usuario.id,
        nome: usuario.nome,
        tipoUsuario: usuario.tipoUsuario
    });
});

app.post('/api/login', (req, res) => {
    console.log('📞 POST /api/login chamado');
    const { email, senha } = req.body;
    
    // Login simples para teste
    const usuario = usuariosMock.find(u => u.email === email);
    
    if (!usuario) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    
    res.json({
        message: 'Login realizado com sucesso!',
        usuario: {
            ...usuario,
            token: usuario.id.toString()
        }
    });
});

// Rota de health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Tratamento de erro global
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = 3001;

// Iniciar servidor
try {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
        console.log(`📡 Health check: http://localhost:${PORT}/health`);
        console.log(`👤 Usuários: http://localhost:${PORT}/api/usuarios`);
    });
} catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
}

process.on('uncaughtException', (err) => {
    console.error('❌ Erro não capturado:', err);
});