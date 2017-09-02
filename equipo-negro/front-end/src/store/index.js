import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

// const debug = process.env.NODE_ENV !== 'production';

const STATIC_PATH = '/static/';

export default new Vuex.Store({
  state: {
    // Constantes
    staticPath: STATIC_PATH,
    puntos: [
      {
        id: 'punto-01',
        coords: { lat: -27.4637498, lng: -58.9869912 },
        name: 'Rotonda Castelli y Las Heras',
        state: 'pending',
        link: 'rotonda-castelli',
        description: 'Usted llega a una rotonda con un vehiculo circulando por ella. ¿Que debe hacer?',
        images: {
          initial: 'rotonda-01.jpg',
          success: 'rotonda-03.jpg',
          fail: 'rotonda-02.jpg',
        },
        options: [
          {
            name: 'meterse',
            text: 'Ingresar a la rotonda',
            probs: '68%',
          },
          {
            name: 'darPaso',
            text: 'Dar Paso',
            probs: '32%',
          },
        ],
        correctOption: {
          name: 'darPaso',
          description: 'Los vehiculos que circulan por la rotonda SIEMPRE tienen prioridad',
        },
      },
      {
        id: 'punto-02',
        coords: { lat: -27.4385941, lng: -59.0173004 },
        name: 'Avenida Alvear y ruta 11',
        state: 'pending',
        link: 'rotonda-alvear',
        description: 'Usted llega a un semaforo que se pone en amarillo. ¿Que debe hacer?',
        images: {
          initial: 'amarillo-01.jpg',
          success: 'amarillo-03.jpg',
          fail: 'amarillo-02.jpg',
        },
        options: [
          {
            name: 'acelerar',
            text: 'Acelerar',
            probs: '20%',
          },
          {
            name: 'frenar',
            text: 'Frenar',
            probs: '80%',
          },
        ],
        correctOption: {
          name: 'frenar',
          description: 'SIEMPRE debe frenar cuando el semaforo se pone en amarillo, para evitar accidentes.',
        },
      },
      {
        id: 'punto-03',
        coords: { lat: -27.4383551, lng: -58.9879021 },
        name: 'Avenida Lavalle y Avenida Ávalos',
        state: 'pending',
        link: 'rotonda-lavalle',
        description: 'Usted llega a una rotonda con un vehiculo circulando por ella. ¿Que debe hacer?',
        images: {
          initial: 'rotonda-01.png',
          success: 'rotonda-03.jpg',
          fail: 'rotonda-02.jpg',
        },
        options: [
          {
            name: 'meterse',
            text: 'Ingresar a la rotonda',
            probs: '68%',
          },
          {
            name: 'darPaso',
            text: 'Dar Paso',
            probs: '32%',
          },
        ],
        correctOption: {
          name: 'darPaso',
          description: 'Los vehiculos que circulan por la rotonda SIEMPRE tienen prioridad',
        },
      },
      {
        id: 'punto-04',
        coords: { lat: -27.4567425, lng: -58.9964906 },
        name: 'Avenida Alvear entre Santa Maria de Oro y Vedia.',
        state: 'pending',
        link: 'alvear-vedia',
        description: 'Usted llega a una rotonda con un vehiculo circulando por ella. ¿Que debe hacer?',
        images: {
          initial: 'rotonda-01.png',
          success: 'rotonda-03.jpg',
          fail: 'rotonda-02.jpg',
        },
        options: [
          {
            name: 'meterse',
            text: 'Ingresar a la rotonda',
            probs: '68%',
          },
          {
            name: 'darPaso',
            text: 'Dar Paso',
            probs: '32%',
          },
        ],
        correctOption: {
          name: 'darPaso',
          description: 'Los vehiculos que circulan por la rotonda SIEMPRE tienen prioridad',
        },
      },
      {
        id: 'punto-05',
        coords: { lat: -27.4615505, lng: -58.9900683 },
        name: 'Avenida Castelli entre Avenida San Martin y Arbo y Blanco.',
        state: 'pending',
        link: 'castelli-blanco',
        description: 'Usted llega a una rotonda con un vehiculo circulando por ella. ¿Que debe hacer?',
        images: {
          initial: 'rotonda-01.png',
          success: 'rotonda-03.jpg',
          fail: 'rotonda-02.jpg',
        },
        options: [
          {
            name: 'meterse',
            text: 'Ingresar a la rotonda',
            probs: '68%',
          },
          {
            name: 'darPaso',
            text: 'Dar Paso',
            probs: '32%',
          },
        ],
        correctOption: {
          name: 'darPaso',
          description: 'Los vehiculos que circulan por la rotonda SIEMPRE tienen prioridad',
        },
      },
    ],
  },
  mutations: {
    setStatus(state, options) {
      this.state.puntos.map((punto) => {
        if (punto.id === options.id) {
          punto.state = options.state;
        }
        return punto;
      });
    },
    updatePuntos(state, puntos) {
      state.puntos = puntos;
    },
  },
  actions: {
    getPuntos({ commit }) {
      // Categories
      axios.get('/getPuntos').then((response) => {
        commit('updatePuntos', response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    },
  },
});
