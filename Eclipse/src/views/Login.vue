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
          Fazer Login
        </h1>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="Digite seu email"
              class="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
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
                class="w-full px-3 py-3 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                :class="isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'"
                required
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

          <!-- Checkbox Lembrar-me -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                v-model="formData.rememberMe"
                type="checkbox"
                id="remember"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-200"
                :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
              />
              <label for="remember" class="ml-2 text-sm">
                Lembrar-me
              </label>
            </div>
            <div>
              <a
                href="#"
                class="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'"
              >
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <!-- Botão Login -->
          <button
            type="submit"
            :disabled="!isFormValid"
            class="w-full py-3 px-4 rounded-md font-medium text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="[
              isFormValid 
                ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed',
              isDark && isFormValid ? 'bg-blue-500 hover:bg-blue-600' : ''
            ]"
          >
            <span v-if="!isLoading">Entrar</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Entrando...
            </span>
          </button>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t" :class="isDark ? 'border-gray-600' : 'border-gray-300'"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 text-gray-500" :class="isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'">
                ou
              </span>
            </div>
          </div>

          <!-- Link para Registro -->
          <div class="text-center">
            <p class="text-sm">
              Não tem uma conta?
              <router-link 
                to="/register" 
                class="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'"
              >
                Registre-se agora
              </router-link>
            </p>
          </div>
        </form>

        <!-- Mensagem de sucesso -->
        <div v-if="successMessage" class="mt-4 p-3 rounded-md bg-green-100 border border-green-400 text-green-700 text-sm"
             :class="isDark ? 'bg-green-900 border-green-600 text-green-300' : 'bg-green-100 border-green-400 text-green-700'">
          {{ successMessage }}
        </div>

        <!-- Mensagem de erro -->
        <div v-if="errorMessage" class="mt-4 p-3 rounded-md bg-red-100 border border-red-400 text-red-700 text-sm"
             :class="isDark ? 'bg-red-900 border-red-600 text-red-300' : 'bg-red-100 border-red-400 text-red-700'">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
import HeaderComponent from "../components/HeaderComponent.vue";
import { userService } from '../services/api.js';

export default {
  components: { HeaderComponent, Sidebar },
  data() {
    return {
      showPassword: false,
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      formData: {
        email: '',
        senha: '',
        rememberMe: false
      }
    };
  },
  computed: {
    isFormValid() {
      return (
        this.formData.email &&
        this.formData.senha &&
        this.formData.email.includes('@') &&
        this.formData.senha.length >= 1
      );
    }
  },
  methods: {
    async handleLogin() {
      if (!this.isFormValid) return;
      
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      try {
        console.log('🚀 Iniciando login...');
        
        const credentials = {
          email: this.formData.email,
          senha: this.formData.senha
        };
        
        const result = await userService.login(credentials);
        
        if (result.success) {
          console.log('✅ Login bem-sucedido!', result.data);
          
          // Armazenar dados do usuário no localStorage (backend retorna 'user', não 'usuario')
          const userData = result.data.user || result.data.usuario || result.data;
          console.log('💾 Salvando no localStorage:', userData);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Verificar se foi salvo corretamente
          const savedData = localStorage.getItem('user');
          console.log('🔍 Dados salvos verificados:', savedData);
          
          // Disparar evento para atualizar componentes
          window.dispatchEvent(new CustomEvent('userLoginStatusChanged'));
          
          this.successMessage = result.message;
          
          // Redirecionar após um breve delay
          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
          
        } else {
          console.error('❌ Erro no login:', result);
          this.errorMessage = result.message || 'Erro no login';
        }
        
      } catch (error) {
        console.error('❌ Erro inesperado no login:', error);
        this.errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      } finally {
        this.isLoading = false;
      }
    }
  },
};
</script>