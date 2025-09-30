<template>
  <div class="min-h-screen p-4">
    <h1 class="text-3xl font-bold mb-6">🔍 Teste Simples de Eventos</h1>
    
    <div v-if="loading">⏳ Carregando...</div>
    
    <div v-else class="grid gap-4">
      <div v-for="evento in eventos" :key="evento.id" class="border p-4 rounded">
        <h3 class="font-bold">{{ evento.titulo }}</h3>
        <p>ID: {{ evento.id }}</p>
        <p>Local: {{ evento.endereco }}</p>
        
        <!-- Debug info -->
        <p class="text-sm text-gray-600">
          Imagem: {{ evento.imagem ? 'SIM' : 'NÃO' }} 
          {{ evento.imagem && evento.imagem.startsWith('data:image') ? '(Base64)' : '' }}
        </p>
        
        <!-- Imagem -->
        <div class="mt-2">
          <img 
            v-if="evento.imagem && evento.imagem.startsWith('data:image')"
            :src="evento.imagem"
            :alt="evento.titulo"
            class="w-32 h-20 object-cover border"
            @load="console.log('✅ Imagem carregada:', evento.titulo)"
            @error="console.log('❌ Erro ao carregar:', evento.titulo)"
          />
          <div v-else class="w-32 h-20 bg-gray-300 flex items-center justify-center">
            Sem imagem
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestEventos',
  data() {
    return {
      eventos: [],
      loading: true
    }
  },
  async mounted() {
    await this.carregarEventos();
  },
  methods: {
    async carregarEventos() {
      try {
        const response = await fetch('http://localhost:3001/api/eventos');
        if (response.ok) {
          this.eventos = await response.json();
          console.log('📊 Total eventos:', this.eventos.length);
          console.log('🖼️ Com imagem:', this.eventos.filter(e => e.imagem && e.imagem.startsWith('data:image')).length);
        } else {
          console.error('❌ Erro na API:', response.status);
        }
      } catch (error) {
        console.error('❌ Erro na requisição:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>