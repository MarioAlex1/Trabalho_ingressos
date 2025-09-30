const express = require('express');
const router = express.Router();
const { Usuario, Evento, Ingresso, TipoIngresso } = require('./models/associations'); // o Sequelize model

// ===================== ENDPOINT DE LOGIN =====================

// Validar se usuário é organizador (middleware de autenticação simples)
router.get('/usuarios/validar-organizador', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Token não fornecido',
                isOrganizador: false 
            });
        }
        
        // Em um sistema real, você validaria JWT aqui
        // Por simplicidade, vamos extrair o userId do header
        const token = authHeader.replace('Bearer ', '');
        
        // Para simplicidade, vamos assumir que o token contém o userId
        // Em produção, use JWT properly
        const userId = parseInt(token) || null;
        
        console.log('🔍 Debug validar organizador:', { authHeader, token, userId });
        
        if (!userId) {
            console.log('❌ Token inválido:', token);
            return res.status(401).json({ 
                error: 'Token inválido',
                isOrganizador: false 
            });
        }
        
        const usuario = await Usuario.findByPk(userId);
        console.log('🔍 Usuário encontrado:', usuario ? 'SIM' : 'NÃO', userId);
        
        if (!usuario) {
            return res.status(401).json({ 
                error: 'Usuário não encontrado',
                isOrganizador: false 
            });
        }
        
        res.json({
            isOrganizador: usuario.tipoUsuario === 'organizador',
            userId: usuario.id,
            nome: usuario.nome,
            tipoUsuario: usuario.tipoUsuario
        });
        
    } catch (error) {
        console.error('Erro ao validar organizador:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            isOrganizador: false 
        });
    }
});

// Login de usuário
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // Validar campos obrigatórios
        if (!email || !senha) {
            return res.status(400).json({ 
                error: 'Email e senha são obrigatórios',
                details: 'Por favor, preencha todos os campos'
            });
        }
        
        // Buscar usuário por email
        const usuario = await Usuario.findOne({ 
            where: { email: email } 
        });
        
        if (!usuario) {
            return res.status(401).json({ 
                error: 'Credenciais inválidas',
                details: 'Email não cadastrado'
            });
        }
        
        // Verificar senha (comparação simples - em produção use bcrypt)
        if (usuario.senha !== senha) {
            return res.status(401).json({ 
                error: 'Credenciais inválidas',
                details: 'Senha incorreta'
            });
        }
        
        // Login bem-sucedido - remover senha da resposta
        const { senha: _, ...usuarioSemSenha } = usuario.toJSON();
        
        // Token simples para validação (em produção use JWT)
        const token = usuario.id.toString();
        
        res.json({
            message: 'Login realizado com sucesso!',
            usuario: {
                ...usuarioSemSenha,
                token: token
            }
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor', 
            details: error.message 
        });
    }
});

// ===================== ENDPOINTS DE USUÁRIO =====================

// Criar usuário
router.post('/usuarios', async (req, res) => {
    try {
        const novoUsuario = await Usuario.create(req.body);
        res.json(novoUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
    }
});

// Listar todos os usuários
router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
    }
});

// Buscar usuário por ID
router.get('/usuarios/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
    }
});

// Atualizar usuário
router.put('/usuarios/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

        await usuario.update(req.body);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
});

// Deletar usuário
router.delete('/usuarios/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

        await usuario.destroy();
        res.json({ message: 'Usuário deletado' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário', details: error.message });
    }
});

// ===================== ENDPOINTS PARA EVENTOS =====================

