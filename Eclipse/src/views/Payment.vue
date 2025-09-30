<template>
  <div 
    class="min-h-screen bg-repeat bg-center transition-all duration-300"
    :style="{ backgroundImage: `url(${currentBackground})` }"
    :class="{ dark: isDark }"
  >
    <HeaderComponent />
    
    <div class="container mx-auto px-4 py-20">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-center mb-8">Finalizar Compra</h1>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Resumo do Pedido -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-4">Resumo do Pedido</h2>
            
            <!-- Evento -->
            <div class="mb-6 p-4 bg-gray-50 rounded">
              <h3 class="font-semibold">{{ evento.titulo }}</h3>
              <p class="text-sm text-gray-600">{{ formatDate(evento.dataEvento) }}</p>
              <p class="text-sm text-gray-600">{{ evento.local }}</p>
            </div>

            <!-- Aviso importante -->
            <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <p class="text-sm text-blue-800">
                <strong>Importante:</strong> Cada cliente pode comprar apenas 1 ingresso por evento.
              </p>
            </div>

            <!-- Detalhes do Ingresso -->
            <div class="border-t border-b py-4">
              <div class="flex justify-between py-3">
                <div>
                  <div class="font-medium">{{ ingressoSelecionado.tipo }}</div>
                  <div class="text-sm text-gray-600">1x {{ ingressoSelecionado.tipo }} para {{ evento.titulo }}</div>
                </div>
                <div class="text-right">
                  <div class="font-bold">R$ {{ totalAmount.toFixed(2) }}</div>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="pt-4">
              <div class="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>R$ {{ totalAmount.toFixed(2) }}</span>
              </div>
              <div class="text-sm text-gray-600">1 ingresso - {{ ingressoSelecionado.tipo }}</div>
            </div>
          </div>

          <!-- Formulário -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-6">Informações de Pagamento</h2>

            <form @submit.prevent="processPayment" class="space-y-6">
              <!-- Dados Pessoais -->
              <div>
                <h3 class="text-lg font-semibold mb-4">Dados Pessoais</h3>
                <div class="grid grid-cols-2 gap-4">
                  <input
                    v-model="paymentData.nome"
                    type="text"
                    required
                    placeholder="Nome Completo *"
                    class="w-full px-3 py-2 border rounded"
                  />
                  <input
                    v-model="paymentData.cpf"
                    type="text"
                    required
                    placeholder="CPF *"
                    class="w-full px-3 py-2 border rounded"
                  />
                  <input
                    v-model="paymentData.email"
                    type="email"
                    required
                    placeholder="Email *"
                    class="w-full px-3 py-2 border rounded col-span-2"
                  />
                </div>
              </div>

              <!-- Dados do Cartão -->
              <div>
                <h3 class="text-lg font-semibold mb-4">Dados do Cartão</h3>
                <div class="grid grid-cols-2 gap-4">
                  <input
                    v-model="paymentData.numeroCartao"
                    type="text"
                    required
                    placeholder="Número do Cartão *"
                    class="w-full px-3 py-2 border rounded col-span-2"
                  />
                  <input
                    v-model="paymentData.validade"
                    type="text"
                    required
                    placeholder="Validade *"
                    class="w-full px-3 py-2 border rounded"
                  />
                  <input
                    v-model="paymentData.cvv"
                    type="text"
                    required
                    placeholder="CVV *"
                    class="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <!-- Botões -->
              <div class="flex gap-4 pt-6">
                <button
                  type="button"
                  @click="goBack"
                  class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  :disabled="!canPurchase || isProcessing"
                  class="flex-1 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  <span v-if="!isProcessing">
                    Finalizar Compra - R$ {{ totalAmount.toFixed(2) }}
                  </span>
                  <span v-else>Processando...</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Mensagens -->
        <div v-if="successMessage" class="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-center">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "../components/HeaderComponent.vue";
import { darkModeState } from "@/plugins/darkModeSimple.js";

