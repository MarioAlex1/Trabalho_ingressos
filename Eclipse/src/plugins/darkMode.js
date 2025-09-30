import lightBg from "@/assets/homebg.jpg";
import darkBg from "@/assets/darkHomebg.jpg";

// Estado global reativo
const state = {
  isDark: false,
  currentBackground: lightBg,
};

// Plugin de Dark Mode
export default {
  install(app) {
    // Carregar estado do localStorage
    const loadDarkModeFromStorage = () => {
      if (typeof window !== "undefined") {
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode !== null) {
          const isEnabled = JSON.parse(savedMode);
          state.isDark = isEnabled;
          state.currentBackground = isEnabled ? darkBg : lightBg;

          // Aplicar classe dark no documento
          if (isEnabled) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      }
    };

    // Salvar no localStorage
    const saveDarkModeToStorage = (isEnabled) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", JSON.stringify(isEnabled));

        // Aplicar classe dark no documento
        if (isEnabled) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    // Carregar estado inicial
    loadDarkModeFromStorage();

    // Disponibilizar métodos globalmente
    app.config.globalProperties.$darkMode = {
      // Getter para o estado
      get isDark() {
        return state.isDark;
      },
      get currentBackground() {
        return state.currentBackground;
      },

      // Método para alternar dark mode
      toggle(enabled) {
        console.log("Plugin toggle chamado com:", enabled);
        state.isDark = enabled;
        state.currentBackground = enabled ? darkBg : lightBg;
        saveDarkModeToStorage(enabled);
        console.log("Estado atualizado para:", state.isDark);

        // Emitir evento customizado para notificar todos os componentes
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("darkmode-changed", {
              detail: {
                isDark: enabled,
                currentBackground: state.currentBackground,
              },
            })
          );
        }
      },
    };

    // Adicionar propriedades reativas ao prototype para facilitar o acesso
    app.mixin({
      data() {
        return {
          darkModeState: {
            isDark: state.isDark,
            currentBackground: state.currentBackground,
          },
        };
      },
      computed: {
        isDark() {
          return state.isDark;
        },
        currentBackground() {
          return state.currentBackground;
        },
      },
      mounted() {
        // Escutar mudanças do dark mode
        if (typeof window !== "undefined") {
          window.addEventListener("darkmode-changed", this.onDarkModeChanged);
        }
        // Sincronizar estado inicial
        this.darkModeState.isDark = state.isDark;
        this.darkModeState.currentBackground = state.currentBackground;
      },
      beforeUnmount() {
        // Limpar listener
        if (typeof window !== "undefined") {
          window.removeEventListener(
            "darkmode-changed",
            this.onDarkModeChanged
          );
        }
      },
      methods: {
        toggleDarkMode(enabled) {
          console.log(
            "toggleDarkMode chamado com:",
            enabled,
            "estado atual:",
            state.isDark
          );
          this.$darkMode.toggle(enabled);
        },
        onDarkModeChanged(event) {
          console.log("Evento darkmode-changed recebido:", event.detail);
          // Forçar atualização dos dados reativos
          this.darkModeState.isDark = event.detail.isDark;
          this.darkModeState.currentBackground = event.detail.currentBackground;
          this.$forceUpdate();
        },
      },
    });
  },
};
