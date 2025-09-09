<template>
  <header class="bg-black py-3 px-4 flex items-center justify-between">
    <!-- Logo -->
    <div class="flex items-center">
      <img :src="logo" alt="Logo Eclipse" class="h-12 mr-6" />
    </div>
    <!-- Menu -->
    <nav class="flex items-center space-x-6">
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
    <button class="ml-6">
      <svg
        class="w-8 h-8 text-white"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" />
        <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" />
        <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" />
      </svg>
    </button>
  </header>
</template>

<script>
import logo from "@/assets/Logo1.png";
export default {
  data() {
    return { logo };
  },
};
</script>
