import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Profile from '@/views/Profile.vue'
import CreateEvent from '@/views/CreateEvent.vue'
import Events from '@/views/Events.vue'
import EventDetails from '@/views/EventDetails.vue'
import Payment from '@/views/Payment.vue'
import TestEventos from '@/views/TestEventos.vue'
import MeusEventos from '@/views/MeusEventos.vue'
import MeusIngressos from '@/views/MeusIngressos.vue'

// Função para verificar se o usuário está logado
const isAuthenticated = () => {
  try {
    const user = localStorage.getItem('user')
    if (!user || user === 'null' || user === 'undefined') {
      return false
    }
    
    const userData = JSON.parse(user)
    return userData && userData.id && (userData.token || userData.email)
  } catch (error) {
    console.warn('Erro ao verificar autenticação:', error)
    localStorage.removeItem('user')
    return false
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      // Se o usuário já estiver logado, redireciona para o perfil
      if (isAuthenticated()) {
        console.log('🔐 Usuário já logado, redirecionando para perfil')
        next({ name: 'Profile' })
      } else {
        next()
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: (to, from, next) => {
      // Se o usuário já estiver logado, redireciona para o perfil
      if (isAuthenticated()) {
        console.log('🔐 Usuário já logado, redirecionando para perfil')
        next({ name: 'Profile' })
      } else {
        next()
      }
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/create-event',
    name: 'CreateEvent',
    component: CreateEvent
  },
  {
    path: '/events',
    name: 'Events',
    component: Events
  },
  {
    path: '/event/:id',
    name: 'EventDetails',
    component: EventDetails
  },
  {
    path: '/payment/:eventoId',
    name: 'Payment',
    component: Payment
  },
  {
    path: '/test-eventos',
    name: 'TestEventos',
    component: TestEventos
  },
  {
    path: '/meus-eventos',
    name: 'MeusEventos',
    component: MeusEventos
  },
  {
    path: '/meus-ingressos',
    name: 'MeusIngressos',
    component: MeusIngressos
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard global para verificar autenticação
router.beforeEach((to, from, next) => {
  const isLoggedIn = isAuthenticated()
  
  // Lista de rotas que precisam de autenticação
  const protectedRoutes = [
    'Profile', 
    'CreateEvent', 
    'MeusEventos', 
    'MeusIngressos', 
    'Payment'
  ]
  
  // Se está tentando acessar uma rota protegida sem estar logado
  if (protectedRoutes.includes(to.name) && !isLoggedIn) {
    console.log('🚫 Acesso negado - redirecionando para login')
    next({ name: 'Login' })
    return
  }
  
  // Se está logado e tentando acessar login/register, redireciona para perfil
  if (['Login', 'Register'].includes(to.name) && isLoggedIn) {
    console.log('🔐 Usuário já logado - redirecionando para perfil')
    next({ name: 'Profile' })
    return
  }
  
  next()
})

export default router