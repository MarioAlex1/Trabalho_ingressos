const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// Arquivo para persistência
const dataFile = path.join(__dirname, 'dados-servidor.json');

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware de log para todas as requisições
app.use((req, res, next) => {
    console.log(`🔄 ${new Date().toLocaleTimeString()} - ${req.method} ${req.url} - Origin: ${req.get('Origin') || 'N/A'}`);
    console.log('📝 Headers:', JSON.stringify(req.headers, null, 2));
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

console.log("🚀 Iniciando servidor atualizado...");

// Base de usuários válidos
const usuariosValidos = [
    {
        id: 1,
        email: 'admin@ticketsystem.com',
        senha: 'admin123',
        nome: 'Administrador',
        tipoUsuario: 'organizador'
    },
    {
        id: 2,
        email: 'organizador@eventos.com',
        senha: 'org123',
        nome: 'João Organizador',
        tipoUsuario: 'organizador'
    },
    {
        id: 3,
        email: 'organizador2@eventos.com',
        senha: 'org456',
        nome: 'Maria Organizadora',
        tipoUsuario: 'organizador'
    },
    {
        id: 4,
        email: 'cliente@email.com',
        senha: 'cliente123',
        nome: 'Pedro Cliente',
        tipoUsuario: 'cliente'
    },
    {
        id: 5,
        email: 'ana@gmail.com',
        senha: '123456',
        nome: 'Ana Silva',
        tipoUsuario: 'cliente'
    },
    {
        id: 6,
        email: 'carlos@hotmail.com',
        senha: 'carlos123',
        nome: 'Carlos Santos',
        tipoUsuario: 'cliente'
    }
];

// Arrays para armazenar dados em memória
let eventos = [];
let tiposIngressos = [];
let ingressosVendidos = [];
let nextEventoId = 1;
let nextTipoIngressoId = 1;

// Funções de persistência
function salvarDados() {
    const dados = {
        usuarios: usuariosValidos, // Incluir usuários
        eventos,
        tiposIngressos,
        ingressosVendidos,
        nextEventoId,
        nextTipoIngressoId,
        timestamp: new Date().toISOString()
    };
    
    try {
        fs.writeFileSync(dataFile, JSON.stringify(dados, null, 2));
        console.log('💾 Dados salvos em arquivo (incluindo usuários)');
    } catch (error) {
        console.error('❌ Erro ao salvar dados:', error);
    }
}

function carregarDados() {
    try {
        if (fs.existsSync(dataFile)) {
            const dados = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
            
            // Carregar usuários se existirem, senão manter os padrão
            if (dados.usuarios && dados.usuarios.length > 0) {
                // Mesclar usuários salvos com usuários padrão, evitando duplicatas
                dados.usuarios.forEach(usuarioSalvo => {
                    const existe = usuariosValidos.find(u => u.email === usuarioSalvo.email);
                    if (!existe) {
                        usuariosValidos.push(usuarioSalvo);
                    }
                });
            }
            
            eventos = dados.eventos || [];
            tiposIngressos = dados.tiposIngressos || [];
            ingressosVendidos = dados.ingressosVendidos || [];
            nextEventoId = dados.nextEventoId || 1;
            nextTipoIngressoId = dados.nextTipoIngressoId || 1;
            
            console.log(`📂 Dados carregados do arquivo:`);
            console.log(`   - ${usuariosValidos.length} usuários`);
            console.log(`   - ${eventos.length} eventos`);
            console.log(`   - ${tiposIngressos.length} tipos de ingressos`);
            console.log(`   - ${ingressosVendidos.length} ingressos vendidos`);
            return true;
        }
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
    }
    return false;
}

// Dados iniciais de teste
function criarDadosIniciais() {
    console.log("🎭 Criando dados iniciais de teste...");
    
    // Tentar carregar dados existentes primeiro
    if (carregarDados()) {
        console.log("✅ Dados existentes carregados com sucesso!");
        return;
    }
    
    // Se não há dados salvos, criar dados iniciais
    console.log("🆕 Criando dados iniciais pela primeira vez...");
    eventos = [];
    tiposIngressos = [];
    ingressosVendidos = [];
    nextEventoId = 1;
    nextTipoIngressoId = 1;
    
    // Eventos removidos: Show da Marília Mendonça e Festival de Rock Nacional
    // Mantendo apenas os eventos necessários para demonstração
    
    // Criar apenas alguns ingressos de exemplo válidos se necessário
    const ingressosExemplo = [
        // Ingressos de exemplo podem ser adicionados aqui conforme necessário
    ];
    ingressosVendidos.push(...ingressosExemplo);
    
    console.log(`✅ Dados iniciais criados:`);
    console.log(`   - ${eventos.length} eventos`);
    console.log(`   - ${tiposIngressos.length} tipos de ingressos`);
    console.log(`   - ${ingressosVendidos.length} ingressos vendidos`);
    
    // Salvar dados iniciais
    salvarDados();
}

// Executar ao iniciar
criarDadosIniciais();

// Endpoint de teste
app.get('/api/test', (req, res) => {
    res.json({
        message: "Servidor funcionando!",
        timestamp: new Date().toISOString(),
        version: "2.1.0"
    });
});

// Endpoint de debug para ver o estado completo
app.get('/api/debug', (req, res) => {
    res.json({
        eventos: eventos,
        tiposIngressos: tiposIngressos,
        ingressosVendidos: ingressosVendidos,
        nextEventoId: nextEventoId,
        nextTipoIngressoId: nextTipoIngressoId,
        timestamp: new Date().toISOString()
    });
});

// Endpoint para listar eventos
app.get('/api/eventos', (req, res) => {
    const { organizadorId } = req.query;
    
    console.log('📋 Listando eventos...');
    console.log(`🎪 Total de eventos: ${eventos.length}`);
    
    let eventosFiltrados = eventos;
    
    // Filtrar por organizador se especificado
    if (organizadorId) {
        eventosFiltrados = eventos.filter(evento => 
            evento.organizadorId && evento.organizadorId.toString() === organizadorId.toString()
        );
        console.log(`🔍 Filtrado por organizador ${organizadorId}: ${eventosFiltrados.length} eventos`);
    }
    
    res.json(eventosFiltrados);
});

// Endpoint para obter detalhes de um evento
app.get('/api/eventos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`🔍 Buscando evento com ID: ${id}`);
    
    const evento = eventos.find(e => e.id === id);
    if (!evento) {
        console.log(`❌ Evento ${id} não encontrado`);
        return res.status(404).json({ error: 'Evento não encontrado' });
    }
    
    console.log(`✅ Evento encontrado: ${evento.titulo}`);
    
    // Buscar tipos de ingresso do evento
    const tiposDoEvento = tiposIngressos.filter(ti => ti.eventoId === id);
    
    res.json({
        ...evento,
        tiposIngresso: tiposDoEvento
    });
});

// Endpoint para listar tipos de ingressos de um evento específico
app.get('/api/eventos/:id/tipos-ingressos', (req, res) => {
    const eventoId = parseInt(req.params.id);
    console.log(`🎫 Buscando tipos de ingressos para evento: ${eventoId}`);
    
    const tiposDoEvento = tiposIngressos.filter(ti => ti.eventoId === eventoId);
    
    console.log(`✅ Encontrados ${tiposDoEvento.length} tipos de ingressos`);
    
    res.json(tiposDoEvento);
});

// Endpoint para criar evento
app.post('/api/eventos', (req, res) => {
    const novoEvento = {
        id: nextEventoId++,
        ...req.body,
        organizadorId: req.body.organizadorId || 1 // Usa o ID enviado ou 1 como fallback
    };
    
    eventos.push(novoEvento);
    console.log(`✅ Evento criado: ${novoEvento.titulo} (ID: ${novoEvento.id})`);
    
    // Salvar dados após criação do evento
    salvarDados();
    
    res.status(201).json(novoEvento);
});

// Endpoint para criar tipos de ingresso
app.post('/api/tipos-ingressos', (req, res) => {
    const novoTipo = {
        id: nextTipoIngressoId++,
        ...req.body,
        quantidadeVendida: 0
    };
    
    tiposIngressos.push(novoTipo);
    console.log(`🎫 Tipo de ingresso criado: ${novoTipo.tipo} - R$ ${novoTipo.preco}`);
    
    // Salvar dados após criação do tipo de ingresso
    salvarDados();
    
    res.status(201).json(novoTipo);
});

// Endpoint para comprar ingressos
app.post('/api/ingressos', (req, res) => {
    console.log('🛒 Processando compra de ingresso...');
    
    const { usuarioId, eventoId, tipoIngressoId, preco, formaPagamento, quantidade = 1 } = req.body;
    
    // Verificar se o evento existe
    const evento = eventos.find(e => e.id === parseInt(eventoId));
    if (!evento) {
        return res.status(404).json({ error: 'Evento não encontrado' });
    }
    
    // Verificar se o tipo de ingresso existe
    const tipoIngresso = tiposIngressos.find(ti => ti.id === parseInt(tipoIngressoId));
    if (!tipoIngresso) {
        return res.status(404).json({ error: 'Tipo de ingresso não encontrado' });
    }
    
    // Gerar código único do ingresso
    const codigo = `ING${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Criar objeto da compra
    const compra = {
        id: Date.now(),
        eventoId: parseInt(eventoId),
        tipoIngressoId: parseInt(tipoIngressoId),
        quantidade: parseInt(quantidade),
        valorUnitario: tipoIngresso.preco,
        valorTotal: tipoIngresso.preco * quantidade,
        usuarioId: usuarioId || null,
        formaPagamento: formaPagamento || 'Cartão de Crédito',
        status: 'confirmado',
        dataCompra: new Date().toISOString(),
        codigoIngresso: codigo
    };
    
    // Armazenar o ingresso vendido
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
        organizadorId: evento.organizadorId || 1
    });
    
    // Salvar dados após compra de ingresso
    salvarDados();
    
    console.log(`✅ Compra processada! Código: ${codigo}`);
    
    res.status(201).json({
        success: true,
        message: 'Compra realizada com sucesso!',
        codigo: compra.codigoIngresso,
        compra
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
    
    // Formatar resposta
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

// Endpoint para obter vendas de um organizador
app.get('/api/organizadores/:organizadorId/vendas', (req, res) => {
    const { organizadorId } = req.params;
    
    console.log(`📊 Consultando vendas do organizador: ${organizadorId}`);
    
    // Filtrar vendas do organizador
    const vendasDoOrganizador = ingressosVendidos.filter(ingresso => 
        ingresso.organizadorId && ingresso.organizadorId.toString() === organizadorId.toString()
    );
    
    // Agrupar por evento
    const vendasPorEvento = {};
    vendasDoOrganizador.forEach(venda => {
        const eventoId = venda.eventoId;
        if (!vendasPorEvento[eventoId]) {
            vendasPorEvento[eventoId] = {
                evento: venda.evento,
                vendas: [],
                resumo: {
                    totalIngressos: 0,
                    totalReceita: 0,
                    tiposVendidos: {}
                }
            };
        }
        
        vendasPorEvento[eventoId].vendas.push(venda);
        vendasPorEvento[eventoId].resumo.totalIngressos += venda.quantidade;
        vendasPorEvento[eventoId].resumo.totalReceita += venda.valorTotal;
        
        const tipoNome = venda.tipoIngresso.tipo;
        if (!vendasPorEvento[eventoId].resumo.tiposVendidos[tipoNome]) {
            vendasPorEvento[eventoId].resumo.tiposVendidos[tipoNome] = 0;
        }
        vendasPorEvento[eventoId].resumo.tiposVendidos[tipoNome] += venda.quantidade;
    });
    
    console.log(`💰 Encontradas ${vendasDoOrganizador.length} vendas para o organizador ${organizadorId}`);
    
    res.json({
        success: true,
        organizadorId: parseInt(organizadorId),
        vendas: vendasDoOrganizador,
        vendasPorEvento: vendasPorEvento,
        resumoGeral: {
            totalVendas: vendasDoOrganizador.length,
            totalReceita: vendasDoOrganizador.reduce((sum, v) => sum + v.valorTotal, 0),
            totalIngressos: vendasDoOrganizador.reduce((sum, v) => sum + v.quantidade, 0),
            eventosComVendas: Object.keys(vendasPorEvento).length
        }
    });
});

// Endpoint para notificações recentes de vendas
app.get('/api/organizadores/:organizadorId/notificacoes', (req, res) => {
    const { organizadorId } = req.params;
    const { limite = 10 } = req.query;
    
    console.log(`🔔 Consultando notificações do organizador: ${organizadorId}`);
    
    // Filtrar e ordenar vendas recentes
    const vendasRecentes = ingressosVendidos
        .filter(ingresso => ingresso.organizadorId && ingresso.organizadorId.toString() === organizadorId.toString())
        .sort((a, b) => new Date(b.dataCompra) - new Date(a.dataCompra))
        .slice(0, parseInt(limite))
        .map(venda => ({
            id: venda.id,
            codigo: venda.codigo,
            evento: venda.evento.titulo,
            tipoIngresso: venda.tipoIngresso.tipo,
            quantidade: venda.quantidade,
            valorTotal: venda.valorTotal,
            dataVenda: venda.dataCompra,
            formaPagamento: venda.formaPagamento,
            tempoDecorrido: calcularTempoDecorrido(venda.dataCompra)
        }));
    
    console.log(`🔔 ${vendasRecentes.length} notificações encontradas`);
    
    res.json({
        success: true,
        notificacoes: vendasRecentes,
        total: vendasRecentes.length
    });
});

// Função auxiliar para calcular tempo decorrido
function calcularTempoDecorrido(dataVenda) {
    const agora = new Date();
    const venda = new Date(dataVenda);
    const diferencaMs = agora - venda;
    
    const minutos = Math.floor(diferencaMs / (1000 * 60));
    const horas = Math.floor(diferencaMs / (1000 * 60 * 60));
    const dias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
    
    if (minutos < 60) {
        return `${minutos} minuto${minutos !== 1 ? 's' : ''} atrás`;
    } else if (horas < 24) {
        return `${horas} hora${horas !== 1 ? 's' : ''} atrás`;
    } else {
        return `${dias} dia${dias !== 1 ? 's' : ''} atrás`;
    }
}

// Endpoint de login com validação adequada
app.post('/api/login', (req, res) => {
    const { email, password, senha } = req.body;
    
    // Aceita tanto 'password' quanto 'senha'
    const userPassword = password || senha;
    
    console.log('🔐 Tentativa de login:', email);
    
    // Validar se email e senha foram fornecidos
    if (!email || !userPassword) {
        console.log('❌ Login falhou - email ou senha em branco');
        return res.status(400).json({
            success: false,
            message: 'Email e senha são obrigatórios'
        });
    }
    
    // Buscar usuário na base de dados
    const usuario = usuariosValidos.find(user => 
        user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (!usuario) {
        console.log('❌ Login falhou - usuário não encontrado:', email);
        return res.status(401).json({
            success: false,
            message: 'Email não cadastrado no sistema'
        });
    }
    
    // Verificar senha
    if (usuario.senha !== userPassword) {
        console.log('❌ Login falhou - senha incorreta para:', email);
        return res.status(401).json({
            success: false,
            message: 'Senha incorreta'
        });
    }
    
    // Login bem-sucedido
    const userResponse = {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tipoUsuario: usuario.tipoUsuario
    };
    
    console.log('✅ Login bem-sucedido:', userResponse);
    
    res.json({
        success: true,
        message: 'Login realizado com sucesso!',
        user: userResponse,
        token: 'token-' + usuario.id + '-' + Date.now()
    });
});

// Endpoint para registrar novo usuário
app.post('/api/usuarios', (req, res) => {
    console.log('🔍 DEBUG - Headers recebidos:', req.headers);
    console.log('🔍 DEBUG - Body completo:', req.body);
    
    const { nome, email, cpf, telefone, senha, tipoUsuario } = req.body;
    
    console.log('📝 Tentativa de registro:', { email, nome, tipoUsuario });
    
    // Validações básicas
    if (!nome || !email || !senha) {
        console.log('❌ Registro falhou - campos obrigatórios em branco');
        return res.status(400).json({
            success: false,
            message: 'Nome, email e senha são obrigatórios'
        });
    }
    
    // Verificar se email já existe
    const emailExistente = usuariosValidos.find(user => 
        user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (emailExistente) {
        console.log('❌ Registro falhou - email já cadastrado:', email);
        return res.status(409).json({
            success: false,
            message: 'Este email já está cadastrado no sistema'
        });
    }
    
    // Gerar novo ID
    const novoId = Math.max(...usuariosValidos.map(u => u.id)) + 1;
    
    // Criar novo usuário
    const novoUsuario = {
        id: novoId,
        email: email.toLowerCase(),
        senha: senha,
        nome: nome,
        tipoUsuario: tipoUsuario || 'cliente',
        cpf: cpf || null,
        telefone: telefone || null,
        dataCadastro: new Date().toISOString()
    };
    
    // Adicionar à lista de usuários válidos
    usuariosValidos.push(novoUsuario);
    
    // Salvar dados após registrar usuário
    salvarDados();
    
    console.log('✅ Usuário registrado com sucesso:', { id: novoId, email, nome });
    
    // Retornar dados do usuário (sem a senha)
    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    
    res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso!',
        user: usuarioSemSenha,
        token: `token-${novoId}-${Date.now()}`
    });
});

// Endpoint para listar usuários disponíveis (apenas para desenvolvimento)
app.get('/api/usuarios-disponiveis', (req, res) => {
    const usuariosSemSenha = usuariosValidos.map(user => ({
        email: user.email,
        nome: user.nome,
        tipoUsuario: user.tipoUsuario,
        senhaHint: user.senha.substring(0, 3) + '***' // Apenas primeiros caracteres para hint
    }));
    
    res.json({
        message: 'Usuários disponíveis para teste',
        usuarios: usuariosSemSenha
    });
});

// Endpoint para atualizar usuário
app.put('/api/usuarios/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    const { nome, email, cpf, telefone, tipoUsuario } = req.body;
    
    console.log('🔄 Tentativa de atualização do usuário:', userId);
    console.log('📝 Dados recebidos:', { nome, email, cpf, telefone, tipoUsuario });
    
    // Validações básicas
    if (!nome || !email || !cpf || !telefone || !tipoUsuario) {
        return res.status(400).json({
            success: false,
            message: 'Todos os campos são obrigatórios',
            details: 'Nome, email, CPF, telefone e tipo de usuário são obrigatórios'
        });
    }
    
    // Buscar usuário existente
    const userIndex = usuariosValidos.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
        console.log('❌ Usuário não encontrado:', userId);
        return res.status(404).json({
            success: false,
            message: 'Usuário não encontrado'
        });
    }
    
    // Verificar se o email não está sendo usado por outro usuário
    const emailExists = usuariosValidos.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && user.id !== userId
    );
    
    if (emailExists) {
        return res.status(409).json({
            success: false,
            message: 'Este email já está sendo usado por outro usuário'
        });
    }
    
    // Atualizar dados do usuário (manter senha e outros dados existentes)
    const updatedUser = {
        ...usuariosValidos[userIndex],
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        cpf: cpf.replace(/\D/g, ''), // Remove formatação
        telefone: telefone.replace(/\D/g, ''), // Remove formatação  
        tipoUsuario,
        dataAtualizacao: new Date().toLocaleString('pt-BR')
    };
    
    usuariosValidos[userIndex] = updatedUser;
    
    // Salvar dados atualizados
    salvarDados();
    
    // Resposta de sucesso (sem senha)
    const userResponse = {
        id: updatedUser.id,
        nome: updatedUser.nome,
        email: updatedUser.email,
        cpf: updatedUser.cpf,
        telefone: updatedUser.telefone,
        tipoUsuario: updatedUser.tipoUsuario,
        dataAtualizacao: updatedUser.dataAtualizacao
    };
    
    console.log('✅ Usuário atualizado com sucesso:', userResponse);
    
    res.json({
        success: true,
        message: 'Perfil atualizado com sucesso!',
        user: userResponse
    });
});

// Endpoint para listar usuários disponíveis (apenas para desenvolvimento)
app.get('/api/usuarios-disponiveis', (req, res) => {
    const usuariosSemSenha = usuariosValidos.map(user => ({
        email: user.email,
        nome: user.nome,
        tipoUsuario: user.tipoUsuario,
        senhaHint: user.senha.substring(0, 3) + '***'
    }));
    
    res.json({
        message: 'Usuários válidos para login',
        usuarios: usuariosSemSenha
    });
});

// Iniciar servidor
console.log("🌐 Iniciando servidor na porta", port);

app.listen(port, () => {
    console.log(`✅ Servidor rodando na porta ${port}`);
    console.log(`🔗 Teste: http://localhost:${port}/api/test`);
    console.log(`🔗 Eventos: http://localhost:${port}/api/eventos`);
    console.log(`🔗 Ingressos: http://localhost:${port}/api/usuarios/1/ingressos`);
    console.log("🔄 Servidor pronto para uso!");
});