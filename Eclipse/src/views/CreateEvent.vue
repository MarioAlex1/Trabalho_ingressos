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
          <span :class="isDark ? 'text-white' : 'text-gray-700'">Verificando permissões...</span>
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
          Apenas organizadores podem criar eventos.<br>
          <small>Você está logado como: <strong>{{ user.tipoUsuario }}</strong></small><br>
          <small class="italic">Clientes podem comprar ingressos nos eventos disponíveis.</small>
        </div>
        <div class="space-x-4">
          <router-link 
            to="/events" 
            class="inline-block px-6 py-3 rounded-lg font-medium transition-all duration-200"
            :class="isDark
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
              : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'"
          >
            Ver Eventos Disponíveis
          </router-link>
          <router-link 
            to="/register" 
            class="inline-block px-6 py-3 rounded-lg font-medium transition-all duration-200"
            :class="isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'"
          >
            Registrar como Organizador
          </router-link>
        </div>
      </div>
      
      <!-- Formulário para organizadores -->
      <div v-else class="max-w-6xl mx-auto">
        <div 
          class="px-6 py-4 rounded-lg mb-6 shadow-lg backdrop-blur-sm"
          :class="isDark 
            ? 'bg-green-900/80 border border-green-700 text-green-200' 
            : 'bg-green-100/80 border border-green-400 text-green-800'"
        >
          <strong>Acesso Autorizado</strong><br>
          Bem-vindo, <strong>{{ user.nome }}</strong>! Você pode criar eventos.
        </div>
        
        <h1 
          class="text-4xl font-bold text-center mb-8"
          :class="isDark ? 'text-white' : 'text-gray-800'"
        >
          Criar Novo Evento
        </h1>
        
        <!-- Formulário Principal -->
        <form @submit.prevent="handleCreateEvent" 
              class="rounded-lg shadow-2xl p-8 backdrop-blur-sm"
              :class="isDark 
                ? 'bg-gray-800/90 border border-gray-700' 
                : 'bg-white/90 border border-gray-200'"
        >
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Coluna Esquerda - Upload de Imagem -->
            <div>
              <label 
                class="block text-sm font-semibold mb-4"
                :class="isDark ? 'text-gray-200' : 'text-gray-700'"
              >
                Imagem do Evento
              </label>
              
              <!-- Preview da Imagem -->
              <div 
                v-if="form.imagem || imagePreview"
                class="mb-4 relative"
              >
                <div class="h-80 bg-cover bg-center rounded-lg shadow-lg overflow-hidden">
                  <img 
                    :src="imagePreview || form.imagem" 
                    alt="Preview do evento"
                    class="w-full h-full object-cover"
                  >
                </div>
                <button 
                  type="button"
                  @click="removeImage"
                  class="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-lg"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <!-- Upload Area -->
              <div 
                v-else
                @click="triggerFileInput"
                @dragover.prevent="dragOver = true"
                @dragleave.prevent="dragOver = false"
                @drop.prevent="handleDrop"
                class="h-80 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
                :class="[
                  dragOver ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : '',
                  isDark 
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50' 
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                ]"
              >
                <svg class="w-16 h-16 mb-4" :class="isDark ? 'text-gray-400' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <div class="text-center">
                  <p class="mb-2 font-medium" :class="isDark ? 'text-gray-200' : 'text-gray-600'">
                    Clique para fazer upload ou arraste uma imagem
                  </p>
                  <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    PNG, JPG, GIF até 10MB
                  </p>
                </div>
              </div>
              
              <input 
                ref="fileInput"
                type="file" 
                class="hidden" 
                accept="image/*"
                @change="handleFileSelect"
              >
            </div>
            
            <!-- Coluna Direita - Informações do Evento -->
            <div class="space-y-6">
              <!-- Nome do Evento -->
              <div>
                <label 
                  class="block text-sm font-semibold mb-2"
                  :class="isDark ? 'text-gray-200' : 'text-gray-700'"
                >
                  Nome do Evento *
                </label>
                <input 
                  v-model="form.titulo" 
                  type="text" 
                  required 
                  class="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  :class="isDark 
                    ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'"
                  placeholder="Digite o nome do evento"
                >
              </div>

              <!-- Data e Hora -->
              <div>
                <label 
                  class="block text-sm font-semibold mb-2"
                  :class="isDark ? 'text-gray-200' : 'text-gray-700'"
                >
                  Data e Hora *
                </label>
                <input 
                  v-model="form.dataEvento" 
                  type="datetime-local" 
                  required 
                  class="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  :class="isDark 
                    ? 'bg-gray-700 border border-gray-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-900'"
                >
              </div>

              <!-- Endereço -->
              <div>
                <label 
                  class="block text-sm font-semibold mb-2"
                  :class="isDark ? 'text-gray-200' : 'text-gray-700'"
                >
                  Endereço *
                </label>
                <input 
                  v-model="form.endereco" 
                  type="text" 
                  required 
                  class="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  :class="isDark 
                    ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'"
                  placeholder="Local onde será realizado o evento"
                >
              </div>

              <!-- Capacidade -->
              <div>
                <label 
                  class="block text-sm font-semibold mb-2"
                  :class="isDark ? 'text-gray-200' : 'text-gray-700'"
                >
                  Capacidade *
                </label>
                <input 
                  v-model="form.capacidade" 
                  type="number" 
                  min="1"
                  required 
                  class="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  :class="isDark 
                    ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'"
                  placeholder="Número máximo de participantes"
                >
              </div>

              <!-- Descrição -->
              <div>
                <label 
                  class="block text-sm font-semibold mb-2"
                  :class="isDark ? 'text-gray-200' : 'text-gray-700'"
                >
                  Descrição *
                </label>
                <textarea 
                  v-model="form.descricao" 
                  required 
                  rows="4"
                  class="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-vertical"
                  :class="isDark 
                    ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'"
                  placeholder="Descreva os detalhes do evento"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Seção de Ingressos -->
          <div class="mt-8">
            <h2 
              class="text-2xl font-semibold mb-6"
              :class="isDark ? 'text-white' : 'text-gray-800'"
            >
              Tipos de Ingressos
            </h2>
            
            <div class="space-y-6">
              <div 
                v-for="(ingresso, index) in form.ingressos" 
                :key="index" 
                class="rounded-lg p-6 border transition-all duration-200"
                :class="isDark 
                  ? 'bg-gray-700/50 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'"
              >
                
                <div class="flex justify-between items-center mb-4">
                  <h3 
                    class="text-lg font-medium flex items-center"
                    :class="isDark ? 'text-white' : 'text-gray-700'"
                  >
                    <span class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                      {{ index + 1 }}
                    </span>
                    Ingresso {{ index + 1 }}
                  </h3>
                  <button 
                    v-if="form.ingressos.length > 1"
                    type="button" 
                    @click="removeIngresso(index)"
                    class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                  >
                    Remover
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label 
                      class="block text-sm font-medium mb-2"
                      :class="isDark ? 'text-gray-300' : 'text-gray-600'"
                    >
                      Tipo *
                    </label>
                    <input 
                      v-model="ingresso.tipo" 
                      type="text" 
                      required 
                      class="w-full px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      :class="isDark 
                        ? 'bg-gray-600 border border-gray-500 text-white placeholder-gray-400' 
                        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'"
                      placeholder="Ex: VIP, Normal, Estudante"
                    >
                  </div>
                  
                  <div>
                    <label 
                      class="block text-sm font-medium mb-2"
                      :class="isDark ? 'text-gray-300' : 'text-gray-600'"
                    >
                      Preço (R$) *
                    </label>
                    <input 
                      v-model="ingresso.preco" 
                      type="number" 
                      step="0.01"
                      min="0"
                      required 
                      class="w-full px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      :class="isDark 
                        ? 'bg-gray-600 border border-gray-500 text-white placeholder-gray-400' 
                        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'"
                      placeholder="0,00"
                    >
                  </div>
                  
                  <div>
                    <label 
                      class="block text-sm font-medium mb-2"
                      :class="isDark ? 'text-gray-300' : 'text-gray-600'"
                    >
                      Quantidade *
                    </label>
                    <input 
                      v-model="ingresso.quantidade" 
                      type="number" 
                      min="1"
                      required 
                      class="w-full px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      :class="isDark 
                        ? 'bg-gray-600 border border-gray-500 text-white placeholder-gray-400' 
                        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'"
                      placeholder="100"
                    >
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              type="button" 
              @click="addIngresso"
              class="mt-4 w-full py-3 border-2 border-dashed rounded-lg font-medium transition-all duration-200"
              :class="isDark 
                ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-gray-200 bg-gray-700/30' 
                : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 bg-gray-50'"
            >
              Adicionar Tipo de Ingresso
            </button>
          </div>
          
          <!-- Botões de Ação -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="px-8 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed flex items-center justify-center"
              :class="isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : isDark
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
                  : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg'"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Criando Evento...' : 'Criar Evento' }}
            </button>
            
            <router-link 
              to="/" 
              class="px-8 py-3 rounded-lg font-semibold text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              :class="isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg'
                : 'bg-gray-500 hover:bg-gray-600 text-white shadow-lg'"
            >
              Cancelar
            </router-link>
          </div>
        </form>
        
        <!-- Mensagens de Status -->
        <div v-if="message" class="mt-8 p-6 rounded-lg shadow-lg backdrop-blur-sm" :class="messageClass">
          <div class="flex items-center">
            <svg v-if="messageType === 'success'" class="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else class="w-6 h-6 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <div>
              <p class="font-semibold">{{ message }}</p>
              <p v-if="messageType === 'success'" class="text-sm mt-1 opacity-80">
                Redirecionando para a página inicial...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue'
