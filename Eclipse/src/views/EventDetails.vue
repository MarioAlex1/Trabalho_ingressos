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
      <!-- Botão Voltar -->
      <button 
        @click="goBack"
        class="mb-6 inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-200"
        :class="isDark 
          ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700' 
          : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Voltar aos Eventos
      </button>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md">
          <svg class="animate-spin -ml-1 mr-3 h-8 w-8" :class="isDark ? 'text-white' : 'text-gray-700'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span :class="isDark ? 'text-white' : 'text-gray-700'">Carregando detalhes...</span>
        </div>
      </div>

      <!-- Detalhes do Evento -->
      <div v-else-if="evento" class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Coluna Esquerda - Imagem e Informações -->
          <div>
            <!-- Imagem do Evento -->
            <div class="rounded-lg overflow-hidden shadow-lg mb-6">
              <div 
                v-if="evento.imagem"
                class="h-80 bg-cover bg-center"
                :style="{ backgroundImage: `url(${evento.imagem})` }"
              ></div>
              <div 
                v-else
                class="h-80 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center"
              >
                <svg class="w-24 h-24 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>

            <!-- Informações do Evento -->
            <div 
              class="rounded-lg shadow-lg p-6"
              :class="isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'"
            >
              <h1 class="text-3xl font-bold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ evento.titulo }}
              </h1>

              <div class="space-y-4">
                <!-- Data e Hora -->
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-3" :class="isDark ? 'text-purple-400' : 'text-purple-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                    {{ formatDate(evento.dataEvento) }}
                  </span>
                </div>

                <!-- Endereço -->
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-3" :class="isDark ? 'text-purple-400' : 'text-purple-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                    {{ evento.endereco }}
                  </span>
                </div>

                <!-- Capacidade -->
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-3" :class="isDark ? 'text-purple-400' : 'text-purple-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <span :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                    Capacidade: {{ evento.capacidade }} pessoas
                  </span>
                </div>
              </div>

              <!-- Descrição -->
              <div class="mt-6">
                <h3 class="text-xl font-semibold mb-3" :class="isDark ? 'text-white' : 'text-gray-900'">
                  Descrição
                </h3>
                <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="leading-relaxed">
                  {{ evento.descricao || 'Descrição não disponível.' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Coluna Direita - Tipos de Ingressos -->
          <div>
            <div 
              class="rounded-lg shadow-lg p-6 sticky top-24"
              :class="isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'"
            >
              <h2 class="text-2xl font-bold mb-6" :class="isDark ? 'text-white' : 'text-gray-900'">
                Ingressos Disponíveis
              </h2>

              <div v-if="evento.tiposIngressos && evento.tiposIngressos.length > 0" class="space-y-4">
                <div 
                  v-for="ingresso in evento.tiposIngressos" 
                  :key="ingresso.id"
                  class="rounded-lg p-4 border transition-all duration-200 hover:shadow-md"
                  :class="isDark 
                    ? 'bg-gray-700 border-gray-600 hover:border-purple-500' 
                    : 'bg-gray-50 border-gray-200 hover:border-purple-400'"
                >
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                        {{ ingresso.tipo }}
                      </h3>
                      <p v-if="ingresso.descricao" :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mt-1">
                        {{ ingresso.descricao }}
                      </p>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-bold" :class="isDark ? 'text-purple-400' : 'text-purple-600'">
                        R$ {{ formatPrice(ingresso.preco) }}
                      </div>
                      <div :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-sm">
                        {{ ingresso.quantidade }} disponíveis
                      </div>
                    </div>
                  </div>

                  <!-- Verificação de usuário logado e tipo -->
                  <div v-if="!user.id" class="w-full">
                    <div 
                      class="w-full py-3 px-4 rounded-lg text-center mb-2"
                      :class="isDark ? 'bg-yellow-900/80 border border-yellow-700 text-yellow-200' : 'bg-yellow-100/80 border border-yellow-400 text-yellow-800'"
                    >
                      <small>Faça login para comprar ingressos</small>
                    </div>
                    <router-link 
                      to="/login"
                      class="w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 block text-center"
                      :class="isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'"
                    >
                      Fazer Login
                    </router-link>
                  </div>

                  <div v-else-if="user.tipoUsuario !== 'cliente'" class="w-full">
                    <div 
                      class="w-full py-3 px-4 rounded-lg text-center"
                      :class="isDark ? 'bg-red-900/80 border border-red-700 text-red-200' : 'bg-red-100/80 border border-red-400 text-red-800'"
                    >
                      <small>Apenas clientes podem comprar ingressos</small><br>
                      <small class="font-medium">Você está logado como: {{ user.tipoUsuario }}</small>
                    </div>
                  </div>

                  <button 
                    v-else
                    @click="comprarIngresso(ingresso)"
                    :disabled="ingresso.quantidade === 0"
                    class="w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                    :class="ingresso.quantidade > 0 
                      ? (isDark 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-purple-600 text-white hover:bg-purple-700')
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'"
                  >
                    {{ ingresso.quantidade > 0 ? 'Comprar Ingresso' : 'Esgotado' }}
                  </button>
                </div>
              </div>

              <div v-else class="text-center py-8">
                <svg class="w-16 h-16 mx-auto mb-4 opacity-50" :class="isDark ? 'text-gray-400' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                </svg>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  Nenhum ingresso disponível no momento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado de Erro -->
      <div v-else-if="errorMessage" class="text-center py-12">
        <div class="inline-flex items-center px-6 py-3 rounded-lg" :class="isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import { darkModeState } from '@/plugins/darkModeSimple';

export default {
  name: 'EventDetails',
  components: { HeaderComponent },
  data() {
    return {
      isLoading: true,
      evento: null,
      errorMessage: '',
      user: {}
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
    this.loadUser();
    await this.loadEventDetails();
  },
  methods: {
    loadUser() {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          this.user = JSON.parse(userData);
        } else {
          this.user = {};
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        this.user = {};
      }
    },

    async loadEventDetails() {
      this.isLoading = true;
      this.errorMessage = '';
      
      const eventoId = parseInt(this.$route.params.id);
      
      try {
        console.log('🌐 Carregando evento do backend, ID:', eventoId);
        
        // Carregar evento do backend
        const response = await fetch(`http://localhost:3001/api/eventos/${eventoId}`);
        
        if (response.ok) {
          const evento = await response.json();
          console.log('📊 Evento encontrado:', evento);
          
          // Buscar tipos de ingressos
          const ingressosResponse = await fetch(`http://localhost:3001/api/eventos/${eventoId}/tipos-ingressos`);
          if (ingressosResponse.ok) {
            evento.tiposIngressos = await ingressosResponse.json();
            console.log('🎫 Tipos de ingressos:', evento.tiposIngressos);
          } else {
            console.warn('⚠️ Não foi possível carregar tipos de ingressos');
            evento.tiposIngressos = [];
          }
          
          this.evento = evento;
          return;
        } else {
          throw new Error(`Evento com ID ${eventoId} não encontrado`);
        }
        
        // Fallback final: buscar dos dados fictícios
        const eventosFicticios = [
          {
            id: 1,
            titulo: 'Festival de Música Eletrônica',
            endereco: 'Praça Central, São Paulo - SP',
            dataEvento: '2025-12-31T23:00:00',
            capacidade: 5000,
            descricao: 'O maior festival de música eletrônica do ano com os melhores DJs internacionais. Uma experiência única com tecnologia de ponta em som e iluminação, food trucks gourmet e área VIP exclusiva.',
            imagem: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
            tiposIngressos: [
              { id: 1, tipo: 'Pista', preco: 120.00, quantidade: 3000, descricao: 'Acesso à pista principal com vista total do palco' },
              { id: 2, tipo: 'Camarote', preco: 280.00, quantidade: 500, descricao: 'Área VIP elevada com bar exclusivo e banheiros privativos' }
            ]
          },
          {
            id: 2,
            titulo: 'Conferência de Tecnologia 2025',
            endereco: 'Centro de Convenções, Rio de Janeiro - RJ',
            dataEvento: '2025-11-15T09:00:00',
            capacidade: 1200,
            descricao: 'Palestras com os maiores especialistas em IA, desenvolvimento web e inovação. Networking, workshops práticos e exposição de startups. Coffee break incluso.',
            imagem: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
            tiposIngressos: [
              { id: 3, tipo: 'Individual', preco: 180.00, quantidade: 800, descricao: 'Acesso completo a todas as palestras e workshops' },
              { id: 4, tipo: 'Estudante', preco: 90.00, quantidade: 400, descricao: 'Desconto especial para estudantes (mediante comprovação)' }
            ]
          },
          {
            id: 3,
            titulo: 'Show Acústico - Artista Nacional',
            endereco: 'Teatro Municipal, Belo Horizonte - MG',
            dataEvento: '2025-10-20T20:00:00',
            capacidade: 800,
            descricao: 'Uma noite única com grandes sucessos em versão acústica. Ambiente intimista no histórico Teatro Municipal com acústica perfeita.',
            imagem: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
            tiposIngressos: [
              { id: 5, tipo: 'Plateia', preco: 80.00, quantidade: 600, descricao: 'Assentos na plateia com excelente visibilidade' },
              { id: 6, tipo: 'Balcão', preco: 60.00, quantidade: 200, descricao: 'Vista panorâmica do palco no segundo andar' }
            ]
          }
        ];
        
        this.evento = eventosFicticios.find(e => e.id == eventoId);
        
        if (!this.evento) {
          this.errorMessage = 'Evento não encontrado.';
        }
        
      } catch (error) {
        console.error('❌ Erro ao carregar detalhes do evento:', error);
        this.errorMessage = 'Erro ao carregar os detalhes do evento.';
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
    
    formatPrice(price) {
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price);
    },
    
    comprarIngresso(ingresso) {
      // Navegar para página de pagamento
      this.$router.push({
        name: 'Payment',
        params: { eventoId: this.evento.id },
        query: { 
          ingressoId: ingresso.id,
          tipo: ingresso.tipo,
          preco: ingresso.preco
        }
      });
    },
    
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

@media (max-width: 768px) {
  .grid-cols-1.lg\\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .sticky {
    position: relative;
    top: auto;
  }
}
</style>