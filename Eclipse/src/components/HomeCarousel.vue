<template>
  <div>
    <div :class="['relative max-w-3xl align-center mx-auto mt-6', dark ? 'bg-gray-900' : 'bg-white']">
      <!-- Carousel wrapper -->
      <div :class="['relative h-56 overflow-hidden rounded-lg md:h-96 border-2', dark ? 'border-gray-800' : 'border-white']">
        <!-- Loading state -->
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div class="animate-pulse text-gray-500">Carregando eventos...</div>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="absolute inset-0 flex items-center justify-center bg-red-100">
          <div class="text-red-500">{{ error }}</div>
        </div>
        
        <!-- Empty state -->
        <div v-else-if="eventos.length === 0" class="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div class="text-gray-500">Nenhum evento disponível</div>
        </div>
        
        <!-- Slides dos eventos -->
        <div
          v-for="(evento, index) in eventos"
          :key="evento.id"
          :class="[
            'absolute inset-0 transition-transform duration-700 ease-in-out',
            index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          ]"
        >
          <img
            :src="evento.imagem || '/api/placeholder/800/600'"
            class="absolute block w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            :alt="evento.titulo"
            @error="onImageError"
          />
          <!-- Overlay para melhorar contraste do texto -->
          <div :class="['absolute inset-0', dark ? 'bg-black bg-opacity-40' : 'bg-black bg-opacity-20']"></div>
        </div>
      </div>

      <!-- Slider indicators -->
      <div v-if="eventos.length > 1" class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
        <button
          v-for="(evento, index) in eventos"
          :key="`indicator-${index}`"
          type="button"
          :class="[
            'w-3 h-3 rounded-full transition-colors',
            index === currentSlide 
              ? 'bg-white' 
              : 'bg-white/50 hover:bg-white/75',
          ]"
          :aria-current="index === currentSlide"
          :aria-label="`Slide ${index + 1}: ${evento.titulo}`"
          @click="goToSlideManual(index)"
        ></button>
      </div>

      <!-- Slider controls -->
      <button
        v-if="eventos.length > 1"
        type="button"
        class="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        @click="previousSlideManual"
      >
        <span :class="[
          'inline-flex items-center justify-center w-10 h-10 rounded-full',
          dark ? 'bg-gray-800/60 group-hover:bg-gray-800/80 group-focus:ring-gray-800/70' : 'bg-white/30 group-hover:bg-white/50 group-focus:ring-white'
        ]">
          <svg :class="['w-4 h-4', dark ? 'text-white' : 'text-gray-800']" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
          </svg>
          <span class="sr-only">Anterior</span>
        </span>
      </button>

      <button
        v-if="eventos.length > 1"
        type="button"
        class="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        @click="nextSlideManual"
      >
        <span :class="[
          'inline-flex items-center justify-center w-10 h-10 rounded-full',
          dark ? 'bg-gray-800/60 group-hover:bg-gray-800/80 group-focus:ring-gray-800/70' : 'bg-white/30 group-hover:bg-white/50 group-focus:ring-white'
        ]">
          <svg :class='["w-4 h-4", dark ? "text-white" : "text-gray-800"]' fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
          </svg>
          <span class="sr-only">Próximo</span>
        </span>
      </button>
    </div>

    <!-- Informações do evento atual -->
    <div class="max-w-3xl mx-auto mt-6 text-center">
      <div v-if="currentEvento && !isLoading" class="transition-opacity duration-300">
        <h3 class="text-2xl font-bold mb-2" :class="dark ? 'text-white' : 'text-gray-900'">
          {{ currentEvento.titulo }}
        </h3>
        <p class="text-lg mb-2" :class="dark ? 'text-gray-300' : 'text-gray-600'">
          📍 {{ currentEvento.local || currentEvento.endereco || 'Local não informado' }}
        </p>
        <p class="text-base mb-3" :class="dark ? 'text-gray-400' : 'text-gray-500'">
          {{ currentEvento.descricao || 'Descrição não disponível' }}
        </p>
        <div class="flex justify-center gap-4 flex-wrap">
          <div v-if="currentEvento.data || currentEvento.dataEvento" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z"/>
            </svg>
            {{ formatarData(currentEvento.data || currentEvento.dataEvento) }}
          </div>
          <div v-if="currentEvento.capacidade" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            </svg>
            Capacidade: {{ currentEvento.capacidade }} pessoas
          </div>
          <div v-if="currentEvento.preco" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
            </svg>
            A partir de R$ {{ formatarPreco(currentEvento.preco) }}
          </div>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-if="isLoading" class="py-8">
        <div class="animate-pulse">
          <div class="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
      
      <!-- Error state -->
      <div v-if="error && !isLoading" class="py-8">
        <p class="text-red-500">{{ error }}</p>
        <button 
          @click="loadEventos" 
          class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
      
      <!-- Empty state -->
      <div v-if="!isLoading && !error && eventos.length === 0" class="py-8">
        <p :class="dark ? 'text-gray-400' : 'text-gray-500'">Nenhum evento disponível no momento.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { eventService } from '../services/api.js';

