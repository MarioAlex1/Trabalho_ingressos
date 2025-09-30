const { Usuario, Evento, TipoIngresso } = require('./src/models/associations');

async function criarEventoComImagem() {
  try {
    // Criar uma imagem base64 mais elaborada (pequena mas colorida)
    const imagemBase64 = "data:image/svg+xml;base64," + Buffer.from(`
      <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="500" height="300" fill="url(#grad1)" />
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
              font-family="Arial" font-size="36" fill="white" font-weight="bold">
          FESTIVAL 2025
        </text>
        <text x="50%" y="70%" text-anchor="middle" dominant-baseline="middle" 
              font-family="Arial" font-size="18" fill="white">
          Arena São Paulo
        </text>
      </svg>
    `).toString('base64');
    
    const evento = await Evento.create({
      titulo: "Festival de Música 2025",
      endereco: "Arena São Paulo, São Paulo - SP", 
      dataEvento: "2025-12-31T22:00:00",
      capacidade: 5000,
      descricao: "O maior festival de música do ano com artistas nacionais e internacionais. Som de última geração, food trucks gourmet e experiência inesquecível.",
      organizadorId: 2,
      imagem: imagemBase64
    });
    
    console.log('✅ Evento criado com ID:', evento.id);
    
    // Criar tipos de ingressos
    const ingressos = [
      {
        eventoId: evento.id,
        tipo: "Pista",
        preco: 150.00,
        quantidade: 3000,
        descricao: "Acesso à pista principal com vista total do palco"
      },
      {
        eventoId: evento.id,
        tipo: "Camarote",
        preco: 350.00,
        quantidade: 800,
        descricao: "Área VIP elevada com bar exclusivo e banheiros privativos"
      },
      {
        eventoId: evento.id,
        tipo: "Backstage",
        preco: 600.00,
        quantidade: 100,
        descricao: "Acesso exclusivo aos bastidores e meet & greet"
      }
    ];
    
    for (const ingresso of ingressos) {
      await TipoIngresso.create(ingresso);
      console.log(`✅ Ingresso criado: ${ingresso.tipo} - R$ ${ingresso.preco}`);
    }
    
    console.log('🎉 Evento completo criado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

criarEventoComImagem();