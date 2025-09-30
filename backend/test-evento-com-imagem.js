const { Usuario, Evento, TipoIngresso } = require('./src/models/associations');

async function criarEventoTeste() {
  try {
    // Criar evento com imagem base64 (pequena imagem de teste)
    const imagemBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    
    const evento = await Evento.create({
      titulo: "Festival com Imagem Real",
      endereco: "Arena Test, São Paulo - SP", 
      dataEvento: "2025-12-25T20:00:00",
      capacidade: 1000,
      descricao: "Evento criado programaticamente com imagem real",
      organizadorId: 2, // Lauro
      imagem: imagemBase64
    });
    
    console.log('✅ Evento criado com imagem:', evento.id);
    
    // Criar tipos de ingressos
    await TipoIngresso.create({
      eventoId: evento.id,
      tipo: "Pista",
      preco: 100.00,
      quantidade: 500,
      descricao: "Acesso à pista principal"
    });
    
    await TipoIngresso.create({
      eventoId: evento.id,
      tipo: "VIP",
      preco: 200.00,
      quantidade: 100,
      descricao: "Área VIP com bar exclusivo"
    });
    
    console.log('✅ Ingressos criados!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

criarEventoTeste();