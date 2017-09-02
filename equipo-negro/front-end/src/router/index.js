import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import Inicio from '@/components/Inicio';
import Opcion from '@/components/Opcion';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/inicio',
      name: 'Inicio',
      component: Inicio,
    },
    {
      path: '/opcion',
      name: 'opcion',
      component: Opcion,
    },
    { path: '/opcion/:punto', component: Opcion },
  ],
});