// Criar evento
router.post('/eventos', async (req, res) => {
    try {
        const { titulo, endereco, capacidade, dataEvento, descricao, organizadorId, ingressos } = req.body;
        
        console.log('🔍 Dados recebidos para criar evento:', { 
            titulo, endereco, capacidade, dataEvento, descricao, organizadorId, ingressos 
        });
        
        // Validar campos obrigatórios
        if (!titulo || !endereco || !capacidade || !dataEvento || !descricao || !organizadorId) {
            console.log('❌ Campos obrigatórios faltando');
            return res.status(400).json({ 
                error: 'Campos obrigatórios faltando',
                details: 'Título, endereço, capacidade, data do evento, descrição e organizador são obrigatórios'
            });
        }
        
        // Verificar se o organizador existe e é do tipo organizador
        const organizador = await Usuario.findByPk(organizadorId);
        
        if (!organizador) {
            console.log('❌ Organizador não encontrado no banco');
            return res.status(404).json({ 
                error: 'Organizador não encontrado',
                details: 'O usuário especificado como organizador não existe'
            });
        }
        
        if (organizador.tipoUsuario !== 'organizador') {
            return res.status(403).json({ 
                error: 'Usuário não é organizador',
                details: 'Apenas usuários do tipo organizador podem criar eventos'
            });
        }
        
        // Criar o evento
        const evento = await Evento.create({
            titulo,
            endereco,
            capacidade: parseInt(capacidade),
            dataEvento: new Date(dataEvento),
            descricao,
            organizadorId: parseInt(organizadorId),
            imagem: req.body.imagem || null
        });
        
        // Criar os tipos de ingressos se fornecidos
        if (ingressos && Array.isArray(ingressos) && ingressos.length > 0) {
            const tiposIngressos = [];
            
            for (const ingresso of ingressos) {
                if (ingresso.tipo && ingresso.preco && ingresso.quantidade) {
                    const tipoIngresso = await TipoIngresso.create({
                        eventoId: evento.id,
                        tipo: ingresso.tipo,
                        preco: parseFloat(ingresso.preco),
                        quantidade: parseInt(ingresso.quantidade),
                        descricao: ingresso.descricao || null
                    });
                    tiposIngressos.push(tipoIngresso);
                }
            }
            
            // Retornar evento com tipos de ingressos
            const eventoCompleto = await Evento.findByPk(evento.id, {
                include: [
                    {
                        model: TipoIngresso,
                        as: 'tiposIngressos'
                    },
                    {
                        model: Usuario,
                        as: 'organizador',
                        attributes: ['id', 'nome', 'email']
                    }
                ]
            });
            
            res.status(201).json({
                message: 'Evento criado com sucesso!',
                evento: eventoCompleto
            });
        } else {
            res.status(201).json({
                message: 'Evento criado com sucesso!',
                evento: evento
            });
        }
        
    } catch (error) {
        console.error('Erro ao criar evento:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor', 
            details: error.message 
        });
    }
});

// Listar todos os eventos
// Listar todos os eventos com tipos de ingressos
// Endpoint de teste simples
router.get('/test', (req, res) => {
    res.json({ message: 'API funcionando!', timestamp: new Date() });
});

router.get('/eventos', async (req, res) => {
    try {
        const eventos = await Evento.findAll({
            include: [
                {
                    model: TipoIngresso,
                    as: 'tiposIngressos'
                },
                {
                    model: Usuario,
                    as: 'organizador',
                    attributes: ['id', 'nome', 'email']
                }
            ],
            order: [['dataEvento', 'ASC']]
        });
        
        res.json(eventos);
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).json({ error: 'Erro ao buscar eventos', details: error.message });
    }
});

// Buscar evento por ID
router.get('/eventos/:id', async (req, res) => {
    try {
        const evento = await Evento.findByPk(req.params.id, {
            include: [
                {
                    model: TipoIngresso,
                    as: 'tiposIngressos'
                },
                {
                    model: Usuario,
                    as: 'organizador',
                    attributes: ['id', 'nome', 'email']
                }
            ]
        });
        if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
        res.json(evento);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar evento', details: error.message });
    }
});

// Atualizar evento
router.put('/eventos/:id', async (req, res) => {
    try {
        const evento = await Evento.findByPk(req.params.id);
        if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });

        await evento.update(req.body);
        res.json(evento);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar evento', details: error.message });
    }
});

// Deletar evento
router.delete('/eventos/:id', async (req, res) => {
    try {
        const evento = await Evento.findByPk(req.params.id);
        if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });

        await evento.destroy();
        res.json({ message: 'Evento deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar evento', details: error.message });
    }
});

// ===================== ENDPOINTS PARA INGRESSOS =====================

