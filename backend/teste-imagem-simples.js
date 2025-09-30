const { Usuario, Evento, TipoIngresso } = require('./src/models/associations');

async function criarEventoImagemSimples() {
  try {
    // Imagem bem simples - quadrado colorido 50x50px
    const imagemSimples = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAA1ElEQVQIHQEGAfn+AOf39/cA6Pf39wDo9/f3AOf39/cA5/f39wDn9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOf39/cA5/f39wDo9/f3AOf39/cA5/f39wDn9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA5/f39wDn9/f3AOj39/cA5/f39wDn9/f3AOf39/cA6Pf39wDo9/f3AOf39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDn9/f3AOf39/cA6Pf39wDn9/f3AOf39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOf39/cA5/f39wDo9/f3AOf39/cA5/f39wDn9/f3AOf39/cA5/f39wDo9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA5/f39wDn9/f3AOj39/cA5/f39wDn9/f3AOf39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA5/f39wDn9/f3AOj39/cA5/f39wDn9/f3AOf39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOf39/cA5/f39wDo9/f3AOf39/cA5/f39wDn9/f3AOf39/cA5/f39wDo9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOf39/cA5/f39wDo9/f3AOf39/cA5/f39wDn9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOf39/cA5/f39wDn9/f3AOf39/cA5/f39wDn9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA5/f39wDn9/f3AOf39/cA5/f39wDn9/f3AOf39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA6Pf39wDo9/f3AOj39/cA5/f39wDn9/f3AOj39/cA5/f39wDn9/f3AOf39/cAX0QWAAAAABJRU5ErkJggg==";
    
    const evento = await Evento.create({
      titulo: "Show Teste Imagem",
      endereco: "Local Teste", 
      dataEvento: "2025-12-29T19:00:00",
      capacidade: 200,
      descricao: "Evento para testar se as imagens aparecem",
      organizadorId: 2,
      imagem: imagemSimples
    });
    
    console.log('✅ Evento criado com ID:', evento.id);
    
    await TipoIngresso.create({
      eventoId: evento.id,
      tipo: "Entrada",
      preco: 25.00,
      quantidade: 200,
      descricao: "Ingresso padrão"
    });
    
    console.log('✅ Teste completo!');
    console.log('🌐 Acesse: http://localhost:5174/events');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

criarEventoImagemSimples();