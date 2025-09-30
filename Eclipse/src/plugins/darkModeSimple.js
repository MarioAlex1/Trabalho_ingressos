import { reactive } from 'vue'
import lightBg from "@/assets/homebg.jpg"
import darkBg from "@/assets/darkHomebg.jpg"

// Estado global reativo usando Vue 3
export const darkModeState = reactive({
  isDark: false,
  currentBackground: lightBg
})

// Função para carregar do localStorage
const loadFromStorage = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      const isEnabled = JSON.parse(saved)
      darkModeState.isDark = isEnabled
      darkModeState.currentBackground = isEnabled ? darkBg : lightBg
      
      if (isEnabled) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }
}

// Função para salvar no localStorage
const saveToStorage = (enabled) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('darkMode', JSON.stringify(enabled))
    if (enabled) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

// Função para alternar dark mode
export const toggleDarkMode = (enabled) => {
  console.log('toggleDarkMode simples chamado:', enabled)
  darkModeState.isDark = enabled
  darkModeState.currentBackground = enabled ? darkBg : lightBg
  saveToStorage(enabled)
}

// Carregar estado inicial
loadFromStorage()

// Plugin simplificado
export default {
  install(app) {
    app.config.globalProperties.$darkMode = {
      state: darkModeState,
      toggle: toggleDarkMode
    }
    
    app.mixin({
      computed: {
        isDark() {
          return darkModeState.isDark
        },
        currentBackground() {
          return darkModeState.currentBackground
        }
      },
      methods: {
        toggleDarkMode(enabled) {
          toggleDarkMode(enabled)
        }
      }
    })
  }
}