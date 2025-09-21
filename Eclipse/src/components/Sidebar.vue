<template>
  <div class="text-center">
    <button
      class="inline-flex items-center justify-center p-2 rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
      type="button"
      @click="isOpen = true"
      aria-label="Abrir menu"
    >
      <svg
        class="w-7 h-7"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
      </svg>
    </button>
  </div>

  <transition name="sidebar-slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 z-40 w-4/5 sm:w-2/3 md:w-1/2 lg:w-64 h-screen p-4 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg"
      tabindex="-1"
      aria-labelledby="drawer-navigation-label"
    >
      <div class="flex items-center justify-between mb-4">
        <h5
          id="drawer-navigation-label"
          class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
        >
          Menu
        </h5>
        <button
          type="button"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          @click="isOpen = false"
        >
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="sr-only">Close menu</span>
        </button>
      </div>
      <div class="py-4 overflow-y-auto">
        <ul class="space-y-2 font-medium">
          <li>
            <a href="#" class="flex items-center p-2 text-yellow-500 underline rounded-lg group">
              Início
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-2 text-white hover:text-yellow-500 rounded-lg group">
              <span class="text-xl mr-1">＋</span> Criar evento
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-2 text-white hover:text-yellow-500 rounded-lg group">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" fill="none" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" />
              </svg>
              Meus Eventos
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-2 text-white hover:text-yellow-500 rounded-lg group">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" fill="none" />
                <path d="M7 7v10M17 7v10" stroke="currentColor" />
              </svg>
              Meus Ingressos
            </a>
          </li>
        </ul>
      </div>
      <Switch
        v-model="enabled"
        @click="onToggle"
        :class="enabled ? 'bg-slate-300' : 'bg-slate-600'"
        class="relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
      >
        <span class="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          :class="enabled ? 'translate-x-9' : 'translate-x-0'"
          class="pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
        />
      </Switch>
    </div>
  </transition>
</template>

<style>
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.sidebar-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.sidebar-slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.sidebar-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.sidebar-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

<script>
import { Switch } from "@headlessui/vue";
export default {
  components: { Switch },

  data() {
    return {
      isOpen: false,
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
