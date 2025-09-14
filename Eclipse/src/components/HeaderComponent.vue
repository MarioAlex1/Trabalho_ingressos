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
    <div>
      <Switch v-model="enabled" @click="onToggle"
        :class="enabled ? 'bg-slate-300' : 'bg-slate-600'" class="relative
        inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full
        border-2 border-transparent transition-colors duration-200 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75" >
        <span class="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          :class="enabled ? 'translate-x-9' : 'translate-x-0'"
          class="pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
        />
      </Switch>
    </div>
  </header>
</template>

<script>
import logo from "@/assets/Logo1.png";
import { Switch } from "@headlessui/vue";

export default {
  components: {
    Switch,
  },
  data() {
    return {
      logo,
      enabled: true,
    };
  },
  methods: {
  onToggle() {
    this.$emit('toggle-dark', this.enabled)
  }
}
};
</script>
