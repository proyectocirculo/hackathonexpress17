<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
    this.$store.dispatch('getPuntos');
  },
};
</script>

<style lang="scss">
  @import "~styles/_main.scss";
</style>
