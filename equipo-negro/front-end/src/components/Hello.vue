<template>
  <div>
    <div class="home-welcome">
      <video autoplay loop muted id="home-video"></video>
      <div class="filter"></div>
      <section class="content">
        <header class="section-header">
          <img class="main-logo" :src="imagesPath('logo-01.svg')" alt="">
          <h2>Programa de capacitación en SEGURIDAD VIAL</h2>
        </header>
        <router-link to="/inicio" class="btn btn-magenta">EMPEZAR</router-link>
      </section>
    </div>
  </div>
</template>

<script>
import './Plugins/bideo';

export default {
  name: 'home',
  mounted() {
    /* eslint-disable */
    var bv = new Bideo();
    bv.init({
      // Video element
      videoEl: document.querySelector('#home-video'),
      // Container element
      container: document.querySelector('.home-welcome'),
      // Resize
      resize: true,
      // autoplay: false,
      isMobile: window.matchMedia('(max-width: 768px)').matches,
      // Array of objects containing the src and type
      // of different video formats to add
      src: [
        {
          src: '/static/videos/home.mp4',
          type: 'video/mp4'
        },
      ],
      // What to do once video loads (initial frame)
      onLoad: function () {
        // document.querySelector('#video_cover').style.display = 'none';
      }
    });
  },
};
</script>

<style lang="scss">
</style>
