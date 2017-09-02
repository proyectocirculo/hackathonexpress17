<template>
  <main class="opcion">
    <header class="page-header">
      <h2>{{ punto.name }}</h2>
      <router-link to="/inicio" class="btn btn-red">VOLVER</router-link>
    </header>
    <div class="page-content">
      <div class="background-image full-container" :style="bgImage(punto.images.initial)"></div>
      <div v-if="state === 'success'" class="background-image full-container" :style="bgImage(punto.images.success)"></div>
      <div v-if="state === 'fail'" class="background-image full-container" :style="bgImage(punto.images.fail)"></div>
      <div class="background-image full-container" :style="bgImage('pov.png')"></div>
      <div v-if="state === 'success'" class="filter filter-green"></div>
      <div v-if="state === 'fail'" class="filter filter-red"></div>
      <div class="dialog__container" v-if="state === 'initial'">
        <transition
          enter-active-class="animated slideInUp"
          leave-active-class="animated slideOutDown"
        >
          <div v-if="dialog" class="dialog">
            <article class="dialog__content">
              <p>{{ punto.description }}</p>
            </article>
            <ul class="dialog__options">
              <li v-for="(item, index) in punto.options">
                <a @click="selectOption(item)" class="btn btn-magenta">{{ item.text }}</a>
              </li>
            </ul>
          </div>
        </transition>
      </div>
      <!-- Mensaje successs -->
      <div class="dialog__container" v-if="state !== 'initial'">
        <transition
          enter-active-class="animated slideInUp"
          leave-active-class="animated slideOutDown"
        >
          <div v-if="dialog" class="dialog">
            <article class="dialog__content">
              <div class="section-header">
                <h2 v-if="state === 'success'">Correcto!</h2>
                <h2 v-if="state === 'fail'">Incorrecto!</h2>
                <p>{{ punto.correctOption.description }}</p>
              </div>
              <h3>El <span :class="{ red: (state === 'fail'), green: (state === 'success') }">{{ selectedOption.probs }}</span> de la gente selecciona esta opcion</h3>
              <router-link to="/inicio" class="btn" :class="{ 'btn-red': (state === 'fail'), 'btn-green': (state === 'success') }">VOLVER</router-link>
            </article>
          </div>
        </transition>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'Opcion',
  data() {
    return {
      dialog: false,
      state: 'initial',
      selectedOption: false,
    };
  },
  computed: {
    puntos() {
      return this.$store.state.puntos;
    },
    punto() {
      return this.puntos.filter((punto) => {
        return punto.link === this.$route.params.punto;
      })[0];
    },
  },
  methods: {
    selectOption(item) {
      this.dialog = false;
      this.selectedOption = this.punto.options.filter((option) => {
        return item.name === option.name;
      })[0];
      if (item.name === this.punto.correctOption.name) {
        this.state = 'success';
      } else {
        this.state = 'fail';
      }

      this.$store.commit('setStatus', {
        id: this.punto.id,
        state: this.state,
      });

      setTimeout(() => {
        this.dialog = true;
      }, 500);
    },
  },
  mounted() {
    setTimeout(() => {
      this.dialog = true;
    }, 500);
  },
};
</script>

<style lang="scss">
</style>
