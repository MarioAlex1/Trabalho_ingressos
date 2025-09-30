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
          <span :class="isDark ? 'text-white' : 'text-gray-700'">Carregando seus ingressos...</span>
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
      
      <!-- Usuário é organizador (não cliente) -->
      <div v-else-if="!isCliente" class="text-center py-8">
        <div 
          class="px-6 py-4 rounded-lg mb-6 shadow-lg backdrop-blur-sm"
          :class="isDark 
            ? 'bg-red-900/80 border border-red-700 text-red-200' 
            : 'bg-red-100/80 border border-red-400 text-red-800'"
        >
          <strong>Acesso Negado</strong><br>
          Esta página é exclusiva para clientes que compram ingressos.<br>
          <small>Você está logado como: <strong>{{ user.tipoUsuario }}</strong></small>
        </div>
        <div class="space-x-4">
          <router-link 
            to="/meus-eventos" 
            class="inline-block px-6 py-3 rounded-lg font-medium transition-all duration-200"
            :class="isDark
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
              : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg'"
          >
            Ver Meus Eventos
          </router-link>
          <router-link 
            to="/create-event" 
            class="inline-block px-6 py-3 rounded-lg font-medium transition-all duration-200"
            :class="isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'"
          >
            Criar Evento
          </router-link>
        </div>
      </div>
      
      <!-- Lista de ingressos do cliente -->
      <div v-else class="max-w-6xl mx-auto">
        <div 
          class="px-6 py-4 rounded-lg mb-6 shadow-lg backdrop-blur-sm"
          :class="isDark 
            ? 'bg-blue-900/80 border border-blue-700 text-blue-200' 
            : 'bg-blue-100/80 border border-blue-400 text-blue-800'"
        >
          <strong>Área do Cliente</strong><br>
          Bem-vindo, <strong>{{ user.nome }}</strong>! Aqui estão seus ingressos.
        </div>
        
        <div class="flex justify-between items-center mb-8">
          <h1 
            class="text-4xl font-bold"
            :class="isDark ? 'text-white' : 'text-gray-800'"
          >
            Meus Ingressos
          </h1>
          
          <router-link 
            to="/events"
            class="px-6 py-3 rounded-lg font-medium transition-all duration-200"
            :class="isDark
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
              : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'"
          >
            Explorar Eventos
          </router-link>
        </div>

        <!-- Lista de Ingressos -->
        <div v-if="meusIngressos.length > 0" class="space-y-4">
          <div 
            v-for="ingresso in meusIngressos" 
            :key="ingresso.id"
            class="rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
            :class="isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'"
          >
            <div class="flex flex-col md:flex-row">
              <!-- Imagem do evento -->
              <div class="md:w-48 h-48 relative overflow-hidden">
                <img 
                  v-if="ingresso.evento.imagem"
                  :src="ingresso.evento.imagem" 
                  :alt="ingresso.evento.titulo"
                  class="w-full h-full object-cover"
                />
                <div 
                  v-else
                  class="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center"
                >
                  <svg class="w-16 h-16 text-white opacity-70" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                
                <!-- Badge de status -->
                <div class="absolute top-3 left-3">
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="getStatusBadgeClass(ingresso)"
                  >
                    {{ getStatusText(ingresso) }}
                  </span>
                </div>
              </div>

              <!-- Conteúdo do ingresso -->
              <div class="flex-1 p-6">
                <div class="flex flex-col md:flex-row md:justify-between">
                  <!-- Informações do evento -->
                  <div class="flex-1">
                    <h3 class="text-xl font-bold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
                      {{ ingresso.evento.titulo }}
                    </h3>
                    
                    <div class="space-y-2 mb-4">
                      <div class="flex items-center text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ formatDate(ingresso.evento.dataEvento) }}
                      </div>
                      
                      <div class="flex items-center text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ ingresso.evento.endereco }}
                      </div>
                      
                      <div class="flex items-center text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Tipo: {{ ingresso.tipoIngresso }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- Informações do ingresso -->
                  <div class="md:ml-6 md:w-64 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6" :class="isDark ? 'border-gray-600' : 'border-gray-200'">
                    <div class="space-y-3">
                      <div>
                        <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                          Número do Ingresso
                        </label>
                        <span class="font-mono text-lg font-bold" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
                          #{{ ingresso.numeroIngresso }}
                        </span>
                      </div>
                      
                      <div>
                        <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                          Data da Compra
                        </label>
                        <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                          {{ formatDate(ingresso.dataCompra) }}
                        </span>
                      </div>
                      
                      <div>
                        <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                          Valor Pago
                        </label>
                        <span class="text-lg font-bold" :class="isDark ? 'text-green-400' : 'text-green-600'">
                          {{ formatPrice(ingresso.valorPago) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Ações -->
                <div class="flex gap-2 mt-6">
                  <button 
                    @click="verEventoCompleto(ingresso.evento)"
                    class="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                    :class="isDark
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'"
                  >
                    Ver Evento
                  </button>
                  
                  <button 
                    v-if="canShowQRCode(ingresso)"
                    @click="mostrarQRCode(ingresso)"
                    class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                    :class="isDark
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'"
                  >
                    QR Code
                  </button>
                  
                  <button 
                    @click="baixarIngresso(ingresso)"
                    class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                    :class="isDark
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-gray-500 hover:bg-gray-600 text-white'"
                  >
                    Baixar PDF
                  </button>
                </div>
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
              <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
            Nenhum ingresso encontrado
          </h3>
          <p class="mb-6" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Você ainda não comprou nenhum ingresso. Explore os eventos disponíveis!
          </p>
          <router-link 
            to="/events"
            class="inline-block px-6 py-3 rounded-lg font-medium transition-all duration-200"
            :class="isDark
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
              : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'"
          >
            Explorar Eventos
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
  name: 'MeusIngressos',
  components: {
    HeaderComponent
  },
  data() {
    return {
      loading: true,
      user: {},
      isCliente: false,
      meusIngressos: []
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
          this.isCliente = false
        } else {
          this.user = JSON.parse(userData)
          this.isCliente = this.user.tipoUsuario === 'cliente'
          
          if (this.isCliente) {
            await this.loadMeusIngressos()
          }
        }
        
      } catch (error) {
        console.error('Erro ao inicializar componente:', error)
        this.user = {}
        this.isCliente = false
      } finally {
        this.loading = false
      }
    },

    async loadMeusIngressos() {
      try {
        console.log('� Carregando ingressos do cliente...', this.user.id);
        const response = await fetch(`http://localhost:3001/api/usuarios/${this.user.id}/ingressos`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Ingressos carregados:', data);
          
          if (data.success) {
            this.meusIngressos = data.ingressos.map(ingresso => ({
              id: ingresso.id,
              codigo: ingresso.codigo,
              numeroIngresso: ingresso.codigo, // Usar código como número do ingresso
              evento: {
                id: ingresso.evento.id,
                titulo: ingresso.evento.titulo,
                descricao: ingresso.evento.descricao,
                dataEvento: ingresso.evento.data,
                endereco: ingresso.evento.local,
                imagem: ingresso.evento.imagem
              },
              tipoIngresso: ingresso.tipoIngresso.tipo,
              valorPago: ingresso.valorTotal,
              dataCompra: ingresso.dataCompra,
              quantidade: ingresso.quantidade,
              status: ingresso.status || 'Confirmado'
            }));
          } else {
            console.log('❌ Erro na resposta:', data);
            this.meusIngressos = [];
          }
        } else {
          console.error('❌ Erro ao carregar ingressos:', response.status);
          this.meusIngressos = [];
        }
      } catch (error) {
        console.error('❌ Erro ao carregar ingressos:', error);
        this.meusIngressos = [];
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
    
    formatPrice(price) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price)
    },
    
    getStatusBadgeClass(ingresso) {
      const eventDate = new Date(ingresso.evento.dataEvento)
      const now = new Date()
      
      if (eventDate > now) {
        return this.isDark 
          ? 'bg-green-900 text-green-200' 
          : 'bg-green-100 text-green-800'
      } else {
        return this.isDark 
          ? 'bg-gray-900 text-gray-300' 
          : 'bg-gray-100 text-gray-600'
      }
    },
    
    getStatusText(ingresso) {
      const eventDate = new Date(ingresso.evento.dataEvento)
      const now = new Date()
      
      return eventDate > now ? 'Válido' : 'Utilizado'
    },
    
    canShowQRCode(ingresso) {
      const eventDate = new Date(ingresso.evento.dataEvento)
      const now = new Date()
      
      // Mostrar QR Code apenas se o evento ainda não aconteceu
      return eventDate > now
    },
    
    verEventoCompleto(evento) {
      this.$router.push({
        name: 'EventDetails',
        params: { id: evento.id }
      })
    },
    
    mostrarQRCode(ingresso) {
      // Implementar modal com QR Code
      alert(`QR Code para o ingresso #${ingresso.numeroIngresso}\n\nEsta funcionalidade será implementada em breve.`)
    },
    
    baixarIngresso(ingresso) {
      // Implementar geração de PDF do ingresso
      alert(`Baixar PDF do ingresso #${ingresso.numeroIngresso}\n\nEsta funcionalidade será implementada em breve.`)
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