// Criar ingresso (comprar ingresso)
router.post('/ingressos', async (req, res) => {
    try {
        const { usuarioId, eventoId, preco, tipoIngressoId, quantidade = 1 } = req.body;
        
        // Validar campos obrigatórios
        if (!usuarioId || !eventoId || !tipoIngressoId) {
            return res.status(400).json({ 
                error: 'Campos obrigatórios faltando',
                details: 'usuarioId, eventoId e tipoIngressoId são obrigatórios'
            });
        }

        // Verificar se o usuário existe
        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
        
        // Verificar se o evento existe
        const evento = await Evento.findByPk(eventoId);
        if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });

        // Verificar se o tipo de ingresso existe
        const tipoIngresso = await TipoIngresso.findByPk(tipoIngressoId);
        if (!tipoIngresso) return res.status(404).json({ error: 'Tipo de ingresso não encontrado' });

        // REGRA: Apenas um ingresso por cliente por evento
        const ingressoExistente = await Ingresso.findOne({
            where: {
                usuarioId: usuarioId,
                eventoId: eventoId
            }
        });

        if (ingressoExistente) {
            return res.status(400).json({ 
                error: 'Limite excedido',
                details: 'Você já possui um ingresso para este evento. Apenas um ingresso por cliente é permitido.'
            });
        }

        // Verificar disponibilidade do tipo de ingresso
        if (tipoIngresso.quantidade <= tipoIngresso.quantidadeVendida) {
            return res.status(400).json({ 
                error: 'Ingresso esgotado',
                details: 'Este tipo de ingresso está esgotado'
            });
        }
        
        // Gerar código único para o ingresso
        const codigo = `ING-${evento.id}-${usuario.id}-${Date.now()}`;
        
        // Criar ingresso
        const novoIngresso = await Ingresso.create({
            codigo,
            usuarioId,
            eventoId,
            preco: tipoIngresso.preco, // Usar o preço do tipo de ingresso
            tipoIngressoId: tipoIngressoId
        });

        // Atualizar quantidade vendida do tipo de ingresso
        tipoIngresso.quantidadeVendida = (tipoIngresso.quantidadeVendida || 0) + 1;
        await tipoIngresso.save();
        
        // Retornar ingresso criado com dados relacionados
        const ingressoCompleto = await Ingresso.findByPk(novoIngresso.id, {
            include: [
                { model: Usuario, as: "usuario", attributes: ['id', 'nome', 'email'] },
                { model: Evento, as: "evento", attributes: ['id', 'titulo', 'dataEvento', 'endereco'] },
                { model: TipoIngresso, as: "tipoIngresso", attributes: ['id', 'tipo', 'preco'] }
            ]
        });
        
        res.status(201).json({
            message: 'Ingresso comprado com sucesso!',
            ingresso: ingressoCompleto
        });
    } catch (error) {
        console.error('Erro ao criar ingresso:', error);
        res.status(500).json({ error: 'Erro ao criar ingresso', details: error.message });
    }
});

// Rota de teste
router.get('/teste', (req, res) => {
    console.log('Rota de teste chamada');
    res.json({ message: 'Rota de teste funcionando' });
});

