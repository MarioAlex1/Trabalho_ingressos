<script>
import router from './router'

export default {
  name: 'App'
}
</script>

<template>
  <div :class="{ 'dark': isDark }">
    <router-view />
  </div>
</template>