import { darkModeState } from '@/plugins/darkModeSimple'

export default {
  name: 'CreateEvent',
  components: {
    HeaderComponent
  },
  data() {
    return {
      loading: true,
      user: {},
      isOrganizer: false,
      isSubmitting: false,
      message: '',
      messageType: 'success',
      
      // Image upload
      imagePreview: null,
      dragOver: false,
      
      form: {
        titulo: '',
        endereco: '',
        capacidade: '',
        dataEvento: '',
        descricao: '',
        imagem: '',
        ingressos: [
          {
            tipo: 'Normal',
            preco: '',
            quantidade: '',
            descricao: ''
          }
        ]
      }
    }
  },
  computed: {
    isDark() {
      return darkModeState.isDark
    },
    currentBackground() {
      return darkModeState.currentBackground
    },
    messageClass() {
      if (this.messageType === 'success') {
        return this.isDark 
          ? 'bg-green-900/80 border border-green-700 text-green-200'
          : 'bg-green-100/80 border border-green-400 text-green-800'
      } else {
        return this.isDark 
          ? 'bg-red-900/80 border border-red-700 text-red-200'
          : 'bg-red-100/80 border border-red-400 text-red-800'
      }
    },
    messageIcon() {
      return this.messageType === 'success' ? '✅' : '❌'
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
        }
        
      } catch (error) {
        console.error('Erro ao inicializar componente:', error)
        this.user = {}
        this.isOrganizer = false
      } finally {
        this.loading = false
      }
    },
    goBack() {
      this.$router.push('/')
    },
    showMessage(message, type = 'success') {
      this.message = message
      this.messageType = type
      
      if (type === 'error') {
        setTimeout(() => {
          this.message = ''
        }, 5000)
      }
    },
    
    // Métodos de upload de imagem
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.processImage(file)
      }
    },
    
    handleDrop(event) {
      this.dragOver = false
      const files = event.dataTransfer.files
      if (files.length > 0) {
        this.processImage(files[0])
      }
    },
    
    processImage(file) {
      if (!file.type.startsWith('image/')) {
        this.showMessage('Por favor, selecione apenas arquivos de imagem.', 'error')
        return
      }
      
      if (file.size > 10 * 1024 * 1024) {
        this.showMessage('A imagem deve ter menos que 10MB.', 'error')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePreview = e.target.result
        this.form.imagem = e.target.result
      }
      reader.readAsDataURL(file)
    },
    
    removeImage() {
      this.imagePreview = null
      this.form.imagem = ''
      this.$refs.fileInput.value = ''
    },
    
    addIngresso() {
      this.form.ingressos.push({
        tipo: '',
        preco: '',
        quantidade: ''
      })
    },
    
    removeIngresso(index) {
      if (this.form.ingressos.length > 1) {
        this.form.ingressos.splice(index, 1)
      }
    },
    
    async handleCreateEvent() {
      this.isSubmitting = true
      this.message = ''
      
      try {
        if (!this.isOrganizer) {
          throw new Error('Apenas organizadores podem criar eventos')
        }
        
        if (!this.form.titulo.trim()) {
          throw new Error('Nome do evento é obrigatório')
        }
        
        if (!this.form.endereco.trim()) {
          throw new Error('Endereço é obrigatório')
        }
        
        if (!this.form.capacidade || this.form.capacidade < 1) {
          throw new Error('Capacidade deve ser maior que zero')
        }
        
        if (!this.form.dataEvento) {
          throw new Error('Data do evento é obrigatória')
        }
        
        const eventDate = new Date(this.form.dataEvento)
        const now = new Date()
        if (eventDate < now) {
          throw new Error('A data do evento não pode ser no passado')
        }
        
        if (!this.form.descricao.trim()) {
          throw new Error('Descrição é obrigatória')
        }
        
        // Validar ingressos
        for (let i = 0; i < this.form.ingressos.length; i++) {
          const ingresso = this.form.ingressos[i]
          if (!ingresso.tipo.trim()) {
            throw new Error(`Tipo do ingresso ${i + 1} é obrigatório`)
          }
          if (!ingresso.preco || ingresso.preco < 0) {
            throw new Error(`Preço do ingresso ${i + 1} deve ser maior ou igual a zero`)
          }
          if (!ingresso.quantidade || ingresso.quantidade < 1) {
            throw new Error(`Quantidade do ingresso ${i + 1} deve ser maior que zero`)
          }
        }
        
        // Criar objeto do evento para o backend
        const eventoData = {
          titulo: this.form.titulo.trim(),
          endereco: this.form.endereco.trim(),
          capacidade: parseInt(this.form.capacidade),
          dataEvento: this.form.dataEvento,
          descricao: this.form.descricao.trim(),
          imagem: this.form.imagem,
          organizadorId: this.user.id,
          status: 'ativo'
        }

        console.log('📤 Enviando evento para backend:', eventoData)

        // Enviar evento para o backend
        const response = await fetch('http://localhost:3001/api/eventos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventoData)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Erro ao criar evento no servidor')
        }

        const eventoCreated = await response.json()
        console.log('✅ Evento criado no backend:', eventoCreated)

        // Pegar o ID do evento (pode estar em evento.id ou diretamente em id)
        const eventoId = eventoCreated.evento?.id || eventoCreated.id
        console.log('🔍 ID do evento:', eventoId)

        if (!eventoId) {
          throw new Error('ID do evento não encontrado na resposta do servidor')
        }

        // Agora criar os tipos de ingressos
        for (const ingresso of this.form.ingressos) {
          const ingressoData = {
            eventoId: eventoId,
            tipo: ingresso.tipo.trim(),
            preco: parseFloat(ingresso.preco),
            quantidade: parseInt(ingresso.quantidade)
          }

          const ingressoResponse = await fetch('http://localhost:3001/api/tipos-ingressos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingressoData)
          })

          if (!ingressoResponse.ok) {
            console.error('❌ Erro ao criar tipo de ingresso:', ingressoData)
          } else {
            console.log('✅ Tipo de ingresso criado:', ingressoData)
          }
        }
        
        const eventoTitulo = eventoCreated.evento?.titulo || eventoCreated.titulo || this.form.titulo
        
        this.showMessage(
          `Evento "${eventoTitulo}" criado com sucesso! Redirecionando...`, 
          'success'
        )
        
        this.resetForm()
        
        setTimeout(() => {
          this.$router.push('/events')
        }, 3000)
        
      } catch (error) {
        console.error('Erro ao criar evento:', error)
        this.showMessage(error.message, 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    resetForm() {
      this.form = {
        titulo: '',
        endereco: '',
        capacidade: '',
        dataEvento: '',
        descricao: '',
        imagem: '',
        ingressos: [
          {
            tipo: 'Normal',
            preco: '',
            quantidade: ''
          }
        ]
      }
      this.imagePreview = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
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
