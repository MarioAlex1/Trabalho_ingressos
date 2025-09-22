const express = require('express');
const router = express.Router();
const { Usuario, Evento, Ingresso } = require('./models/associations'); // o Sequelize model

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
        const novoEvento = await Evento.create(req.body);
        res.status(201).json(novoEvento);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar evento', details: error.message });
    }
});

// Listar todos os eventos
router.get('/eventos', async (req, res) => {
    try {
        const eventos = await Evento.findAll();
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar eventos', details: error.message });
    }
});

// Buscar evento por ID
router.get('/eventos/:id', async (req, res) => {
    try {
        const evento = await Evento.findByPk(req.params.id);
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
        const { usuarioId, eventoId } = req.body;
        
        // Verificar se o usuário existe
        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
        
        // Verificar se o evento existe
        const evento = await Evento.findByPk(eventoId);
        if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
        
        // Gerar código único para o ingresso
        const codigo = `${evento.id}-${usuario.id}-${Date.now()}`;
        
        const novoIngresso = await Ingresso.create({
            codigo,
            usuarioId,
            eventoId
        });
        
        res.status(201).json(novoIngresso);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar ingresso', details: error.message });
    }
});

// Listar todos os ingressos
router.get('/ingressos', async (req, res) => {
    try {
        const ingressos = await Ingresso.findAll({
            include: [
                { model: Usuario, attributes: ['id', 'nome', 'email'] },
                { model: Evento, attributes: ['id', 'nome', 'data', 'local'] }
            ]
        });
        res.json(ingressos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ingressos', details: error.message });
    }
});

// Buscar ingresso por ID
router.get('/ingressos/:id', async (req, res) => {
    try {
        const ingresso = await Ingresso.findByPk(req.params.id, {
            include: [
                { model: Usuario, attributes: ['id', 'nome', 'email'] },
                { model: Evento, attributes: ['id', 'nome', 'data', 'local', 'preco'] }
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
                { model: Usuario, attributes: ['id', 'nome', 'email'] },
                { model: Evento, attributes: ['id', 'nome', 'data', 'local', 'preco'] }
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
                { model: Evento, attributes: ['id', 'nome', 'data', 'local', 'preco'] }
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
                { model: Usuario, attributes: ['id', 'nome', 'email'] }
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

module.exports = router;