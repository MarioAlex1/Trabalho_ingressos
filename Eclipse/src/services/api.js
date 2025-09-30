import axios from 'axios'

// Configuração base do Axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 segundos para uploads de imagem
  maxContentLength: Infinity,
  maxBodyLength: Infinity
})

// Interceptor para adicionar token de autenticação e log de requests
api.interceptors.request.use(
  config => {
    console.log('🚀 Fazendo requisição:', config.method.toUpperCase(), config.url)
    
    // Adicionar token de autenticação se disponível
    try {
      const userItem = localStorage.getItem('user')
      console.log('🔍 Item do localStorage:', userItem)
      
      const user = userItem ? JSON.parse(userItem) : {}
      console.log('👤 User parseado:', user)
      
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
        console.log('🔑 Token adicionado ao header')
      }
    } catch (error) {
      console.warn('⚠️ Erro ao parsear user do localStorage:', error)
      // Se há erro, limpa o localStorage e continua sem token
      localStorage.removeItem('user')
    }
    
    return config
  },
  error => {
    console.error('❌ Erro na requisição:', error)
    return Promise.reject(error)
  }
)

// Interceptor para log de responses (opcional) - REMOVIDO TEMPORARIAMENTE PARA DEBUG

// Serviços de Usuário
export const userService = {
  // Criar usuário (registro)
  async create(userData) {
    try {
      console.log('🚀 Enviando dados para API:', userData)
      console.log('🔗 URL completa:', `${api.defaults.baseURL}/usuarios`)
      
      const response = await api.post('/usuarios', userData)
      
      console.log('✅ Response completo:', response)
      console.log('✅ Response.data:', response.data)
      console.log('✅ Response.status:', response.status)
      
      return {
        success: true,
        data: response.data,
        message: 'Usuário criado com sucesso!'
      }
    } catch (error) {
      console.error('❌ Erro completo:', error)
      console.error('❌ Tipo do erro:', typeof error)
      console.error('❌ Error.response:', error.response)
      console.error('❌ Error.message:', error.message)
      console.error('❌ Error.code:', error.code)
      
      // Se não há resposta, é um erro de rede
      if (!error.response) {
        return {
          success: false,
          message: 'Erro de conexão com o servidor. Verifique se o backend está rodando.',
          details: error.message,
          status: 'NETWORK_ERROR'
        }
      }
      
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao criar usuário',
        details: error.response?.data?.details || error.message,
        status: error.response?.status
      }
    }
  },

  // Login de usuário
  async login(credentials) {
    try {
      console.log('🚀 Realizando login:', { email: credentials.email })
      const response = await api.post('/login', credentials)
      console.log('✅ Login bem-sucedido:', response.data)
      return {
        success: true,
        data: response.data,
        message: 'Login realizado com sucesso!'
      }
    } catch (error) {
      console.error('❌ Erro no login:', error)
      console.error('❌ Resposta do servidor:', error.response?.data)
      console.error('❌ Status:', error.response?.status)
      
      let errorMessage = 'Erro no login'
      
      if (error.response?.data?.details) {
        errorMessage = `${error.response.data.error}: ${error.response.data.details}`
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return {
        success: false,
        message: errorMessage,
        details: error.response?.data?.details || error.message,
        status: error.response?.status
      }
    }
  },

  // Atualizar usuário
  async update(userId, userData) {
    try {
      console.log('🔄 Atualizando usuário:', userId, userData)
      const response = await api.put(`/usuarios/${userId}`, userData)
      console.log('✅ Usuário atualizado:', response.data)
      
      return {
        success: true,
        data: response.data,
        message: 'Perfil atualizado com sucesso!'
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error)
      console.error('❌ Resposta do servidor:', error.response?.data)
      console.error('❌ Status:', error.response?.status)
      
      let errorMessage = 'Erro ao atualizar perfil'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return {
        success: false,
        message: errorMessage,
        details: error.response?.data?.details || error.message,
        status: error.response?.status
      }
    }
  },

  // Buscar todos os usuários
  async getAll() {
    try {
      const response = await api.get('/usuarios')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao buscar usuários',
        details: error.response?.data?.details || error.message
      }
    }
  },

  // Buscar usuário por ID
  async getById(id) {
    try {
      const response = await api.get(`/usuarios/${id}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao buscar usuário',
        details: error.response?.data?.details || error.message
      }
    }
  },

  // Atualizar usuário
  async update(id, userData) {
    try {
      const response = await api.put(`/usuarios/${id}`, userData)
      return {
        success: true,
        data: response.data,
        message: 'Usuário atualizado com sucesso!'
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao atualizar usuário',
        details: error.response?.data?.details || error.message
      }
    }
  },

  // Deletar usuário
  async delete(id) {
    try {
      const response = await api.delete(`/usuarios/${id}`)
      return {
        success: true,
        message: 'Usuário deletado com sucesso!'
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao deletar usuário',
        details: error.response?.data?.details || error.message
      }
    }
  }
}

// Serviços de Evento (para uso futuro)
export const eventService = {
  async create(eventData) {
    try {
      const response = await api.post('/eventos', eventData)
      return {
        success: true,
        data: response.data,
        message: 'Evento criado com sucesso!'
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao criar evento',
        details: error.response?.data?.details || error.message
      }
    }
  },

  async getAll() {
    try {
      const response = await api.get('/eventos')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao buscar eventos',
        details: error.response?.data?.details || error.message
      }
    }
  }
}

export default api