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
        class="w-full max-w-md mx-auto p-6 rounded-lg shadow-lg transition-colors duration-300"
        :class="isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'"
      >
        <h1 class="text-3xl font-bold text-center mb-6">
          Registre-se
        </h1>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Dropdown Tipo de Usuário -->
          <div>
            <label class="block text-sm font-medium mb-2">
              Tipo de Conta
            </label>
            <select
              v-model="formData.userType"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              :class="isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'"
              required
            >
              <option value="">Selecione o tipo de conta</option>
              <option value="cliente">Cliente</option>
              <option value="organizador">Organizador</option>
            </select>
          </div>

          <!-- Nome -->
          <div>
            <label class="block text-sm font-medium mb-2">
              Nome Completo
            </label>
            <input
              v-model="formData.nome"
              type="text"
              placeholder="Digite seu nome completo"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              :class="isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="Digite seu email"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              :class="isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'"
              required
            />
          </div>

          <!-- CPF -->
          <div>
            <label class="block text-sm font-medium mb-2">
              CPF
            </label>
            <input
              v-model="formData.cpf"
              type="text"
              placeholder="000.000.000-00"
              maxlength="14"
              @input="formatCPF"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              :class="isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'"
              required
            />
          </div>

          <!-- Telefone -->
          <div>
            <label class="block text-sm font-medium mb-2">
              Telefone
            </label>
            <input
              v-model="formData.telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              maxlength="15"
              @input="formatTelefone"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              :class="isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'"
              required
            />
          </div>

          <!-- Senha -->
          <div>
            <label class="block text-sm font-medium mb-2">
              Senha
            </label>
            <div class="relative">
              <input
                v-model="formData.senha"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Digite sua senha"
                class="w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                :class="isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'"
                required
                minlength="6"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                :class="isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m7.071-7.071L21 3m-2.929 2.929l-7.071 7.071"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirmar Senha -->
          <div>
            <label class="block text-sm font-medium mb-2">
              Confirmar Senha
            </label>
            <input
              v-model="formData.confirmarSenha"
              type="password"
              placeholder="Confirme sua senha"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              :class="isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'"
              required
            />
            <p v-if="formData.senha && formData.confirmarSenha && formData.senha !== formData.confirmarSenha" 
               class="text-red-500 text-sm mt-1">
              As senhas não coincidem
            </p>
          </div>

          <!-- Botão Submit -->
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="w-full py-2 px-4 rounded-md font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="[
              isFormValid && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed',
              isDark && isFormValid && !isLoading ? 'bg-blue-500 hover:bg-blue-600' : ''
            ]"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Criando conta...
            </span>
            <span v-else>Criar Conta</span>
          </button>

          <!-- Mensagens de Feedback -->
          <div v-if="errorMessage" class="mt-4 p-3 rounded-md bg-red-100 border border-red-400 text-red-700 text-sm"
               :class="isDark ? 'bg-red-900 border-red-600 text-red-300' : 'bg-red-100 border-red-400 text-red-700'">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              {{ errorMessage }}
            </div>
          </div>

          <div v-if="successMessage" class="mt-4 p-3 rounded-md bg-green-100 border border-green-400 text-green-700 text-sm"
               :class="isDark ? 'bg-green-900 border-green-600 text-green-300' : 'bg-green-100 border-green-400 text-green-700'">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              {{ successMessage }} Redirecionando para o login...
            </div>
          </div>

          <!-- Link para Login -->
          <div class="text-center mt-4">
            <p class="text-sm">
              Já tem uma conta?
              <router-link 
                to="/login" 
                class="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'"
              >
                Faça login
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
import HeaderComponent from "../components/HeaderComponent.vue";
import { userService } from "../services/api.js";

export default {
  components: { HeaderComponent, Sidebar },
  data() {
    return {
      showPassword: false,
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      formData: {
        userType: '',
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        senha: '',
        confirmarSenha: ''
      }
    };
  },
  computed: {
    isFormValid() {
      return (
        this.formData.userType &&
        this.formData.nome &&
        this.formData.email &&
        this.formData.cpf &&
        this.formData.telefone &&
        this.formData.senha &&
        this.formData.confirmarSenha &&
        this.formData.senha === this.formData.confirmarSenha &&
        this.formData.senha.length >= 6
      );
    }
  },
  methods: {
    formatCPF() {
      let value = this.formData.cpf.replace(/\D/g, '');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      this.formData.cpf = value;
    },
    
    formatTelefone() {
      let value = this.formData.telefone.replace(/\D/g, '');
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
      }
      this.formData.telefone = value;
    },
    
    async handleSubmit() {
      if (!this.isFormValid) return;
      
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      try {
        // Preparar dados para enviar para a API
        const userData = {
          nome: this.formData.nome,
          email: this.formData.email,
          senha: this.formData.senha,
          cpf: this.formData.cpf.replace(/\D/g, ''), // Remove formatação do CPF
          telefone: this.formData.telefone.replace(/\D/g, ''), // Remove formatação do telefone
          tipoUsuario: this.formData.userType
        };
        
        console.log('Enviando dados para API:', userData);
        
        // Chamar a API para criar usuário
        const result = await userService.create(userData);
        
        if (result.success) {
          this.successMessage = result.message;
          console.log('Usuário criado com sucesso:', result.data);
          
          // Limpar formulário após sucesso
          this.resetForm();
          
          // Redirecionar para login após 2 segundos
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
          
        } else {
          this.errorMessage = result.message;
          if (result.details) {
            console.error('Detalhes do erro:', result.details);
          }
        }
        
      } catch (error) {
        console.error('Erro inesperado:', error);
        this.errorMessage = 'Erro inesperado. Tente novamente.';
      } finally {
        this.isLoading = false;
      }
    },
    
    resetForm() {
      this.formData = {
        userType: '',
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        senha: '',
        confirmarSenha: ''
      };
    }
  },
};
</script>