export default {
  name: 'Payment',
  components: { HeaderComponent },
  data() {
    return {
      evento: {},
      ingressoSelecionado: {
        id: null,
        tipo: 'Ingresso Padrão',
        preco: 0
      },
      isProcessing: false,
      successMessage: '',
      errorMessage: '',
      paymentData: {
        nome: '',
        cpf: '',
        email: '',
        numeroCartao: '',
        validade: '',
        cvv: ''
      }
    };
  },
  computed: {
    isDark() {
      return darkModeState?.isDark || false;
    },
    currentBackground() {
      return darkModeState?.currentBackground || '';
    },
    totalAmount() {
      return parseFloat(this.ingressoSelecionado?.preco || this.evento?.preco || 0);
    },
    canPurchase() {
      return this.evento && 
             this.paymentData.nome.trim() && 
             this.paymentData.cpf.trim() && 
             this.paymentData.email.trim() && 
             this.paymentData.numeroCartao.trim() && 
             this.paymentData.validade.trim() && 
             this.paymentData.cvv.trim() &&
             !this.errorMessage.includes('já possui um ingresso');
    }
  },
  mounted() {
    // Verificação simples se usuário está logado
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData || !userData.id) {
      this.$router.push('/login');
      return;
    }
    
    this.loadEventData();
    this.checkExistingTicket();
  },
  methods: {
    async checkExistingTicket() {
      // Validação removida para permitir múltiplas compras por evento
      // Os clientes podem comprar diferentes tipos de ingressos para o mesmo evento
      console.log('🎫 Verificação de ingresso existente desabilitada - permitindo múltiplas compras');
      return false;
    },
    
    loadEventData() {
      // Debug da query completa
      console.log('🔍 Query completa da rota:', this.$route.query);
      console.log('🔍 Params da rota:', this.$route.params);
      
      // Capturar dados do ingresso selecionado da query
      const query = this.$route.query;
      if (query.ingressoId) {
        this.ingressoSelecionado = {
          id: parseInt(query.ingressoId),
          tipo: query.tipo || 'Ingresso Padrão',
          preco: parseFloat(query.preco || 0)
        };
        console.log('✅ Ingresso selecionado:', this.ingressoSelecionado);
      } else {
        console.error('❌ Nenhum ingressoId encontrado na query:', query);
        this.errorMessage = 'Dados do ingresso não encontrados. Por favor, selecione novamente o tipo de ingresso.';
      }
      
      // Carregar evento diretamente do backend
      this.loadFromAPI();
    },
    
    async loadFromAPI() {
      const eventoId = this.$route.params.eventoId;
      if (eventoId) {
        try {
          console.log('🔄 Carregando evento da API, ID:', eventoId);
          const response = await fetch(`http://localhost:3001/api/eventos/${eventoId}`);
          if (response.ok) {
            this.evento = await response.json();
            console.log('✅ Evento carregado da API:', this.evento);
          } else {
            throw new Error('Evento não encontrado');
          }
        } catch (error) {
          console.error('❌ Erro ao carregar evento da API:', error);
          this.errorMessage = 'Evento não encontrado. Redirecionando para lista de eventos...';
          
          // Redirecionar para eventos após 3 segundos
          setTimeout(() => {
            this.$router.push('/events');
          }, 3000);
        }
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    async processPayment() {
      if (!this.canPurchase) return;
      
      const hasExistingTicket = await this.checkExistingTicket();
      if (hasExistingTicket) return;
      
      this.isProcessing = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      try {
        const usuario = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Debug dos dados
        console.log('🔍 Debug - Usuario raw:', localStorage.getItem('user'));
        console.log('🔍 Debug - Usuario:', usuario);
        console.log('🔍 Debug - Evento:', this.evento);
        console.log('🔍 Debug - Ingresso Selecionado:', this.ingressoSelecionado);
        
        // Validar dados obrigatórios
        if (!usuario || !usuario.id) {
          this.errorMessage = 'Você precisa estar logado para comprar ingressos. Redirecionando para login...';
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
          return;
        }
        if (!this.evento.id) {
          throw new Error('Evento não identificado');
        }
        if (!this.ingressoSelecionado.id) {
          throw new Error('Tipo de ingresso não selecionado. Por favor, volte e selecione um tipo de ingresso.');
        }
        
        const ingressoData = {
          usuarioId: usuario.id,
          eventoId: this.evento.id,
          tipoIngressoId: this.ingressoSelecionado.id,
          preco: this.totalAmount,
          formaPagamento: 'Cartão de Crédito'
        };
        
        console.log('✅ Criando ingresso:', ingressoData);
        
        const response = await fetch('http://localhost:3001/api/ingressos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ingressoData)
        });
        
        if (response.ok) {
          const ingresso = await response.json();
          this.successMessage = `Pagamento realizado com sucesso! Código do ingresso: ${ingresso.codigo}`;
          
          setTimeout(() => {
            this.$router.push('/');
          }, 3000);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao processar pagamento');
        }
        
      } catch (error) {
        console.error('❌ Erro no pagamento:', error);
        this.errorMessage = 'Erro ao processar pagamento: ' + error.message;
      } finally {
        this.isProcessing = false;
      }
    },
    
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
