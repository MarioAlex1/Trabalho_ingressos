const { Evento, TipoIngresso } = require('./src/models/associations');

async function verificarEventos() {
  try {
    const eventos = await Evento.findAll({
      include: [{ model: TipoIngresso, as: 'tiposIngressos' }],
      order: [['id', 'DESC']],
      limit: 5
    });
    
    console.log('📊 Últimos 5 eventos:');
    eventos.forEach(e => {
      console.log(`- ID: ${e.id}, Título: "${e.titulo}", Ingressos: ${e.tiposIngressos?.length || 0}`);
      if (e.tiposIngressos?.length > 0) {
        e.tiposIngressos.forEach(i => console.log(`  * ${i.tipo}: R$ ${i.preco} (${i.quantidade} disponíveis)`));
      }
    });
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

verificarEventos();