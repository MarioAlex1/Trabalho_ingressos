const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

// Arrays para armazenar dados em memória
let eventos = [];
let tiposIngressos = [];
let ingressosVendidos = []; // Array para armazenar todos os ingressos vendidos
let nextEventoId = 1;
let nextTipoIngressoId = 1;

console.log("🚀 Iniciando servidor em memória...");

// Middleware
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware de log
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// Rota de teste
app.get('/api/test', (req, res) => {
    console.log('✅ Endpoint /api/test acessado');
    res.json({ 
        message: 'Servidor funcionando!', 
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

// Rota POST eventos
app.post('/api/eventos', (req, res) => {
    console.log('✅ POST /api/eventos');
    console.log('Body recebido:', req.body);
    
    const { titulo, endereco, capacidade, dataEvento, descricao, organizadorId } = req.body;
    
    if (!titulo || !endereco || !capacidade || !dataEvento || !descricao || !organizadorId) {
        return res.status(400).json({ 
            error: 'Campos obrigatórios faltando',
            details: 'Título, endereço, capacidade, data do evento, descrição e organizador são obrigatórios'
        });
    }

    // Criar evento e salvar em memória
    const novoEvento = {
        id: nextEventoId++,
        titulo,
        endereco,
        capacidade: parseInt(capacidade),
        dataEvento: new Date(dataEvento).toISOString(),
        descricao,
        organizadorId: parseInt(organizadorId),
        imagem: req.body.imagem || null,
        cancelado: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Adicionar à lista de eventos
    eventos.push(novoEvento);
    console.log(`📝 Evento criado e salvo: ${novoEvento.titulo} (ID: ${novoEvento.id})`);
    console.log(`📊 Total de eventos: ${eventos.length}`);

    res.status(201).json({
        message: 'Evento criado com sucesso!',
        evento: novoEvento
    });
});

// Rota POST tipos-ingressos
app.post('/api/tipos-ingressos', (req, res) => {
    console.log('✅ POST /api/tipos-ingressos');
    console.log('Body recebido:', req.body);
    
    const { eventoId, tipo, preco, quantidade } = req.body;
    
    if (!eventoId || !tipo || preco === undefined || !quantidade) {
        return res.status(400).json({ 
            error: 'Campos obrigatórios faltando',
            details: 'eventoId, tipo, preco e quantidade são obrigatórios'
        });
    }

    // Criar tipo de ingresso e salvar em memória
    const novoTipoIngresso = {
        id: nextTipoIngressoId++,
        eventoId: parseInt(eventoId),
        tipo,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade),
        quantidadeVendida: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Adicionar à lista de tipos de ingressos
    tiposIngressos.push(novoTipoIngresso);
    console.log(`🎫 Tipo de ingresso criado: ${novoTipoIngresso.tipo} (EventoID: ${eventoId})`);

    res.status(201).json({
        message: 'Tipo de ingresso criado com sucesso!',
        tipoIngresso: novoTipoIngresso
    });
});

// Rota GET eventos
app.get('/api/eventos', (req, res) => {
    console.log('✅ GET /api/eventos');
    console.log(`📊 Retornando ${eventos.length} eventos`);
    
    // Adicionar tipos de ingressos aos eventos
    const eventosComIngressos = eventos.map(evento => {
        const ingressosDoEvento = tiposIngressos.filter(ti => ti.eventoId === evento.id);
        return {
            ...evento,
            tiposIngressos: ingressosDoEvento
        };
    });
    
    res.json(eventosComIngressos);
});

// Rota GET evento específico por ID
app.get('/api/eventos/:id', (req, res) => {
    const eventoId = parseInt(req.params.id);
    console.log(`✅ GET /api/eventos/${eventoId}`);
    
    const evento = eventos.find(e => e.id === eventoId);
    
    if (!evento) {
        console.log(`❌ Evento com ID ${eventoId} não encontrado`);
        return res.status(404).json({ 
            error: 'Evento não encontrado',
            message: `Evento com ID ${eventoId} não existe`
        });
    }
    
    // Adicionar tipos de ingressos ao evento
    const ingressosDoEvento = tiposIngressos.filter(ti => ti.eventoId === eventoId);
    const eventoComIngressos = {
        ...evento,
        tiposIngressos: ingressosDoEvento
    };
    
    console.log(`📋 Evento encontrado: ${evento.titulo}`);
    res.json(eventoComIngressos);
});

// Rota GET tipos de ingressos por evento
app.get('/api/eventos/:eventoId/tipos-ingressos', (req, res) => {
    const eventoId = parseInt(req.params.eventoId);
    console.log(`✅ GET /api/eventos/${eventoId}/tipos-ingressos`);
    
    const ingressosDoEvento = tiposIngressos.filter(ti => ti.eventoId === eventoId);
    console.log(`🎫 Encontrados ${ingressosDoEvento.length} tipos de ingressos para o evento ${eventoId}`);
    
    res.json(ingressosDoEvento);
});

// Rota POST para comprar ingressos
app.post('/api/ingressos', (req, res) => {
    console.log('✅ POST /api/ingressos - Processando compra');
    console.log('Body recebido:', req.body);
    
    // Aceitar tanto o formato antigo quanto o novo do frontend
    let eventoId, tipoIngressoId, quantidade, usuarioId, preco, formaPagamento;
    
    // Formato do frontend atual: { usuarioId, eventoId, tipoIngressoId, preco, formaPagamento }
    if (req.body.usuarioId && req.body.formaPagamento) {
        eventoId = req.body.eventoId;
        tipoIngressoId = req.body.tipoIngressoId;
        usuarioId = req.body.usuarioId;
        preco = req.body.preco;
        formaPagamento = req.body.formaPagamento;
        quantidade = 1; // Padrão para o frontend atual
    } 
    // Formato antigo: { eventoId, tipoIngressoId, quantidade, compradorInfo, pagamento }
    else {
        eventoId = req.body.eventoId;
        tipoIngressoId = req.body.tipoIngressoId;
        quantidade = req.body.quantidade;
        // compradorInfo e pagamento para compatibilidade
    }
    
    // Validações básicas
    if (!eventoId || !tipoIngressoId) {
        return res.status(400).json({ 
            error: 'Dados incompletos',
            message: 'Evento e tipo de ingresso são obrigatórios'
        });
    }
    
    // Verificar se o evento existe
    const evento = eventos.find(e => e.id === parseInt(eventoId));
    if (!evento) {
        return res.status(404).json({ 
            error: 'Evento não encontrado',
            message: `Evento com ID ${eventoId} não existe`
        });
    }
    
    // Verificar se o tipo de ingresso existe
    const tipoIngresso = tiposIngressos.find(ti => ti.id === parseInt(tipoIngressoId) && ti.eventoId === parseInt(eventoId));
    if (!tipoIngresso) {
        return res.status(404).json({ 
            error: 'Tipo de ingresso não encontrado',
            message: `Tipo de ingresso com ID ${tipoIngressoId} não existe para este evento`
        });
    }
    
    // Verificar disponibilidade
    const quantidadeDisponivel = tipoIngresso.quantidade - tipoIngresso.quantidadeVendida;
    if (quantidade > quantidadeDisponivel) {
        return res.status(400).json({ 
            error: 'Quantidade indisponível',
            message: `Apenas ${quantidadeDisponivel} ingressos disponíveis`
        });
    }
    
    // Simular processamento do pagamento
    console.log('💳 Processando pagamento...');
    console.log(`💰 Valor total: R$ ${tipoIngresso.preco * quantidade}`);
    
    // Atualizar quantidade vendida
    tipoIngresso.quantidadeVendida += parseInt(quantidade);
    
    // Gerar dados da compra
    const compra = {
        id: Date.now(), // ID simples baseado em timestamp
        eventoId: parseInt(eventoId),
        tipoIngressoId: parseInt(tipoIngressoId),
        quantidade: parseInt(quantidade),
        valorUnitario: tipoIngresso.preco,
        valorTotal: tipoIngresso.preco * quantidade,
        usuarioId: usuarioId || null,
        formaPagamento: formaPagamento || 'Cartão de Crédito',
        status: 'confirmado',
        dataCompra: new Date().toISOString(),
        codigoIngresso: `ING${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    };
    
    // Armazenar o ingresso vendido para consultas posteriores
    ingressosVendidos.push({
        id: compra.id,
        codigo: compra.codigoIngresso,
        usuarioId: usuarioId || null,
        eventoId: parseInt(eventoId),
        evento: evento,
        tipoIngressoId: parseInt(tipoIngressoId),
        tipoIngresso: tipoIngresso,
        quantidade: parseInt(quantidade),
        valorTotal: compra.valorTotal,
        formaPagamento: compra.formaPagamento,
        dataCompra: compra.dataCompra,
        organizadorId: evento.organizadorId || 1 // ID do organizador do evento
    });
    
    console.log(`✅ Compra processada com sucesso!`);
    console.log(`🎫 Código do ingresso: ${compra.codigoIngresso}`);
    console.log(`📊 Ingressos vendidos para ${tipoIngresso.tipo}: ${tipoIngresso.quantidadeVendida}/${tipoIngresso.quantidade}`);
    
    res.status(201).json({
        success: true,
        message: 'Compra realizada com sucesso!',
        codigo: compra.codigoIngresso, // Frontend espera 'codigo' diretamente
        compra,
        ingresso: {
            codigo: compra.codigoIngresso,
            evento: evento.titulo,
            tipo: tipoIngresso.tipo,
            quantidade: compra.quantidade,
            valorTotal: compra.valorTotal
        }
    });
});

// Endpoint para obter ingressos de um usuário específico (MeusIngressos)
app.get('/api/usuarios/:usuarioId/ingressos', (req, res) => {
    const { usuarioId } = req.params;
    
    console.log(`📋 Consultando ingressos do usuário: ${usuarioId}`);
    
    // Filtrar ingressos do usuário
    const ingressosDoUsuario = ingressosVendidos.filter(ingresso => 
        ingresso.usuarioId && ingresso.usuarioId.toString() === usuarioId.toString()
    );
    
    // Formatar resposta com informações completas
    const ingressosFormatados = ingressosDoUsuario.map(ingresso => ({
        id: ingresso.id,
        codigo: ingresso.codigo,
        evento: {
            id: ingresso.evento.id,
            titulo: ingresso.evento.titulo,
            descricao: ingresso.evento.descricao,
            data: ingresso.evento.data,
            local: ingresso.evento.local,
            imagem: ingresso.evento.imagem
        },
        tipoIngresso: {
            id: ingresso.tipoIngresso.id,
            tipo: ingresso.tipoIngresso.tipo,
            preco: ingresso.tipoIngresso.preco
        },
        quantidade: ingresso.quantidade,
        valorTotal: ingresso.valorTotal,
        formaPagamento: ingresso.formaPagamento,
        dataCompra: ingresso.dataCompra,
        status: 'Confirmado'
    }));
    
    console.log(`🎫 Encontrados ${ingressosFormatados.length} ingressos para o usuário ${usuarioId}`);
    
    res.json({
        success: true,
        ingressos: ingressosFormatados,
        total: ingressosFormatados.length
    });
});

// Endpoint para obter vendas de um organizador específico
app.get('/api/organizadores/:organizadorId/vendas', (req, res) => {
    const { organizadorId } = req.params;
    
    console.log(`📊 Consultando vendas do organizador: ${organizadorId}`);
    
    // Filtrar vendas do organizador
    const vendasDoOrganizador = ingressosVendidos.filter(ingresso => 
        ingresso.organizadorId && ingresso.organizadorId.toString() === organizadorId.toString()
    );
    
    // Agrupar vendas por evento
    const vendasPorEvento = {};
    vendasDoOrganizador.forEach(ingresso => {
        const eventoId = ingresso.eventoId;
        
        if (!vendasPorEvento[eventoId]) {
            vendasPorEvento[eventoId] = {
                evento: ingresso.evento,
                vendas: [],
                resumo: {
                    totalIngressos: 0,
                    valorTotal: 0,
                    tiposVendidos: {}
                }
            };
        }
        
        vendasPorEvento[eventoId].vendas.push({
            id: ingresso.id,
            codigo: ingresso.codigo,
            usuarioId: ingresso.usuarioId,
            tipoIngresso: ingresso.tipoIngresso,
            quantidade: ingresso.quantidade,
            valorTotal: ingresso.valorTotal,
            formaPagamento: ingresso.formaPagamento,
            dataCompra: ingresso.dataCompra
        });
        
        // Atualizar resumo
        vendasPorEvento[eventoId].resumo.totalIngressos += ingresso.quantidade;
        vendasPorEvento[eventoId].resumo.valorTotal += ingresso.valorTotal;
        
        const tipoNome = ingresso.tipoIngresso.tipo;
        if (!vendasPorEvento[eventoId].resumo.tiposVendidos[tipoNome]) {
            vendasPorEvento[eventoId].resumo.tiposVendidos[tipoNome] = 0;
        }
        vendasPorEvento[eventoId].resumo.tiposVendidos[tipoNome] += ingresso.quantidade;
    });
    
    // Calcular estatísticas gerais
    const estatisticas = {
        totalEventosComVendas: Object.keys(vendasPorEvento).length,
        totalIngressosVendidos: vendasDoOrganizador.reduce((sum, v) => sum + v.quantidade, 0),
        receitaTotal: vendasDoOrganizador.reduce((sum, v) => sum + v.valorTotal, 0),
        ultimaVenda: vendasDoOrganizador.length > 0 ? 
            vendasDoOrganizador.sort((a, b) => new Date(b.dataCompra) - new Date(a.dataCompra))[0].dataCompra : null
    };
    
    console.log(`💰 Estatísticas do organizador ${organizadorId}:`);
    console.log(`   - ${estatisticas.totalIngressosVendidos} ingressos vendidos`);
    console.log(`   - R$ ${estatisticas.receitaTotal.toFixed(2)} de receita total`);
    console.log(`   - ${estatisticas.totalEventosComVendas} eventos com vendas`);
    
    res.json({
        success: true,
        organizadorId: parseInt(organizadorId),
        estatisticas: estatisticas,
        eventoComVendas: vendasPorEvento,
        totalVendas: vendasDoOrganizador.length
    });
});

// Tratamento de erro
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
console.log("🌐 Iniciando servidor na porta", port);

const server = app.listen(port, () => {
    console.log(`✅ Servidor rodando na porta ${port}`);
    console.log(`🔗 Teste: http://localhost:${port}/api/test`);
    console.log(`🔗 Eventos: http://localhost:${port}/api/eventos`);
});

server.on('error', (err) => {
    console.error("❌ Erro ao iniciar servidor:", err);
    if (err.code === 'EADDRINUSE') {
        console.log('Porta já está em uso. Tentando porta 3001...');
        server.listen(3001);
    }
});

console.log("🔄 Servidor iniciado e pronto!");