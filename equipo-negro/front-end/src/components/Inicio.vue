<template>
  <main class="inicio">
    <el-dialog
      title="SEGURIDAD VIAL"
      :visible.sync="dialogVisible"
      size="large">      
      <p>El siguiente mapa muestra puntos conflictivos para la SEGURIDAD VIAL dentro de la ciudad.</p>
      <p>Estos puntos son productos de datos oficiales de la Municipalidad de Resistencia.</p>
      <p>Seleccione cualquier punto para iniciar el test: </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="btn btn-green" @click="dialogVisible = false">Aceptar</el-button>
      </span>
    </el-dialog>
    <header class="page-header">
      <router-link to="/" class="btn btn-red">VOLVER</router-link>
      <h3>Bienvenidos al simulador virtual de SEGURIDAD VIAL.</h3>
      <p>El propósito de este sistema es concientizar y educar a las personas acerca de situaciones comunes de SEGURIDAD VIAL.</p>
    </header>
    <div class="page-content">
      <div id="map"></div>
    </div>
    <div class="resultados" v-if="done.length > 0">
      <header class="resultados__header">
        <h2>Resultados</h2>
      </header>
      <div class="resultados__content">
        <ul class="resultados-list">
          <li v-for="(item, index) in done" class="resultados-list__item">
            <h3><strong>{{ (index + 1) }} - </strong>{{ item.name }}</h3>
            <h4 v-if="item.state === 'success'" class="green">Respuesta: Correcta</h4>
            <h4 v-if="item.state === 'fail'" class="red">Respuesta: Incorrecta</h4>
            <p>{{ getAnswer(item, item.state) }}</p>
          </li>
        </ul>
        <div class="resultados__chart">
          <vue-circle
            id="circle"
            :progress="percentage"
            :size="100"
            :reverse="false"
            line-cap="round"
            :fill="fill"
            empty-fill="rgba(0, 0, 0, .1)"
            :animation-start-value="0.0"
            :start-angle="0"
            insert-mode="append"
            :thickness="5"
            inner-text=""
            :show-percent="true">
          </vue-circle>
          <h3>Puntaje: {{ percentage }}% de respuestas correctas.</h3>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import GoogleMapsLoader from 'google-maps';
import VueCircle from 'vue2-circle-progress';

export default {
  name: 'Inicio',
  data() {
    return {
      dialogVisible: false,
      fill: { gradient: ['green'] },
    };
  },
  computed: {
    percentage() {
      return Math.ceil((this.correctas.length / this.done.length) * 100);
    },
    puntos() {
      return this.$store.state.puntos;
    },
    correctas() {
      return this.puntos.filter((punto) => {
        return punto.state === 'success';
      });
    },
    done() {
      return this.puntos.filter((punto) => {
        return punto.state !== 'pending';
      });
    },
  },
  methods: {
    getAnswer(item, itemState) {
      let returnOption;
      if (itemState === 'success') {
        returnOption = item.options.filter((option) => {
          return option.name === item.correctOption.name;
        })[0];
        return `Vos y el ${returnOption.probs} de la gente respondio esta pregunta correctamente.`;
      }
      returnOption = item.options.filter((option) => {
        return option.name !== item.correctOption.name;
      })[0];
      return `Vos y el ${returnOption.probs} de la gente respondio esta pregunta incorrectamente.`;
    },
  },
  mounted() {
    GoogleMapsLoader.KEY = 'AIzaSyDhBvBDCDM1cHWB7-vzSRZP7odkeU0SRGg';
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

    GoogleMapsLoader.load((google) => {
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: -27.4515035, lng: -58.9836923 },
      });

      this.puntos.map((punto) => {
        let image;
        switch (punto.state) {
          case 'pending':
            image = '/static/images/icons/icon-location-yellow.svg';
            break;
          case 'fail':
            image = '/static/images/icons/icon-locaction-red.svg';
            break;
          case 'success':
            image = '/static/images/icons/icon-location-green.svg';
            break;
          default:
            image = '/static/images/icons/icon-location-yellow.svg';
        }
        const marker = new google.maps.Marker({
          position: punto.coords,
          map,
          icon: image,
        });
        marker.addListener('click', () => {
          this.linkTo(`/opcion/${punto.link}`);
        });
        marker.addListener('mouseover', () => {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        });
        marker.addListener('mouseout', () => {
          marker.setAnimation(null);
        });

        return punto;
      });
    });

    /*
    setTimeout(() => {
      this.dialogVisible = true;
    }, 500); */
  },
  components: {
    VueCircle,
  },
};
</script>

<style lang="scss">
  #map{
    width: 100%;
    height: 400px;
  }
</style>
