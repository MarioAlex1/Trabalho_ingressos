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
// ===================== ENDPOINTS DE RELATÓRIOS =====================

// Relatório de vendas totais
router.get('/relatorios/vendas/totais', async (req, res) => {
    try {
        // Total de ingressos vendidos
        const totalIngressosVendidos = await Ingresso.count();
        
        // Total de eventos cadastrados
        const totalEventos = await Evento.count();
        
        // Total de usuários cadastrados
        const totalUsuarios = await Usuario.count();
        
        // Receita total (soma dos preços dos eventos dos ingressos vendidos)
        const ingressosComEventos = await Ingresso.findAll({
            include: [{ model: Evento, attributes: ['preco'] }]
        });
        
        const receitaTotal = ingressosComEventos.reduce((total, ingresso) => {
            return total + (ingresso.Evento?.preco || 0);
        }, 0);
        
        // Ticket médio (receita total / total de ingressos)
        const ticketMedio = totalIngressosVendidos > 0 ? receitaTotal / totalIngressosVendidos : 0;
        
        // Eventos com ingressos vendidos vs eventos sem vendas
        const eventosComVendas = await Evento.findAll({
            attributes: [
                'id',
                [require('sequelize').fn('COUNT', require('sequelize').col('Ingressos.id')), 'ingressosVendidos']
            ],
            include: [{
                model: Ingresso,
                attributes: []
            }],
            group: ['Evento.id'],
            having: require('sequelize').literal('COUNT(Ingressos.id) > 0')
        });
        
        const eventosComVendasCount = eventosComVendas.length;
        const eventosSemVendas = totalEventos - eventosComVendasCount;

        res.json({
            resumoGeral: {
                totalIngressosVendidos,
                totalEventos,
                totalUsuarios,
                receitaTotal: parseFloat(receitaTotal.toFixed(2)),
                ticketMedio: parseFloat(ticketMedio.toFixed(2)),
                eventosComVendas: eventosComVendasCount,
                eventosSemVendas
            },
            estatisticas: {
                percentualEventosComVendas: totalEventos > 0 ? parseFloat(((eventosComVendasCount / totalEventos) * 100).toFixed(2)) : 0,
                mediaIngressosPorEvento: eventosComVendasCount > 0 ? parseFloat((totalIngressosVendidos / eventosComVendasCount).toFixed(2)) : 0
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar relatório de vendas totais', details: error.message });
    }
});

// Relatório de status dos ingressos
router.get('/relatorios/ingressos/status', async (req, res) => {
    try {
        // Buscar todos os eventos com informações de capacidade e vendas
        const eventosComStatus = await Evento.findAll({
            attributes: [
                'id', 'nome', 'data', 'local', 'capacidade', 'preco',
                [require('sequelize').fn('COUNT', require('sequelize').col('Ingressos.id')), 'ingressosVendidos']
            ],
            include: [{
                model: Ingresso,
                attributes: []
            }],
            group: ['Evento.id'],
            order: [['data', 'ASC']]
        });

        // Processar dados para cada evento
        const statusDetalhado = eventosComStatus.map(evento => {
            const ingressosVendidos = parseInt(evento.dataValues.ingressosVendidos) || 0;
            const ingressosDisponiveis = evento.capacidade - ingressosVendidos;
            const percentualVendido = evento.capacidade > 0 ? 
                ((ingressosVendidos / evento.capacidade) * 100) : 0;
            
            let statusEvento;
            if (percentualVendido === 0) statusEvento = 'Sem vendas';
            else if (percentualVendido < 50) statusEvento = 'Baixa ocupação';
            else if (percentualVendido < 80) statusEvento = 'Ocupação média';
            else if (percentualVendido < 100) statusEvento = 'Alta ocupação';
            else statusEvento = 'Esgotado';

            return {
                evento: {
                    id: evento.id,
                    nome: evento.nome,
                    data: evento.data,
                    local: evento.local,
                    preco: evento.preco
                },
                capacidade: {
                    total: evento.capacidade,
                    vendidos: ingressosVendidos,
                    disponiveis: ingressosDisponiveis,
                    percentualVendido: parseFloat(percentualVendido.toFixed(2))
                },
                status: statusEvento,
                receitaGerada: parseFloat((ingressosVendidos * evento.preco).toFixed(2))
            };
        });

        // Resumo geral
        const totalCapacidade = eventosComStatus.reduce((sum, evento) => sum + evento.capacidade, 0);
        const totalVendidos = eventosComStatus.reduce((sum, evento) => 
            sum + (parseInt(evento.dataValues.ingressosVendidos) || 0), 0);
        const totalDisponiveis = totalCapacidade - totalVendidos;
        const percentualGeralVendido = totalCapacidade > 0 ? 
            ((totalVendidos / totalCapacidade) * 100) : 0;

        // Contar eventos por status
        const eventosPorStatus = statusDetalhado.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
        }, {});

        res.json({
            resumoGeral: {
                totalCapacidade,
                totalVendidos,
                totalDisponiveis,
                percentualGeralVendido: parseFloat(percentualGeralVendido.toFixed(2)),
                totalEventos: eventosComStatus.length
            },
            distribuicaoPorStatus: eventosPorStatus,
            detalhePorEvento: statusDetalhado
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar relatório de status dos ingressos', details: error.message });
    }
});

// Relatório de vendas por evento
router.get('/relatorios/vendas/por-evento', async (req, res) => {
    try {
        // Parâmetros opcionais para filtros
        const { ordenarPor = 'vendas', limite = null, apenasComVendas = false } = req.query;

        let whereClause = {};
        let havingClause = null;

        if (apenasComVendas === 'true') {
            havingClause = require('sequelize').literal('COUNT(Ingressos.id) > 0');
        }

        // Definir ordenação
        let orderClause;
        switch (ordenarPor) {
            case 'receita':
                orderClause = [[require('sequelize').literal('receitaTotal'), 'DESC']];
                break;
            case 'nome':
                orderClause = [['nome', 'ASC']];
                break;
            case 'data':
                orderClause = [['data', 'ASC']];
                break;
            case 'vendas':
            default:
                orderClause = [[require('sequelize').literal('ingressosVendidos'), 'DESC']];
        }

        const vendasPorEvento = await Evento.findAll({
            attributes: [
                'id', 'nome', 'data', 'local', 'capacidade', 'preco',
                [require('sequelize').fn('COUNT', require('sequelize').col('Ingressos.id')), 'ingressosVendidos'],
                [require('sequelize').literal('COUNT(Ingressos.id) * preco'), 'receitaTotal'],
                [require('sequelize').literal('capacidade - COUNT(Ingressos.id)'), 'ingressosDisponiveis']
            ],
            include: [{
                model: Ingresso,
                attributes: [],
                include: [{
                    model: Usuario,
                    attributes: []
                }]
            }],
            where: whereClause,
            group: ['Evento.id'],
            having: havingClause,
            order: orderClause,
            limit: limite ? parseInt(limite) : null
        });

        // Processar resultados com informações adicionais
        const dadosProcessados = vendasPorEvento.map(evento => {
            const ingressosVendidos = parseInt(evento.dataValues.ingressosVendidos) || 0;
            const receitaTotal = parseFloat(evento.dataValues.receitaTotal) || 0;
            const ingressosDisponiveis = parseInt(evento.dataValues.ingressosDisponiveis) || evento.capacidade;
            const percentualOcupacao = evento.capacidade > 0 ? 
                ((ingressosVendidos / evento.capacidade) * 100) : 0;

            return {
                evento: {
                    id: evento.id,
                    nome: evento.nome,
                    data: evento.data,
                    local: evento.local,
                    precoUnitario: evento.preco
                },
                vendas: {
                    ingressosVendidos,
                    ingressosDisponiveis,
                    capacidadeTotal: evento.capacidade,
                    percentualOcupacao: parseFloat(percentualOcupacao.toFixed(2))
                },
                financeiro: {
                    receitaTotal: parseFloat(receitaTotal.toFixed(2)),
                    receitaPotencial: parseFloat((evento.capacidade * evento.preco).toFixed(2)),
                    receitaPerdida: parseFloat(((evento.capacidade - ingressosVendidos) * evento.preco).toFixed(2))
                }
            };
        });

        // Estatísticas gerais
        const totalReceita = dadosProcessados.reduce((sum, item) => sum + item.financeiro.receitaTotal, 0);
        const totalIngressos = dadosProcessados.reduce((sum, item) => sum + item.vendas.ingressosVendidos, 0);
        const totalCapacidade = dadosProcessados.reduce((sum, item) => sum + item.vendas.capacidadeTotal, 0);

        res.json({
            estatisticasGerais: {
                totalEventos: dadosProcessados.length,
                totalReceita: parseFloat(totalReceita.toFixed(2)),
                totalIngressosVendidos: totalIngressos,
                totalCapacidade,
                ocupacaoMediaGeral: totalCapacidade > 0 ? 
                    parseFloat(((totalIngressos / totalCapacidade) * 100).toFixed(2)) : 0
            },
            filtrosAplicados: {
                ordenarPor,
                limite: limite || 'Sem limite',
                apenasComVendas: apenasComVendas === 'true'
            },
            vendas: dadosProcessados
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar relatório de vendas por evento', details: error.message });
    }
});

module.exports = router;