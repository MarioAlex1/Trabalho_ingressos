const axios = require('axios');

// Criar uma string base64 muito grande para testar o limite
const criarImagemGrande = () => {
  // Repetir uma string pequena muitas vezes para criar uma imagem "grande"
  const baseString = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  
  // Repetir para criar ~2MB de dados
  let imagemGrande = '';
  for (let i = 0; i < 20000; i++) {
    imagemGrande += baseString;
  }
  
  return `data:image/png;base64,${imagemGrande}`;
};

async function testarPayloadGrande() {
  try {
    console.log('🧪 Testando payload grande...');
    
    const imagemGrande = criarImagemGrande();
    console.log(`📏 Tamanho da imagem: ${Math.round(imagemGrande.length / 1024 / 1024 * 100) / 100} MB`);
    
    const eventData = {
      titulo: 'Teste Payload Grande',
      endereco: 'Endereço de Teste',
      dataEvento: '2025-12-31T23:00:00',
      capacidade: 100,
      imagem: imagemGrande,
      descricao: 'Teste de payload grande',
      organizadorId: 2
    };
    
    console.log('🚀 Enviando para o servidor...');
    const response = await axios.post('http://localhost:3000/api/eventos', eventData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    console.log('✅ Sucesso! Evento criado com ID:', response.data.evento?.id || response.data.id);
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.status, error.response?.data || error.message);
  }
}

testarPayloadGrande();