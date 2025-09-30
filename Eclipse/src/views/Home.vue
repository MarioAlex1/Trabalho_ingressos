<template>
  <div
    class="min-h-screen bg-repeat bg-center transition-all duration-300"
    :style="{ backgroundImage: `url(${currentBackground})` }"
    :class="{ 'dark': isDark }"
  >
    <header>
      <HeaderComponent />
    </header>

    <!-- Hero Section -->
    <section class="relative py-20 px-4">
      <div class="container mx-auto max-w-6xl">
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-6xl font-bold mb-6" :class="isDark ? 'text-white' : 'text-gray-900'">
            Ingressos em 
            <span class="text-yellow-500">Boa Viagem</span>
          </h1>
          <p class="text-xl md:text-2xl mb-8" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            Sua plataforma oficial para eventos na cidade de Boa Viagem - CE
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              @click="buscarEventos"
              class="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              Buscar Eventos
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 px-4">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center mb-12" :class="isDark ? 'text-white' : 'text-gray-900'">
          Por que escolher o Eclipse?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-6 rounded-lg" :class="isDark ? 'bg-gray-800/50' : 'bg-white/70'">
            <div class="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">Rápido e Fácil</h3>
            <p :class="isDark ? 'text-gray-300' : 'text-gray-600'">
              Compre seus ingressos em poucos cliques e receba instantaneamente no seu celular.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center p-6 rounded-lg" :class="isDark ? 'bg-gray-800/50' : 'bg-white/70'">
            <div class="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">Seguro</h3>
            <p :class="isDark ? 'text-gray-300' : 'text-gray-600'">
              Pagamento seguro e ingressos verificados. Sua experiência protegida do início ao fim.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center p-6 rounded-lg" :class="isDark ? 'bg-gray-800/50' : 'bg-white/70'">
            <div class="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">Local</h3>
            <p :class="isDark ? 'text-gray-300' : 'text-gray-600'">
              Focado em Boa Viagem - CE. Todos os eventos da sua cidade em um só lugar.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Eventos em Destaque -->
    <section v-if="eventosDestaque.length > 0" class="py-16 px-4">
      <div class="container mx-auto max-w-6xl">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            Eventos em Destaque
          </h2>
          <button 
            @click="verTodosEventos"
            class="text-yellow-500 hover:text-yellow-600 font-semibold"
          >
            Ver todos →
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="evento in eventosDestaque" 
            :key="evento.id"
            @click="verEvento(evento)"
            class="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            :class="isDark ? 'bg-gray-800' : 'bg-white'"
          >
            <div class="h-48 relative overflow-hidden">
              <img 
                :src="evento.imagem || placeholderImage"
                :alt="evento.titulo"
                class="w-full h-full object-cover"
                @error="onImageError"
              />
              <div class="absolute top-4 right-4">
                <span class="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                  A partir de R$ {{ formatarPreco(evento.precoMinimo || evento.preco) }}
                </span>
              </div>
            </div>
            
            <div class="p-4">
              <h3 class="text-lg font-bold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ evento.titulo }}
              </h3>
              <p class="text-sm mb-3" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ evento.descricao }}
              </p>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ evento.local || 'Boa Viagem - CE' }}
                </div>
                
                <div class="flex items-center text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z"/>
                  </svg>
                  {{ formatarData(evento.data) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-4">
      <div class="container mx-auto max-w-4xl text-center">
        <div class="p-8 rounded-lg" :class="isDark ? 'bg-gray-800/50' : 'bg-white/70'">
          <h2 class="text-3xl font-bold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
            Organize seu evento em Boa Viagem
          </h2>
          <p class="text-lg mb-6" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            Divulgue e venda ingressos para seu evento de forma simples e profissional.
          </p>
          <button 
            @click="criarEvento"
            class="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
          >
            Criar Meu Evento
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import { darkModeState } from '@/plugins/darkModeSimple';
import { eventService } from '@/services/api.js';

export default {
  name: 'Home',
  components: { HeaderComponent },
  
  data() {
    return {
      eventosDestaque: [],
      isLoading: false,
      placeholderImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5FdmVudG88L3RleHQ+PC9zdmc+'
    }
  },
  
  computed: {
    isDark() {
      return darkModeState.isDark;
    },
    currentBackground() {
      return darkModeState.currentBackground;
    }
  },
  
  async mounted() {
    await this.carregarEventosDestaque();
  },
  
  methods: {
    async carregarEventosDestaque() {
      this.isLoading = true;
      try {
        const response = await eventService.getAll();
        if (response.success && response.data) {
          // Pega os 3 eventos mais recentes e calcula o preço mínimo
          this.eventosDestaque = response.data
            .sort((a, b) => new Date(b.data || b.dataEvento) - new Date(a.data || a.dataEvento))
            .slice(0, 3)
            .map(evento => {
              // Calcula o preço mínimo dos tipos de ingresso
              let precoMinimo = evento.preco || 0;
              if (evento.tiposIngressos && evento.tiposIngressos.length > 0) {
                const precos = evento.tiposIngressos.map(tipo => parseFloat(tipo.preco) || 0);
                precoMinimo = Math.min(...precos);
              }
              
              return {
                ...evento,
                precoMinimo: precoMinimo
              };
            });
        }
      } catch (error) {
        console.warn('Erro ao carregar eventos:', error);
        // Fallback para eventos de exemplo
        this.eventosDestaque = [
          {
            id: 1,
            titulo: "Festival de Verão Boa Viagem",
            descricao: "O maior festival de música da temporada com artistas locais e nacionais",
            local: "Praça Central",
            data: "2024-12-15",
            precoMinimo: 50,
            imagem: null
          }
        ];
      } finally {
        this.isLoading = false;
      }
    },
    
    buscarEventos() {
      this.$router.push('/events');
    },
    
    verTodosEventos() {
      this.$router.push('/events');
    },
    
    verEvento(evento) {
      console.log('Visualizar evento:', evento);
      // TODO: Implementar navegação para página do evento
    },
    
    formatarData(data) {
      if (!data) return '';
      try {
        const date = new Date(data);
        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short'
        });
      } catch (error) {
        return data;
      }
    },
    
    formatarPreco(preco) {
      if (!preco) return '0,00';
      try {
        return parseFloat(preco).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      } catch (error) {
        return preco;
      }
    },
    
    onImageError(event) {
      event.target.src = this.placeholderImage;
    }
  }
};
</script>

<style scoped>
/* Adiciona alguns estilos personalizados se necessário */
.container {
  margin-left: auto;
  margin-right: auto;
}
</style>
