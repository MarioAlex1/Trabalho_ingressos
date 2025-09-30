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
        Voltar ao Início
      </button>

      <!-- Estado de carregamento -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md">
          <svg class="animate-spin -ml-1 mr-3 h-8 w-8" :class="isDark ? 'text-white' : 'text-gray-700'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span :class="isDark ? 'text-white' : 'text-gray-700'">Carregando seus eventos...</span>
        </div>
      </div>
      
      <!-- Usuário não logado -->
      <div v-else-if="!user.id" class="text-center py-8">
        <div 
          class="px-6 py-4 rounded-lg mb-6 shadow-lg backdrop-blur-sm"
          :class="isDark 
            ? 'bg-yellow-900/80 border border-yellow-700 text-yellow-200' 
            : 'bg-yellow-100/80 border border-yellow-400 text-yellow-800'"
        >
          <strong>Acesso Restrito</strong><br>
          Você precisa fazer login para acessar esta página.
        </div>
        <div class="space-x-4">
          <router-link 
            to="/login" 
            class="inline-block px-6 py-3 rounded-lg font-medium transition-all duration-200"
            :class="isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'"
          >
            Fazer Login
          </router-link>
          <router-link 
            to="/" 
            class="inline-block px-6 py-3 rounded-lg font-medium transition-all duration-200"
            :class="isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg'
              : 'bg-gray-500 hover:bg-gray-600 text-white shadow-lg'"
          >
            Voltar ao Início
          </router-link>
        </div>
      </div>
      
      <!-- Usuário é cliente (não organizador) -->
      <div v-else-if="!isOrganizer" class="text-center py-8">
        <div 
          class="px-6 py-4 rounded-lg mb-6 shadow-lg backdrop-blur-sm"
          :class="isDark 
            ? 'bg-red-900/80 border border-red-700 text-red-200' 
            : 'bg-red-100/80 border border-red-400 text-red-800'"
        >
          <strong>Acesso Negado</strong><br>
          Esta página é exclusiva para organizadores de eventos.<br>
          <small>Você está logado como: <strong>{{ user.tipoUsuario }}</strong></small>
        </div>
        <div class="space-x-4">
          <router-link 
            to="/meus-ingressos" 
            class="inline-block px-6 py-3 rounded-lg font-medium transition-all duration-200"
            :class="isDark
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
              : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'"
          >
            Ver Meus Ingressos
          </router-link>
          <router-link 
            to="/events" 
            class="inline-block px-6 py-3 rounded-lg font-medium transition-all duration-200"
            :class="isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'"
          >
            Explorar Eventos
          </router-link>
        </div>
      </div>
      
      <!-- Lista de eventos do organizador -->
      <div v-else class="max-w-6xl mx-auto">
        <div 
          class="px-6 py-4 rounded-lg mb-6 shadow-lg backdrop-blur-sm"
          :class="isDark 
            ? 'bg-green-900/80 border border-green-700 text-green-200' 
            : 'bg-green-100/80 border border-green-400 text-green-800'"
        >
          <strong>Área do Organizador</strong><br>
          Bem-vindo, <strong>{{ user.nome }}</strong>! Gerencie seus eventos aqui.
        </div>
        
        <div class="flex justify-between items-center mb-8">
          <h1 
            class="text-4xl font-bold"
            :class="isDark ? 'text-white' : 'text-gray-800'"
          >
            Meus Eventos
          </h1>
          
          <router-link 
            to="/create-event"
            class="px-6 py-3 rounded-lg font-medium transition-all duration-200"
            :class="isDark
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
              : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg'"
          >
            Criar Novo Evento
          </router-link>
        </div>

        <!-- Lista de Eventos -->
        <div v-if="meusEventos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="evento in meusEventos" 
            :key="evento.id"
            class="rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
            :class="isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'"
          >
            <!-- Imagem do evento -->
            <div class="h-48 relative overflow-hidden">
              <img 
                v-if="evento.imagem"
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

                <!-- Estatísticas de Vendas -->
                <div class="mt-4 p-3 rounded-lg" :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
                  <div class="flex items-center justify-between mb-2">
                    <span 
                      class="px-3 py-1 rounded-full text-xs font-medium"
                      :class="evento.status === 'ativo' 
                        ? (isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                        : (isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')"
                    >
                      {{ evento.status === 'ativo' ? 'Ativo' : 'Inativo' }}
                    </span>
                    
                    <span class="text-sm font-medium" :class="isDark ? 'text-purple-400' : 'text-purple-600'">
                      {{ (evento.vendas?.totalIngressos || 0) }}/{{ totalIngressos(evento) }} vendidos
                    </span>
                  </div>
                  
                  <!-- Receita Total -->
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                      💰 Receita Total:
                    </span>
                    <span class="font-bold text-green-500">
                      {{ formatPrice(evento.vendas?.totalReceita || 0) }}
                    </span>
                  </div>
                  
                  <!-- Tipos de Ingressos Vendidos -->
                  <div v-if="evento.vendas?.tiposVendidos && Object.keys(evento.vendas.tiposVendidos).length > 0" class="mt-2">
                    <div class="text-xs mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                      🎫 Ingressos Vendidos por Tipo:
                    </div>
                    <div class="space-y-1">
                      <div 
                        v-for="(quantidade, tipo) in evento.vendas.tiposVendidos" 
                        :key="tipo"
                        class="flex justify-between text-xs"
                        :class="isDark ? 'text-gray-300' : 'text-gray-600'"
                      >
                        <span>• {{ tipo }}:</span>
                        <span class="font-medium">{{ quantidade }} un.</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Indicador quando não há vendas -->
                  <div v-else class="text-xs text-center py-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                    Ainda não há vendas para este evento
                  </div>
                </div>
              </div>

              <!-- Ações -->
              <div class="px-6 pb-6 flex gap-2">
                <button 
                  @click="verDetalhes(evento)"
                  class="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  :class="isDark
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'"
                >
                  Ver Detalhes
                </button>
                
                <button 
                  @click="editarEvento(evento)"
                  class="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  :class="isDark
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-gray-500 hover:bg-gray-600 text-white'"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vazio -->
        <div v-else class="text-center py-12">
          <div 
            class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
          >
            <svg class="w-12 h-12" :class="isDark ? 'text-gray-400' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
            Nenhum evento criado
          </h3>
          <p class="mb-6" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Você ainda não criou nenhum evento. Que tal começar agora?
          </p>
          <router-link 
            to="/create-event"
            class="inline-block px-6 py-3 rounded-lg font-medium transition-all duration-200"
            :class="isDark
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
              : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg'"
          >
            Criar Meu Primeiro Evento
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue'
import { darkModeState } from '@/plugins/darkModeSimple'

export default {
  name: 'MeusEventos',
  components: {
    HeaderComponent
  },
  data() {
    return {
      loading: true,
      user: {},
      isOrganizer: false,
      meusEventos: []
    }
  },
  computed: {
    isDark() {
      return darkModeState.isDark
    },
    currentBackground() {
      return darkModeState.currentBackground
    }
  },
  async mounted() {
    await this.initializeComponent()
  },
  methods: {
    async initializeComponent() {
      this.loading = true
      
      try {
        const userData = localStorage.getItem('user')
        
        if (!userData) {
          this.user = {}
          this.isOrganizer = false
        } else {
          this.user = JSON.parse(userData)
          this.isOrganizer = this.user.tipoUsuario === 'organizador'
          
          if (this.isOrganizer) {
            await this.loadMeusEventos()
          }
        }
        
      } catch (error) {
        console.error('Erro ao inicializar componente:', error)
        this.user = {}
        this.isOrganizer = false
      } finally {
        this.loading = false
      }
    },

    async loadMeusEventos() {
      try {
        console.log('🌐 Carregando eventos do organizador do backend...');
        const response = await fetch(`http://localhost:3001/api/eventos?organizadorId=${this.user.id}`);
        
        if (response.ok) {
          const eventos = await response.json();
          this.meusEventos = eventos;
          console.log('📊 Eventos do organizador carregados:', this.meusEventos.length);
          
          // Carregar tipos de ingressos e dados de vendas para cada evento
          for (let evento of this.meusEventos) {
            try {
              // Carregar tipos de ingressos
              const ingressosResponse = await fetch(`http://localhost:3001/api/eventos/${evento.id}/tipos-ingressos`);
              if (ingressosResponse.ok) {
                evento.tiposIngressos = await ingressosResponse.json();
              } else {
                evento.tiposIngressos = [];
              }
            } catch (error) {
              console.warn('❌ Erro ao carregar ingressos para evento', evento.id);
              evento.tiposIngressos = [];
            }
          }
          
          // Carregar dados de vendas do organizador
          await this.loadVendasOrganizador();
          
        } else {
          throw new Error('Erro ao carregar eventos do servidor');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar eventos do organizador:', error);
        this.meusEventos = [];
      }
    },
    
    async loadVendasOrganizador() {
      try {
        console.log('💰 Carregando dados de vendas do organizador...');
        const vendasResponse = await fetch(`http://localhost:3001/api/organizadores/${this.user.id}/vendas`);
        
        if (vendasResponse.ok) {
          const dadosVendas = await vendasResponse.json();
          console.log('✅ Dados de vendas carregados:', dadosVendas);
          
          if (dadosVendas.success && dadosVendas.vendasPorEvento) {
            // Adicionar dados de vendas para cada evento
            this.meusEventos.forEach(evento => {
              const vendasEvento = dadosVendas.vendasPorEvento[evento.id];
              
              if (vendasEvento) {
                evento.vendas = {
                  totalIngressos: vendasEvento.resumo.totalIngressos,
                  totalReceita: vendasEvento.resumo.totalReceita,
                  tiposVendidos: vendasEvento.resumo.tiposVendidos,
                  vendasDetalhadas: vendasEvento.vendas
                };
              } else {
                evento.vendas = {
                  totalIngressos: 0,
                  totalReceita: 0,
                  tiposVendidos: {},
                  vendasDetalhadas: []
                };
              }
            });
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados de vendas:', error);
        // Inicializar vendas vazias em caso de erro
        this.meusEventos.forEach(evento => {
          evento.vendas = {
            totalIngressos: 0,
            totalReceita: 0,
            tiposVendidos: {},
            vendasDetalhadas: []
          };
        });
      }
    },
    
    goBack() {
      this.$router.push('/')
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    ingressosVendidos(evento) {
      return evento.vendas?.totalIngressos || 0;
    },
    
    totalIngressos(evento) {
      if (!evento.tiposIngressos) return 0
      return evento.tiposIngressos.reduce((total, tipo) => total + tipo.quantidade, 0)
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price || 0);
    },
    
    verDetalhes(evento) {
      this.$router.push({
        name: 'EventDetails',
        params: { id: evento.id }
      })
    },
    
    editarEvento(evento) {
      // Por enquanto redireciona para detalhes, implementar edição depois
      this.verDetalhes(evento)
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>