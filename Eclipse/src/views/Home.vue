<template>
  <div
    class="min-h-screen bg-repeat bg-center"
    :style="{ backgroundImage: `url(${currentBackground})` }"
    :class="{ 'dark': isDark }"
  >
    <header>
      <HeaderComponent @toggle-dark="toggleDarkMode" />
    </header>

  <HomeCarousel :dark="isDark" />
  <HomeCard :dark="isDark" />
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import lightBg from "@/assets/homebg.jpg";
import darkBg from "@/assets/darkHomebg.jpg";
import HomeCard from "../components/HomeCard.vue";
import HomeCarousel from "../components/HomeCarousel.vue";
import Sidebar from "../components/Sidebar.vue";

export default {
  components: { HeaderComponent, HomeCard, HomeCarousel, Sidebar },
  data() {
    return {
      isDark: false,
      currentBackground: lightBg
    };
  },
  methods: {
    toggleDarkMode(enabled) {
      this.isDark = enabled;
      this.currentBackground = enabled ? darkBg : lightBg;
    }
  }
};
</script>
