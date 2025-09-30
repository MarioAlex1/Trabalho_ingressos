<template>
  <div
    class="min-h-screen bg-repeat bg-center transition-all duration-300"
    :style="{ backgroundImage: `url(${currentBackground})` }"
    :class="{ dark: isDark }"
  >
    <header>
      <HeaderComponent />
    </header>
    
    <div class="flex justify-center items-center min-h-screen p-4 pt-20">
      <div
        class="w-full max-w-2xl mx-auto p-6 rounded-lg shadow-lg transition-colors duration-300"
        :class="isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'"
      >
        <div class="text-center mb-8">
          <div class="relative inline-block">
            <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <button 
              class="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
              :class="isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'"
              @click="editPhoto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
          </div>
          <h1 class="text-3xl font-bold mb-2">Meu Perfil</h1>
          <p class="text-gray-600 dark:text-gray-400">Gerencie suas informações pessoais</p>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="text-center py-8">
          <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md transition ease-in-out duration-150">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Carregando informações...
          </div>
        </div>

        <!-- Profile form -->
        <form v-else @submit.prevent="handleSave" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nome -->
            <div>
              <label class="block text-sm font-medium mb-2">Nome Completo</label>
              <input
                v-model="formData.nome"
                type="text"
                :disabled="!isEditing"
                class="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                :class="[
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500',
                  !isEditing ? 'bg-gray-100 dark:bg-gray-700' : ''
                ]"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium mb-2">Email</label>
              <input
                v-model="formData.email"
                type="email"
                :disabled="!isEditing"
                class="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                :class="[
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500',
                  !isEditing ? 'bg-gray-100 dark:bg-gray-700' : ''
                ]"
              />
            </div>

            <!-- CPF -->
            <div>
              <label class="block text-sm font-medium mb-2">CPF</label>
              <input
                v-model="formData.cpf"
                type="text"
                :disabled="!isEditing"
                @input="onCPFInput"
                maxlength="14"
                placeholder="000.000.000-00"
                class="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                :class="[
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500',
                  !isEditing ? 'bg-gray-100 dark:bg-gray-700' : ''
                ]"
              />
            </div>

            <!-- Telefone -->
            <div>
              <label class="block text-sm font-medium mb-2">Telefone</label>
              <input
                v-model="formData.telefone"
                type="tel"
                :disabled="!isEditing"
                @input="onTelefoneInput"
                maxlength="15"
                placeholder="(00) 00000-0000"
                class="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                :class="[
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500',
                  !isEditing ? 'bg-gray-100 dark:bg-gray-700' : ''
                ]"
              />
            </div>

            <!-- Tipo de Usuário -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-2">Tipo de Usuário</label>
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <input
                    id="cliente"
                    v-model="formData.tipoUsuario"
                    type="radio"
                    value="cliente"
                    :disabled="!isEditing"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-60"
                  />
                  <label for="cliente" class="ml-2 text-sm font-medium">Cliente</label>
                </div>
                <div class="flex items-center">
                  <input
                    id="organizador"
                    v-model="formData.tipoUsuario"
                    type="radio"
                    value="organizador"
                    :disabled="!isEditing"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-60"
                  />
                  <label for="organizador" class="ml-2 text-sm font-medium">Organizador</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex justify-between items-center pt-6 border-t" :class="isDark ? 'border-gray-600' : 'border-gray-300'">
            <div class="flex space-x-3">
              <!-- Edit/Cancel button -->
              <button
                v-if="!isEditing"
                type="button"
                @click="startEdit"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'"
              >
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Editar Perfil
              </button>
              
              <button
                v-else
                type="button"
                @click="cancelEdit"
                class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancelar
              </button>
            </div>

            <!-- Save button -->
            <button
              v-if="isEditing"
              type="submit"
              :disabled="isSaving || !isFormValid"
              class="px-6 py-3 font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="[
                isFormValid 
                  ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed',
                isDark && isFormValid ? 'bg-green-500 hover:bg-green-600' : ''
              ]"
            >
              <span v-if="!isSaving">Salvar Alterações</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
            </button>
          </div>
        </form>

        <!-- Success/Error messages -->
        <div v-if="successMessage" class="mt-4 p-3 rounded-md bg-green-100 border border-green-400 text-green-700 text-sm"
             :class="isDark ? 'bg-green-900 border-green-600 text-green-300' : 'bg-green-100 border-green-400 text-green-700'">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="mt-4 p-3 rounded-md bg-red-100 border border-red-400 text-red-700 text-sm"
             :class="isDark ? 'bg-red-900 border-red-600 text-red-300' : 'bg-red-100 border-red-400 text-red-700'">
          {{ errorMessage }}
        </div>

        <!-- Logout Section -->
        <div class="mt-8 pt-6 border-t" :class="isDark ? 'border-gray-600' : 'border-gray-300'">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium mb-1">Sair da Conta</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Desconecte-se de sua conta de forma segura
              </p>
            </div>
            <button
              @click="showLogoutConfirm = true"
              class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              :class="isDark ? 'bg-red-500 hover:bg-red-600 focus:ring-red-400' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'"
            >
              <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>

        <!-- Logout Confirmation Modal -->
        <div v-if="showLogoutConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 m-4 max-w-md w-full border border-gray-200 dark:border-gray-600" 
               :class="isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'"
               @click.stop>
            <div class="flex items-center mb-4">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-medium">Confirmar Logout</h3>
              </div>
            </div>
            <div class="mb-6">
              <p class="text-gray-600 dark:text-gray-400">
                Tem certeza de que deseja sair da sua conta? Você precisará fazer login novamente para acessar o sistema.
              </p>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                @click="showLogoutConfirm = false"
                class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-md transition-colors duration-200"
                :class="isDark ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'"
              >
                Cancelar
              </button>
              <button
                @click="handleLogout"
                :disabled="isLoggingOut"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="isDark ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'"
              >
                <span v-if="!isLoggingOut">Confirmar Logout</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saindo...
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "../components/HeaderComponent.vue";
import { userService } from '../services/api.js';

