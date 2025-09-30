<template>
    <div class="min-h-screen flex flex-col justify-center items-center gap-8 px-4">
        <!-- Seção de Boas-vindas -->
        <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div :class="[
                'p-6 rounded-lg shadow-md transition-colors',
                dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            ]">
                <h2 class="text-2xl font-bold mb-4">Bem-vindo ao Eclipse</h2>
                <p class="mb-4">
                    Descubra eventos incríveis e compre seus ingressos com facilidade.
                </p>
                <router-link 
                    to="/events"
                    class="inline-block bg-yellow-500 cursor-pointer text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium"
                >
                    Explore Eventos
                </router-link>
            </div>

            <div :class="[
                'p-6 rounded-lg shadow-md transition-colors',
                dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            ]">
                <h2 class="text-2xl font-bold mb-4">O que é o Eclipse?</h2>
                <p class="mb-4">O Eclipse é um site de vendas de ingressos voltado para eventos na cidade de Boa Viagem.
                    A plataforma facilita o acesso do público a shows, festas, palestras e outras atrações locais,
                    reunindo tudo em um só lugar.</p>
            </div>
        </div>

        <!-- Seção de Eventos Recentes -->
        <div v-if="eventosRecentes.length > 0" class="w-full max-w-6xl">
            <div :class="[
                'p-6 rounded-lg shadow-md transition-colors',
                dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            ]">
                <h2 class="text-2xl font-bold mb-6">Eventos Recentes</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div 
                        v-for="evento in eventosRecentes" 
                        :key="evento.id"
                        @click="verEvento(evento)"
                        class="cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                        :class="dark ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'"
                    >
                        <!-- Imagem do evento -->
                        <div class="h-32 relative overflow-hidden">
                            <img 
                                v-if="evento.imagem"
                                :src="evento.imagem" 
                                :alt="evento.titulo"
                                class="w-full h-full object-cover"
                            />
                            <div 
                                v-else
                                class="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center"
                            >
                                <svg class="w-8 h-8 text-white opacity-70" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>

                        <!-- Conteúdo do card -->
                        <div class="p-4">
                            <h3 class="font-semibold mb-2 truncate" :class="dark ? 'text-white' : 'text-gray-900'">
                                {{ evento.titulo }}
                            </h3>
                            
                            <div class="space-y-1 text-sm" :class="dark ? 'text-gray-300' : 'text-gray-600'">
                                <div class="flex items-center">
                                    <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <span class="truncate">{{ evento.endereco }}</span>
                                </div>
                                
                                <div class="flex items-center">
                                    <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <span>{{ formatDate(evento.dataEvento) }}</span>
                                </div>
                            </div>

                            <!-- Preço mais baixo -->
                            <div v-if="evento.tiposIngressos && evento.tiposIngressos.length > 0" class="mt-3">
                                <span class="text-sm font-medium" :class="dark ? 'text-green-400' : 'text-green-600'">
                                    A partir de R$ {{ formatPrice(Math.min(...evento.tiposIngressos.map(i => i.preco))) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="text-center mt-6">
                    <router-link 
                        to="/events"
                        class="inline-block bg-purple-500 cursor-pointer text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors duration-200 font-medium"
                    >
                        Ver Todos os Eventos
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "HomeCard",
    props: {
        dark: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            eventosRecentes: []
        };
    },
    mounted() {
        this.loadEventosRecentes();
    },
    methods: {
        loadEventosRecentes() {
            try {
                const eventosData = localStorage.getItem('eventos');
                
                if (eventosData) {
                    const eventos = JSON.parse(eventosData);
                    // Pega os 3 eventos mais recentes (por data de criação)
                    this.eventosRecentes = eventos
                        .filter(evento => evento.status === 'ativo' && evento.publicado === true)
                        .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
                        .slice(0, 3);
                    
                    console.log('🏠 Eventos recentes carregados na Home:', this.eventosRecentes.length);
                } else {
                    this.eventosRecentes = [];
                }
            } catch (error) {
                console.error('❌ Erro ao carregar eventos recentes:', error);
                this.eventosRecentes = [];
            }
        },
        
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        formatPrice(price) {
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(price);
        },
        
        verEvento(evento) {
            this.$router.push({
                name: 'EventDetails',
                params: { id: evento.id }
            });
        }
    }
};
</script>