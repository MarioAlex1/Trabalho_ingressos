const { Usuario, Evento, TipoIngresso } = require('./src/models/associations');

async function criarEventoComImagemPNG() {
  try {
    // Imagem PNG simples base64 (1x1 pixel vermelho)
    const imagemPNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
    
    const evento = await Evento.create({
      titulo: "Teste com PNG",
      endereco: "Local de Teste", 
      dataEvento: "2025-12-30T20:00:00",
      capacidade: 100,
      descricao: "Evento para testar imagem PNG",
      organizadorId: 2,
      imagem: imagemPNG
    });
    
    console.log('✅ Evento PNG criado com ID:', evento.id);
    
    await TipoIngresso.create({
      eventoId: evento.id,
      tipo: "Teste",
      preco: 50.00,
      quantidade: 50,
      descricao: "Ingresso de teste"
    });
    
    console.log('✅ Ingresso criado!');
    
    // Testar se a imagem está sendo retornada corretamente
    const eventoTeste = await Evento.findByPk(evento.id);
    console.log('🔍 Imagem salva:', eventoTeste.imagem.substring(0, 50) + '...');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

criarEventoComImagemPNG();