export default {
  name: "HomeCarousel",
  
  props: {
    dark: {
      type: Boolean,
      default: false
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
  
  data() {
    return {
      currentSlide: 0,
      eventos: [],
      intervalId: null,
      isLoading: false,
      error: null
    }
  },

  computed: {
    currentEvento() {
      return this.eventos[this.currentSlide] || null;
    }
  },

  async mounted() {
    await this.loadEventos();
    
    if (this.autoSlide && this.eventos.length > 1) {
      this.startAutoSlide();
    }
  },

  beforeUnmount() {
    this.stopAutoSlide();
  },

  methods: {
    async loadEventos() {
      this.isLoading = true;
      this.error = null;
      
      try {
        console.log('🔄 Carregando eventos...');
        
        // Primeiro tenta carregar do backend
        try {
          const response = await eventService.getAll();
          if (response.success && response.data && response.data.length > 0) {
            // Processa as imagens para usar assets locais se necessário
            this.eventos = response.data.map(evento => {
              const processedImage = this.processImageUrl(evento.imagem);
              console.log(`📸 Evento "${evento.titulo}": 
                Original: ${evento.imagem ? evento.imagem.substring(0, 50) + '...' : 'não definida'}
                Processada: ${processedImage.substring(0, 50) + '...'}`);
              
              return {
                ...evento,
                imagem: processedImage
              };
            });
            
            console.log('✅ Eventos carregados do backend:', this.eventos.length, 'eventos');
            
            // Reset currentSlide se necessário
            if (this.currentSlide >= this.eventos.length) {
              this.currentSlide = 0;
            }
            return;
          }
        } catch (backendError) {
          console.warn('⚠️ Backend indisponível, usando dados locais:', backendError.message);
        }
        
        // Fallback para dados locais com URLs que funcionam no Vite
        this.eventos = [
          {
            id: 1,
            titulo: "Festival de Música 2024",
            descricao: "O maior festival de música da região com artistas nacionais e internacionais",
            local: "Parque da Cidade",
            data: "2024-06-15",
            capacidade: 5000,
            preco: 150,
            imagem: new URL('../assets/carousel-1.svg', import.meta.url).href
          },
          {
            id: 2,
            titulo: "Conferência de Tecnologia",
            descricao: "Evento focado nas últimas tendências em tecnologia e inovação",
            local: "Centro de Convenções",
            data: "2024-07-20",
            capacidade: 800,
            preco: 250,
            imagem: new URL('../assets/carousel-2.svg', import.meta.url).href
          },
          {
            id: 3,
            titulo: "Workshop de Desenvolvimento",
            descricao: "Aprenda as melhores práticas de desenvolvimento web moderno",
            local: "Universidade Federal",
            data: "2024-08-10",
            capacidade: 200,
            preco: 100,
            imagem: new URL('../assets/carousel-3.svg', import.meta.url).href
          },
          {
            id: 4,
            titulo: "Feira de Empreendedorismo",
            descricao: "Conecte-se com empreendedores e descubra novas oportunidades",
            local: "Shopping Center",
            data: "2024-09-05",
            capacidade: 1500,
            preco: 50,
            imagem: new URL('../assets/carousel-4.svg', import.meta.url).href
          },
          {
            id: 5,
            titulo: "Show Beneficente",
            descricão: "Uma noite especial em prol de causas sociais importantes",
            local: "Teatro Municipal",
            data: "2024-10-12",
            capacidade: 600,
            preco: 80,
            imagem: new URL('../assets/carousel-5.svg', import.meta.url).href
          }
        ];
        
        console.log('✅ Eventos carregados (dados locais):', this.eventos);
        
        // Reset currentSlide se necessário
        if (this.currentSlide >= this.eventos.length) {
          this.currentSlide = 0;
        }
        
      } catch (error) {
        console.error('❌ Erro ao carregar eventos:', error);
        this.error = 'Erro ao carregar eventos.';
        this.eventos = [];
      } finally {
        this.isLoading = false;
      }
    },

    getPlaceholderImage() {
      // Placeholder SVG para quando a imagem não carregar
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5FdmVudG88L3RleHQ+PC9zdmc+';
    },

    processImageUrl(imageUrl) {
      if (!imageUrl) {
        return new URL('../assets/carousel-1.svg', import.meta.url).href;
      }
      
      // Se é uma imagem base64 (dados reais dos organizadores), usa diretamente
      if (imageUrl.startsWith('data:')) {
        return imageUrl;
      }
      
      // Se já é um asset processado ou URL absoluta, retorna como está
      if (imageUrl.startsWith('/assets/') || imageUrl.startsWith('http')) {
        return imageUrl;
      }
      
      // Se é uma URL do backend que contém carousel-X.svg, mapeia para assets locais
      const match = imageUrl.match(/carousel-(\d+)\.svg/);
      if (match) {
        return new URL(`../assets/carousel-${match[1]}.svg`, import.meta.url).href;
      }
      
      // Para outras URLs, tenta usar como está ou fallback
      return imageUrl || new URL('../assets/carousel-1.svg', import.meta.url).href;
    },

    nextSlide() {
      if (this.eventos.length > 0) {
        this.currentSlide = (this.currentSlide + 1) % this.eventos.length;
      }
    },

    previousSlide() {
      if (this.eventos.length > 0) {
        this.currentSlide = this.currentSlide === 0 ? this.eventos.length - 1 : this.currentSlide - 1;
      }
    },

    goToSlide(index) {
      if (index >= 0 && index < this.eventos.length) {
        this.currentSlide = index;
      }
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
        if (this.autoSlide && this.eventos.length > 1) {
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
    },

    // Formatação de data
    formatarData(data) {
      if (!data) return '';
      try {
        const date = new Date(data);
        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return data;
      }
    },

    // Formatação de preço
    formatarPreco(preco) {
      if (!preco) return '0,00';
      try {
        return parseFloat(preco).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      } catch (error) {
        return preco;
      }
    },

    // Tratamento de erro de imagem
    onImageError(event) {
      console.warn('Erro ao carregar imagem:', event.target.src);
      // Fallback para imagem padrão
      event.target.src = this.getPlaceholderImage();
    }
  }
}
</script>

