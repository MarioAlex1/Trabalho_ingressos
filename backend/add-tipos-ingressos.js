// Script temporário para adicionar tipos de ingressos aos eventos existentes
const { Usuario, Evento, TipoIngresso } = require('./src/models/associations');

async function addTiposIngressos() {
    try {
        // Buscar todos os eventos
        const eventos = await Evento.findAll();
        
        console.log(`Encontrados ${eventos.length} eventos`);
        
        for (const evento of eventos) {
            // Verificar se já tem tipos de ingressos
            const tiposExistentes = await TipoIngresso.findAll({ where: { eventoId: evento.id } });
            
            if (tiposExistentes.length === 0) {
                console.log(`Adicionando tipos de ingressos para evento: ${evento.titulo}`);
                
                // Criar tipos de ingressos padrão
                await TipoIngresso.create({
                    eventoId: evento.id,
                    tipo: 'Pista',
                    preco: 50.00,
                    quantidade: 100,
                    descricao: 'Ingresso Pista'
                });
                
                await TipoIngresso.create({
                    eventoId: evento.id,
                    tipo: 'VIP',
                    preco: 100.00,
                    quantidade: 50,
                    descricao: 'Ingresso VIP'
                });
                
                console.log(`✅ Tipos de ingressos criados para evento ${evento.id}`);
            } else {
                console.log(`Evento ${evento.titulo} já tem ${tiposExistentes.length} tipos de ingressos`);
            }
        }
        
        console.log('✅ Script concluído com sucesso!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erro no script:', error);
        process.exit(1);
    }
}

addTiposIngressos();