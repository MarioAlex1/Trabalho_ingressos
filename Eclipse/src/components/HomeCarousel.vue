<template>
  <div class="relative max-w-3xl align-center mx-auto mt-6">
    <!-- Carousel wrapper -->
    <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
      <!-- Slides -->
      <div
        v-for="(location, index) in locations"
        :key="index"
        :class="[
          'absolute inset-0 transition-transform duration-700 ease-in-out',
          index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'
        ]"
      >
        <img
          :src="location.image"
          class="absolute block w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          :alt="location.name"
        />
        <!-- Overlay para melhorar contraste do texto -->
        <div class="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
    </div>

    <!-- Slider indicators -->
    <div class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
      <button
        v-for="(location, index) in locations"
        :key="`indicator-${index}`"
        type="button"
        :class="[
          'w-3 h-3 rounded-full transition-colors',
          index === currentSlide 
            ? 'bg-white' 
            : 'bg-white/50 hover:bg-white/75',
        ]"
        :aria-current="index === currentSlide"
        :aria-label="`Slide ${index + 1}: ${location.name}`"
        @click="goToSlide(index)"
      ></button>
    </div>

    <!-- Slider controls -->
    <button
      type="button"
      class="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      @click="previousSlide"
    >
      <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
        <svg class="w-4 h-4 text-white dark:text-gray-800" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
        </svg>
        <span class="sr-only">Anterior</span>
      </span>
    </button>

    <button
      type="button"
      class="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      @click="nextSlide"
    >
      <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
        <svg :class='["w-4 h-4", dark ? "text-white" : "text-gray-800"]' fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
        </svg>
        <span class="sr-only">Próximo</span>
      </span>
    </button>
  </div>

  <!-- Informações da localização atual -->
  <div class="max-w-3xl mx-auto mt-6 text-center">
    <div v-if="currentLocation" class="transition-opacity duration-300">
      <h3 class="text-2xl font-bold mb-2" :class="dark ? 'text-white' : 'text-gray-900'">
        {{ currentLocation.name }}
      </h3>
      <p class="text-lg mb-2" :class="dark ? 'text-gray-300' : 'text-gray-600'">
        {{ currentLocation.address }}
      </p>
      <p class="text-base" :class="dark ? 'text-gray-400' : 'text-gray-500'">
        {{ currentLocation.description }}
      </p>
      <div v-if="currentLocation.capacity" class="mt-2">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          Capacidade: {{ currentLocation.capacity }} pessoas
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// Dados temporários - serão substituídos pela integração com o backend
const defaultLocations = [
  {
    id: 1,
    name: "Centro de Convenções Metropolitan",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    description: "Moderno centro de convenções com tecnologia de ponta e localização privilegiada no coração de São Paulo.",
    image: "/api/placeholder/800/600",
    capacity: 5000
  },
  {
    id: 2,
    name: "Teatro Municipal",
    address: "Praça Ramos de Azevedo - Centro, São Paulo, SP",
    description: "Tradicional teatro com arquitetura clássica, ideal para eventos culturais e apresentações artísticas.",
    image: "/api/placeholder/800/600",
    capacity: 1500
  },
  {
    id: 3,
    name: "Espaço Jardim Premium",
    address: "Rua dos Jardins, 500 - Jardins, São Paulo, SP",
    description: "Elegante espaço ao ar livre com jardins paisagísticos, perfeito para casamentos e eventos sociais.",
    image: "/api/placeholder/800/600",
    capacity: 800
  },
  {
    id: 4,
    name: "Auditório Corporativo Tech Hub",
    address: "Av. Faria Lima, 2000 - Itaim Bibi, São Paulo, SP",
    description: "Auditório moderno com recursos audiovisuais avançados, ideal para conferências e eventos corporativos.",
    image: "/api/placeholder/800/600",
    capacity: 300
  },
  {
    id: 5,
    name: "Salão de Festas Vista Panorâmica",
    address: "Av. Atlântica, 100 - Copacabana, Rio de Janeiro, RJ",
    description: "Salão com vista espetacular para o mar, ambiente sofisticado para eventos exclusivos.",
    image: "/api/placeholder/800/600",
    capacity: 200
  }
];

export default {
  name: "EventLocationsCarousel",
  data() {
    return {
      currentSlide: 0,
      locations: [],
      intervalId: null,
      isLoading: false,
      error: null
    }
  },

  props: {
    dark: {
      type: Boolean,
      default: false
    },
    // Props para integração com backend
    apiEndpoint: {
      type: String,
      default: '/api/event-locations'
    },
    autoSlide: {
      type: Boolean,
      default: true
    },
    slideInterval: {
      type: Number,
      default: 5000
    }
  },

  computed: {
    currentLocation() {
      return this.locations[this.currentSlide] || null;
    }
  },

  async mounted() {
    await this.loadLocations();
    
    if (this.autoSlide && this.locations.length > 1) {
      this.startAutoSlide();
    }
  },

  beforeUnmount() {
    this.stopAutoSlide();
  },

  methods: {
    // Método para carregar localizações do backend
    async loadLocations() {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Aqui você fará a chamada para sua API
        // const response = await fetch(this.apiEndpoint);
        // const data = await response.json();
        // this.locations = data;
        
        // Por enquanto, usando dados de exemplo
        this.locations = defaultLocations;
        
      } catch (error) {
        console.error('Erro ao carregar localizações:', error);
        this.error = 'Erro ao carregar localizações';
        // Em caso de erro, usar dados padrão
        this.locations = defaultLocations;
      } finally {
        this.isLoading = false;
      }
    },

    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.locations.length;
    },

    previousSlide() {
      this.currentSlide = this.currentSlide === 0 ? this.locations.length - 1 : this.currentSlide - 1;
    },

    goToSlide(index) {
      this.currentSlide = index;
    },

    startAutoSlide() {
      this.intervalId = setInterval(() => {
        this.nextSlide();
      }, this.slideInterval);
    },

    stopAutoSlide() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },

    // Método para pausar auto-slide quando usuário interage
    pauseAutoSlide() {
      this.stopAutoSlide();
      // Reinicia após 10 segundos de inatividade
      setTimeout(() => {
        if (this.autoSlide && this.locations.length > 1) {
          this.startAutoSlide();
        }
      }, 10000);
    },

    // Override dos métodos de navegação para pausar auto-slide
    nextSlideManual() {
      this.pauseAutoSlide();
      this.nextSlide();
    },

    previousSlideManual() {
      this.pauseAutoSlide();
      this.previousSlide();
    },

    goToSlideManual(index) {
      this.pauseAutoSlide();
      this.goToSlide(index);
    }
  }
}
</script>

