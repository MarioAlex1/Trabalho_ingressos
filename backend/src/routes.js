//Endpoints da API (URLs que o frontend acessa)
const express = require('express')
const router = express.router()
const usuarios = require('./models/usuario')

router.post('/usuarios', async (req, res) => {
    try{
        const novoUsuario = await usuario.create(req.body)
    res.json(novoUsuario)
    } catch (error){
        res.status(500).json({error: 'Erro ao criar usuário', details: error.message})
    }
})

router.get('/usuarios', async (req, res) => {
    const usuarios = await usuario.findAll()
    res.json(usuarios)    
})

router.get('/usuarios/:id', async (req, res) => {
    try {
    const usuario = await usuario.findByPk(req.params.id)
    res.json(usuario);
    } catch (error){
        res.status(500).json({error: 'Erro ao buscar usuario', details:error.message})
    }
})

router.put('/usuarios/:id', async (req, res) => {
    try {
        const usuario = await usuario.findByPk(req.params.id)
        if (usuario){
            await usuario.update(req.body)
        }else{
            res.status(404).json({ error: 'Usuario não encontrado', details: error.message})
        }
    }catch(error){
        res.status(500).json({ error: 'Erro ao atualizar o usuario', details: error.message})
    }
})

router.delete('/usuarios/:id', async (req, res) => {
    try{
    const usuarioEncontrado = await usuario.findByPk(req.params.id)
    if (usuarioEncontrado){
        await usuarioEncontrado.destroy()
        req.json({message: 'Usuario deletado'})
    }else{
        res.status(404).json({error: 'Usuário não encontrado'})
    }
}catch(error){
    res.status(500).json({Error:'Erro ao deletar o usuario', details: error.message})
}
})

module.exports = router