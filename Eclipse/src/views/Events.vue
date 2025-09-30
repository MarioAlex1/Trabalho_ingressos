<template>
  <div
    class="min-h-screen bg-repeat bg-center transition-all duration-300"
    :style="{ backgroundImage: `url(${currentBackground})` }"
    :class="{ dark: isDark }"
  >
    <header>
      <HeaderComponent />
    </header>
    
    <div class="container mx-auto px-4 py-20">
      <!-- Header da página -->
      <div class="text-center mb-12">
        <div class="relative inline-block">
          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <h1 class="text-4xl font-bold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
          Eventos Disponíveis
        </h1>
        <p class="text-lg" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
          Descubra os melhores eventos e garanta seu ingresso
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md transition ease-in-out duration-150">
          <svg class="animate-spin -ml-1 mr-3 h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span :class="isDark ? 'text-white' : 'text-gray-700'">Carregando eventos...</span>
        </div>
      </div>

      <!-- Lista de Eventos -->
      <div v-else-if="eventos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="evento in eventos" 
          :key="evento.id"
          class="rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
          :class="isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'"
        >
          <!-- Imagem do evento -->
          <div class="h-48 relative overflow-hidden">
            <img 
              v-if="evento.imagem && evento.imagem.startsWith('data:image')"
              :src="evento.imagem" 
              :alt="evento.titulo"
              class="w-full h-full object-cover"
            />
            <div 
              v-else
              class="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center"
            >
              <svg class="w-16 h-16 text-white opacity-70" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <!-- Conteúdo do card -->
          <div class="p-6">
            <h3 class="text-xl font-bold mb-3" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ evento.titulo }}
            </h3>
            
            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ evento.endereco }}
              </div>
              
              <div class="flex items-center text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ formatDate(evento.dataEvento) }}
              </div>
              
              <div class="flex items-center text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ evento.capacidade }} pessoas
              </div>
            </div>

            <p class="text-sm mb-4 line-clamp-3" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              {{ evento.descricao }}
            </p>

            <!-- Preços dos ingressos -->
            <div class="mb-4">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="ingresso in (evento.tiposIngressos || evento.TipoIngressos || [])" 
                  :key="ingresso.id"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'"
                >
                  {{ ingresso.tipo }}: R$ {{ parseFloat(ingresso.preco).toFixed(2) }}
                </span>
              </div>
            </div>

            <!-- Botão de ver detalhes -->
            <button
              @click="verDetalhes(evento)"
              class="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-md transition-all duration-200 transform hover:scale-105"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>

      <!-- Estado vazio -->
      <div v-else class="text-center py-12">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="text-xl font-medium mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
          Nenhum evento encontrado
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Ainda não há eventos disponíveis. Volte mais tarde!
        </p>
        <router-link 
          to="/" 
          class="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Voltar ao Início
        </router-link>
      </div>

      <!-- Mensagem de erro -->
      <div v-if="errorMessage" class="mt-6 p-4 rounded-md bg-red-100 border border-red-400 text-red-700 text-sm text-center"
           :class="isDark ? 'bg-red-900 border-red-600 text-red-300' : 'bg-red-100 border-red-400 text-red-700'">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "../components/HeaderComponent.vue";
import { darkModeState } from "@/plugins/darkModeSimple.js";

export default {
  name: 'Events',
  components: { HeaderComponent },
  data() {
    return {
      isLoading: true,
      eventos: [],
      errorMessage: ''
    };
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
    await this.loadEvents();
  },
  methods: {
    async loadEvents() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        // Carrega eventos do backend
        console.log('🌐 Carregando eventos do backend...');
        const response = await fetch('http://localhost:3001/api/eventos');
        
        if (response.ok) {
          const data = await response.json();
          // Filtra apenas eventos não cancelados (se o campo cancelado existir)
          this.eventos = data.filter(evento => !evento.cancelado);
          console.log('📊 Eventos carregados do backend:', this.eventos.length, 'eventos');
          
          // Para cada evento, carregar os tipos de ingressos
          for (let evento of this.eventos) {
            try {
              const ingressosResponse = await fetch(`http://localhost:3001/api/eventos/${evento.id}/tipos-ingressos`);
              if (ingressosResponse.ok) {
                evento.tiposIngressos = await ingressosResponse.json();
              }
            } catch (error) {
              console.warn('❌ Erro ao carregar ingressos para evento', evento.id, error);
              evento.tiposIngressos = [];
            }
          }
        } else {
          throw new Error('Erro ao carregar eventos do servidor');
        }
        
      } catch (error) {
        console.error('❌ Erro ao carregar eventos:', error);
        this.errorMessage = 'Não foi possível carregar os eventos.';
        this.eventos = [];
      } finally {
        this.isLoading = false;
      }
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    verDetalhes(evento) {
      // Navegar para página de detalhes do evento
      this.$router.push({
        name: 'EventDetails',
        params: { id: evento.id }
      });
    },
    
    goToPayment(evento) {
      // Navegar para página de pagamento com dados do evento
      this.$router.push({
        name: 'Payment',
        params: { eventoId: evento.id },
        query: { evento: JSON.stringify(evento) }
      });
    }
  }
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>