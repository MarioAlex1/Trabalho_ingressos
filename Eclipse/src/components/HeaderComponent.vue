<template>
  <header
    class="bg-black p-2 md:p-4 flex flex-col md:flex-row items-center justify-between flex-wrap"
  >
    <!-- Logo -->
    <div
      class="flex items-center mb-2 md:mb-0 md:justify-start justify-center w-full md:w-auto"
    >
      <img
        :src="logo"
        alt="Logo Eclipse"
        class="h-14 w-14 md:h-20 md:w-32 object-contain"
      />
    </div>
    <!-- Menu -->
    <nav class="hidden md:flex flex-row items-center space-x-6">
      <a href="#" class="text-yellow-500 underline">Início</a>
      <a href="#" class="flex items-center text-white hover:text-yellow-500">
        <span class="text-xl mr-1">＋</span> Criar evento
      </a>
      <a href="#" class="flex items-center text-white hover:text-yellow-500">
        <!-- Calendar Icon SVG -->
        <svg
          class="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="18"
            rx="2"
            stroke="currentColor"
            fill="none"
          />
          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" />
        </svg>
        Meus Eventos
      </a>
      <a href="#" class="flex items-center text-white hover:text-yellow-500">
        <!-- Ticket Icon SVG -->
        <svg
          class="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <rect
            x="2"
            y="7"
            width="20"
            height="10"
            rx="2"
            stroke="currentColor"
            fill="none"
          />
          <path d="M7 7v10M17 7v10" stroke="currentColor" />
        </svg>
        Meus Ingressos
      </a>
    </nav>
    <!-- Menu Icon -->
    <div class="mt-2 md:mt-0">
      <Sidebar />
    </div>
  </header>
</template>
<script>
import Sidebar from "./Sidebar.vue";
// import logo from "@/assets/Logo1.png";
const logo = '/src/assets/Logo1.png'; // Caminho relativo temporário

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      logo,
    };
  },
};
</script>