// Listar todos os ingressos
router.get('/ingressos', async (req, res) => {
    try {
        const ingressos = await Ingresso.findAll({
            include: [
                { model: Usuario, as: "usuario", attributes: ['id', 'nome', 'email'] },
                { model: Evento, as: "evento", attributes: ['id', 'nome', 'data', 'local'] }
            ]
        });
        res.json(ingressos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ingressos', details: error.message });
    }
});

// Verificar se usuário já possui ingresso para um evento
router.get('/ingressos/verificar/:usuarioId/:eventoId', async (req, res) => {
    try {
        const { usuarioId, eventoId } = req.params;
        
        const ingressoExistente = await Ingresso.findOne({
            where: { 
                usuarioId: usuarioId,
                eventoId: eventoId
            }
        });
        
        res.json({ temIngresso: !!ingressoExistente });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar ingresso', details: error.message });
    }
});

// Buscar ingresso por ID
router.get('/ingressos/:id', async (req, res) => {
    try {
        const ingresso = await Ingresso.findByPk(req.params.id, {
            include: [
                { model: Usuario, as: "usuario", attributes: ['id', 'nome', 'email'] },
                { model: Evento, as: "evento", attributes: ['id', 'nome', 'data', 'local', 'preco'] }
            ]
        });
        if (!ingresso) return res.status(404).json({ error: 'Ingresso não encontrado' });
        res.json(ingresso);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ingresso', details: error.message });
    }
});

// Buscar ingresso por código
router.get('/ingressos/codigo/:codigo', async (req, res) => {
    try {
        const ingresso = await Ingresso.findOne({
            where: { codigo: req.params.codigo },
            include: [
                { model: Usuario, as: "usuario", attributes: ['id', 'nome', 'email'] },
                { model: Evento, as: "evento", attributes: ['id', 'nome', 'data', 'local', 'preco'] }
            ]
        });
        if (!ingresso) return res.status(404).json({ error: 'Ingresso não encontrado' });
        res.json(ingresso);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ingresso', details: error.message });
    }
});

// Buscar ingressos por usuário
router.get('/usuarios/:userId/ingressos', async (req, res) => {
    try {
        const ingressos = await Ingresso.findAll({
            where: { usuarioId: req.params.userId },
            include: [
                { model: Evento, as: "evento", attributes: ['id', 'nome', 'data', 'local', 'preco'] }
            ]
        });
        res.json(ingressos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ingressos do usuário', details: error.message });
    }
});

// Buscar ingressos por evento
router.get('/eventos/:eventoId/ingressos', async (req, res) => {
    try {
        const ingressos = await Ingresso.findAll({
            where: { eventoId: req.params.eventoId },
            include: [
                { model: Usuario, as: "usuario", attributes: ['id', 'nome', 'email'] }
            ]
        });
        res.json(ingressos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ingressos do evento', details: error.message });
    }
});

// Deletar ingresso (cancelar ingresso)
router.delete('/ingressos/:id', async (req, res) => {
    try {
        const ingresso = await Ingresso.findByPk(req.params.id);
        if (!ingresso) return res.status(404).json({ error: 'Ingresso não encontrado' });

        await ingresso.destroy();
        res.json({ message: 'Ingresso cancelado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cancelar ingresso', details: error.message });
    }
});

// ===================== ROTAS PARA TIPOS DE INGRESSOS =====================

// Criar tipo de ingresso
router.post('/tipos-ingressos', async (req, res) => {
    try {
        const { eventoId, tipo, preco, quantidade } = req.body;
        
        console.log('🔍 Criando tipo de ingresso:', { eventoId, tipo, preco, quantidade });
        
        if (!eventoId || !tipo || preco === undefined || !quantidade) {
            return res.status(400).json({ 
                error: 'Campos obrigatórios faltando',
                details: 'eventoId, tipo, preco e quantidade são obrigatórios'
            });
        }

        const tipoIngresso = await TipoIngresso.create({
            eventoId,
            tipo,
            preco: parseFloat(preco),
            quantidade: parseInt(quantidade),
            quantidadeVendida: 0
        });

        console.log('✅ Tipo de ingresso criado:', tipoIngresso.id);
        res.status(201).json(tipoIngresso);
    } catch (error) {
        console.error('❌ Erro ao criar tipo de ingresso:', error);
        res.status(500).json({ error: 'Erro ao criar tipo de ingresso', details: error.message });
    }
});

// Buscar tipos de ingressos por evento
router.get('/eventos/:eventoId/tipos-ingressos', async (req, res) => {
    try {
        const eventoId = parseInt(req.params.eventoId);
        console.log('🔍 Buscando tipos de ingressos para evento:', eventoId);
        
        const tiposIngressos = await TipoIngresso.findAll({
            where: { eventoId }
        });
        
        console.log('✅ Tipos de ingressos encontrados:', tiposIngressos.length);
        res.json(tiposIngressos);
    } catch (error) {
        console.error('❌ Erro ao buscar tipos de ingressos:', error);
        res.status(500).json({ error: 'Erro ao buscar tipos de ingressos', details: error.message });
    }
});

module.exports = router;