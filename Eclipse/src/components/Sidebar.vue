<template>
  <div>
    <div class="text-center">
      <button
        class="inline-flex items-center justify-center p-2 rounded-md cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
        type="button"
        @click="isOpen = true"
        aria-label="Abrir menu"
      >
        <svg
          class="w-7 h-7"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>
    </div>

    <transition name="sidebar-slide">
      <div
        v-if="isOpen"
        class="fixed top-0 right-0 z-40 w-4/5 sm:w-2/3 md:w-1/2 lg:w-64 h-screen p-4 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg"
        tabindex="-1"
        aria-labelledby="drawer-navigation-label"
      >
        <div class="flex items-center justify-between mb-4">
          <h5
            id="drawer-navigation-label"
            class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
          >
            Menu
          </h5>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            @click="isOpen = false"
          >
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="sr-only">Close menu</span>
          </button>
        </div>
        <div class="py-4 overflow-y-auto">
          <ul class="space-y-2 font-medium">
            <li>
              <router-link 
                to="/" 
                @click="closeMenu" 
                :class="$route.path === '/' ? 'text-yellow-500 underline' : 'text-white hover:text-yellow-500'"
                class="flex items-center p-2 rounded-lg group"
              >
                Início
              </router-link>
            </li>
            <li>
              <router-link 
                to="/create-event" 
                @click="closeMenu" 
                :class="$route.path === '/create-event' ? 'text-yellow-500 underline' : 'text-white hover:text-yellow-500'"
                class="flex items-center p-2 rounded-lg group"
              >
                <span class="text-xl mr-1">＋</span> Criar evento
              </router-link>
            </li>
            <!-- Botão de Registre-se - apenas para usuários não logados -->
            <li v-if="!isUserLoggedIn">
              <router-link 
                to="/register" 
                @click="closeMenu" 
                :class="$route.path === '/register' ? 'text-yellow-500 underline' : 'text-white hover:text-yellow-500'"
                class="flex items-center p-2 rounded-lg group"
              >
                <span class="text-xl mr-1">＋</span> Registre-se
              </router-link>
            </li>
            <!-- Botão de Login - apenas para usuários não logados -->
            <li v-if="!isUserLoggedIn">
              <router-link 
                to="/login" 
                @click="closeMenu" 
                :class="$route.path === '/login' ? 'text-yellow-500 underline' : 'text-white hover:text-yellow-500'"
                class="flex items-center p-2 rounded-lg group"
              >
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" />
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" />
                </svg>
                Login
              </router-link>
            </li>
            <!-- Botão de Perfil - apenas para usuários logados -->
            <li v-if="isUserLoggedIn">
              <router-link 
                to="/profile" 
                @click="closeMenu" 
                :class="$route.path === '/profile' ? 'text-yellow-500 underline' : 'text-white hover:text-yellow-500'"
                class="flex items-center p-2 rounded-lg group"
              >
                <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Meu Perfil
              </router-link>
            </li>
            
            <!-- Meus Eventos - apenas para organizadores logados -->
            <li v-if="isUserLoggedIn && isOrganizador">
              <router-link 
                to="/meus-eventos" 
                @click="closeMenu" 
                :class="$route.path === '/meus-eventos' ? 'text-yellow-500 underline' : 'text-white hover:text-yellow-500'"
                class="flex items-center p-2 rounded-lg group"
              >
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" fill="none" />
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" />
                </svg>
                Meus Eventos
              </router-link>
            </li>

            <!-- Meus Ingressos - apenas para clientes logados -->
            <li v-if="isUserLoggedIn && isCliente">
              <router-link 
                to="/meus-ingressos" 
                @click="closeMenu" 
                :class="$route.path === '/meus-ingressos' ? 'text-yellow-500 underline' : 'text-white hover:text-yellow-500'"
                class="flex items-center p-2 rounded-lg group"
              >
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" fill="none" />
                  <path d="M7 7v10M17 7v10" stroke="currentColor" />
                </svg>
                Meus Ingressos
              </router-link>
            </li>

            <!-- Explorar Eventos - para todos -->
            <li>
              <router-link 
                to="/events" 
                @click="closeMenu" 
                :class="$route.path === '/events' ? 'text-yellow-500 underline' : 'text-white hover:text-yellow-500'"
                class="flex items-center p-2 rounded-lg group"
              >
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Explorar Eventos
              </router-link>
            </li>

            <!-- Botão de Logout - apenas para usuários logados -->
            <li v-if="isUserLoggedIn" class="pt-4 mt-4 border-t border-gray-600">
              <button
                @click="handleQuickLogout"
                class="flex items-center p-2 rounded-lg group text-red-400 hover:text-red-300 w-full"
              >
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="16,17 21,12 16,7" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Sair
              </button>
            </li>
          </ul>
        </div>
        <!-- Teste simples primeiro -->
        <Switch
          v-model="switchValue"
          :class="isDark ? 'bg-slate-600' : 'bg-slate-300'"
          class="relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          <span class="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            :class="isDark ? 'translate-x-9' : 'translate-x-0'"
            class="pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
          />
        </Switch>
      </div>
    </transition>
  </div>