export default {
  components: { HeaderComponent },
  data() {
    return {
      isLoading: true,
      isEditing: false,
      isSaving: false,
      isLoggingOut: false,
      showLogoutConfirm: false,
      successMessage: '',
      errorMessage: '',
      originalData: {},
      formData: {
        id: null,
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        tipoUsuario: 'cliente'
      }
    };
  },
  computed: {
    isFormValid() {
      return (
        this.formData.nome.trim() &&
        this.formData.email.trim() &&
        this.formData.email.includes('@') &&
        this.formData.cpf.trim() &&
        this.formData.telefone.trim() &&
        this.formData.tipoUsuario
      );
    }
  },
  async mounted() {
    await this.loadUserData();
  },
  methods: {
    async loadUserData() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        // Carregar dados do usuário do localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (userData && userData.id) {
          // Garantir que todos os campos existam e formatá-los
          this.formData = {
            id: userData.id,
            nome: userData.nome || '',
            email: userData.email || '',
            cpf: userData.cpf ? this.formatCPF(userData.cpf) : '',
            telefone: userData.telefone ? this.formatTelefone(userData.telefone) : '',
            tipoUsuario: userData.tipoUsuario || 'cliente'
          };
          this.originalData = { ...this.formData };
          
          console.log('📋 Dados do usuário carregados:', this.formData);
        } else {
          // Usuário não está logado, redirecionar
          console.warn('⚠️ Usuário não encontrado, redirecionando para login');
          this.$router.push('/login');
          return;
        }
        
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        this.errorMessage = 'Erro ao carregar informações do perfil';
        // Se erro crítico, redirecionar para login
        this.$router.push('/login');
      } finally {
        this.isLoading = false;
      }
    },

    // Formatação de CPF
    formatCPF(cpf) {
      if (!cpf) return '';
      const nums = cpf.replace(/\D/g, '');
      if (nums.length <= 11) {
        return nums.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
      return cpf;
    },

    // Formatação de telefone
    formatTelefone(telefone) {
      if (!telefone) return '';
      const nums = telefone.replace(/\D/g, '');
      if (nums.length <= 11) {
        return nums.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      return telefone;
    },

    // Aplicar formatação enquanto digita
    onCPFInput() {
      this.formData.cpf = this.formatCPF(this.formData.cpf);
    },

    onTelefoneInput() {
      this.formData.telefone = this.formatTelefone(this.formData.telefone);
    },
    
    startEdit() {
      this.isEditing = true;
      this.successMessage = '';
      this.errorMessage = '';
    },
    
    cancelEdit() {
      this.formData = { ...this.originalData };
      this.isEditing = false;
      this.successMessage = '';
      this.errorMessage = '';
    },
    
    async handleSave() {
      if (!this.isFormValid) return;
      
      this.isSaving = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      try {
        console.log('🚀 Salvando dados do perfil...', this.formData);
        
        // Preparar dados para envio (remover formatação)
        const dataToSend = {
          nome: this.formData.nome.trim(),
          email: this.formData.email.trim(),
          cpf: this.formData.cpf.replace(/\D/g, ''), // Remove formatação
          telefone: this.formData.telefone.replace(/\D/g, ''), // Remove formatação
          tipoUsuario: this.formData.tipoUsuario
        };
        
        // Chamar API para atualizar usuário
        const result = await userService.update(this.formData.id, dataToSend);
        
        if (result.success) {
          console.log('✅ Perfil atualizado com sucesso:', result.data);
          
          // Atualizar dados locais com a resposta da API
          const updatedUser = result.data.user || result.data;
          const formattedData = {
            id: updatedUser.id,
            nome: updatedUser.nome,
            email: updatedUser.email,
            cpf: this.formatCPF(updatedUser.cpf),
            telefone: this.formatTelefone(updatedUser.telefone),
            tipoUsuario: updatedUser.tipoUsuario
          };
          
          this.formData = { ...formattedData };
          this.originalData = { ...formattedData };
          
          // Atualizar localStorage
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Disparar evento para atualizar componentes
          window.dispatchEvent(new CustomEvent('userLoginStatusChanged'));
          
          this.isEditing = false;
          this.successMessage = result.message || 'Perfil atualizado com sucesso!';
          
          // Limpar mensagem após 5 segundos
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
          
        } else {
          console.error('❌ Erro na API:', result);
          this.errorMessage = result.message || 'Erro ao salvar perfil. Tente novamente.';
        }
        
      } catch (error) {
        console.error('❌ Erro ao salvar perfil:', error);
        this.errorMessage = 'Erro interno do servidor. Tente novamente.';
      } finally {
        this.isSaving = false;
      }
    },
    
    editPhoto() {
      // Funcionalidade futura para editar foto
      alert('Funcionalidade de edição de foto será implementada em breve!');
    },
    
    async handleLogout() {
      this.isLoggingOut = true;
      
      try {
        console.log('🚪 Realizando logout...');
        
        // Simular chamada de logout para API (opcional)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Limpar dados do localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('authToken'); // se existir
        localStorage.removeItem('refreshToken'); // se existir
        
        // Disparar evento para atualizar componentes
        window.dispatchEvent(new CustomEvent('userLoginStatusChanged'));
        
        // Limpar qualquer estado de autenticação global (se existir)
        // this.$store.commit('LOGOUT'); // se usando Vuex
        
        console.log('✅ Logout realizado com sucesso');
        
        // Redirecionar para página de login
        this.$router.push('/login');
        
      } catch (error) {
        console.error('❌ Erro no logout:', error);
        this.errorMessage = 'Erro ao realizar logout. Tente novamente.';
        
        // Mesmo com erro, limpar dados locais por segurança
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        
        // Disparar evento para atualizar componentes
        window.dispatchEvent(new CustomEvent('userLoginStatusChanged'));
        
        // Redirecionar mesmo assim
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
        
      } finally {
        this.isLoggingOut = false;
        this.showLogoutConfirm = false;
      }
    }
  }
};
</script>