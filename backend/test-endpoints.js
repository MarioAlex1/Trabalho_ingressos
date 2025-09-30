const express = require('express');
const cors = require('cors');

const app = express();
const port = 3002;

// Middlewares
app.use(cors());
app.use(express.json());

// Arrays de teste
let ingressosVendidos = [];

// Endpoint de teste básico
app.get('/api/test', (req, res) => {
    res.json({ message: 'Servidor de teste funcionando!', timestamp: new Date() });
});

// Endpoint para obter ingressos de um usuário
app.get('/api/usuarios/:usuarioId/ingressos', (req, res) => {
    const { usuarioId } = req.params;
    
    console.log(`📋 Consultando ingressos do usuário: ${usuarioId}`);
    
    // Filtrar ingressos do usuário
    const ingressosDoUsuario = ingressosVendidos.filter(ingresso => 
        ingresso.usuarioId && ingresso.usuarioId.toString() === usuarioId.toString()
    );
    
    console.log(`🎫 Encontrados ${ingressosDoUsuario.length} ingressos para o usuário ${usuarioId}`);
    
    res.json({
        success: true,
        ingressos: ingressosDoUsuario,
        total: ingressosDoUsuario.length
    });
});

// Endpoint de teste para adicionar ingresso
app.post('/api/test/ingresso', (req, res) => {
    const novoIngresso = {
        id: Date.now(),
        codigo: `TEST-${Date.now()}`,
        usuarioId: req.body.usuarioId || 1,
        eventoId: 1,
        evento: { 
            id: 1, 
            titulo: 'Evento Teste', 
            data: '2024-12-25',
            local: 'Local Teste',
            imagem: null
        },
        tipoIngresso: { 
            id: 1, 
            tipo: 'VIP', 
            preco: 100 
        },
        quantidade: 1,
        valorTotal: 100,
        formaPagamento: 'Cartão',
        dataCompra: new Date().toISOString()
    };
    
    ingressosVendidos.push(novoIngresso);
    
    res.json({
        success: true,
        ingresso: novoIngresso
    });
});

console.log("🌐 Iniciando servidor de teste na porta", port);

app.listen(port, () => {
    console.log(`✅ Servidor de teste rodando na porta ${port}`);
    console.log(`🔗 Teste: http://localhost:${port}/api/test`);
    console.log(`🔗 Ingressos: http://localhost:${port}/api/usuarios/1/ingressos`);
});