</template>

<style>
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.sidebar-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.sidebar-slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.sidebar-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.sidebar-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

<script>
import { Switch } from "@headlessui/vue";
import { darkModeState, toggleDarkMode } from '@/plugins/darkModeSimple';

export default {
  components: { Switch },
  data() {
    return {
      isOpen: false,
      userDataWatcher: null, // Para forçar reatividade
      userLoggedIn: false, // Estado reativo para login
      loginCheckInterval: null, // Interval para verificar login
    };
  },
  mounted() {
    // Verificar status inicial de login
    this.checkLoginStatus();
    
    // Escutar mudanças no localStorage para atualizar a sidebar
    window.addEventListener('storage', this.handleStorageChange);
    
    // Também escutar eventos customizados para mudanças de login
    window.addEventListener('userLoginStatusChanged', this.handleLoginStatusChange);
    
    // Polling a cada 2 segundos para garantir sincronização
    this.loginCheckInterval = setInterval(() => {
      this.checkLoginStatus();
    }, 2000);
  },
  beforeUnmount() {
    // Limpar event listeners
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('userLoginStatusChanged', this.handleLoginStatusChange);
    
    // Limpar interval
    if (this.loginCheckInterval) {
      clearInterval(this.loginCheckInterval);
    }
  },
  computed: {
    isDark() {
      return darkModeState.isDark;
    },
    switchValue: {
      get() {
        return this.isDark;
      },
      set(value) {
        this.toggleDarkMode(value);
      }
    },
    isUserLoggedIn() {
      // Retorna o estado reativo que é atualizado pelos watchers
      return this.userLoggedIn;
    },
    currentUser() {
      try {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
      } catch (error) {
        return null;
      }
    },
    isOrganizador() {
      return this.currentUser && this.currentUser.tipoUsuario === 'organizador';
    },
    isCliente() {
      return this.currentUser && this.currentUser.tipoUsuario === 'cliente';
    }
  },
  methods: {
    toggleDarkMode(enabled) {
      toggleDarkMode(enabled);
    },
    simpleToggle() {
      this.toggleDarkMode(!this.isDark);
    },
    closeMenu() {
      this.isOpen = false;
    },
    handleQuickLogout() {
      // Confirmar logout
      if (confirm('Tem certeza de que deseja sair da sua conta?')) {
        // Limpar dados do localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        
        console.log('🚪 Logout rápido realizado');
        
        // Atualizar status local imediatamente
        this.userLoggedIn = false;
        
        // Disparar evento para atualizar componentes
        window.dispatchEvent(new CustomEvent('userLoginStatusChanged'));
        
        // Fechar sidebar
        this.closeMenu();
        
        // Redirecionar para login
        this.$router.push('/login');
      }
    },
    checkLoginStatus() {
      // Verifica se existe dados válidos do usuário no localStorage
      try {
        const userItem = localStorage.getItem('user');
        console.log('🔍 Item raw do localStorage:', userItem);
        
        if (!userItem || userItem === 'null' || userItem === 'undefined') {
          this.userLoggedIn = false;
          console.log('🔍 Status de login: false (sem dados)');
          return;
        }
        
        const userData = JSON.parse(userItem);
        const isValid = userData && userData.id && userData.email;
        this.userLoggedIn = isValid;
        
        console.log('🔍 Dados parseados:', userData);
        console.log('🔍 Status de login verificado:', this.userLoggedIn);
        
        // Forçar re-render
        this.$forceUpdate();
        
      } catch (error) {
        console.error('Erro ao verificar status de login:', error);
        this.userLoggedIn = false;
        // Limpar dados corrompidos
        localStorage.removeItem('user');
      }
    },
    handleStorageChange(event) {
      // Atualizar quando localStorage mudar
      if (event.key === 'user') {
        this.checkLoginStatus();
      }
    },
    handleLoginStatusChange() {
      // Atualizar status quando evento customizado for disparado
      this.checkLoginStatus();
    }
  }
};
</script>
