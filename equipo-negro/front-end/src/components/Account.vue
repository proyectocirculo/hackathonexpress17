<template lang="html">
  <div class="account page-section">
    <main-navbar @signup="signUpModal = true" @login="loginModal = true"></main-navbar>
    <main v-if="!user" class="account__main">
      <div class="account__loading">
        <h1>{{ loading }}</h1>
      </div>
    </main>
    <main v-else class="account__main">
      <div class="account__data">
        <aside class="account__menu">
          <ul class="pill-menu">
            <li @click="activePanel = 'details'" class="pill-menu__item" :class="{active: activePanel === 'details'}"><h2>Mis datos</h2></li>
            <li @click="activePanel = 'pedidos'" class="pill-menu__item" :class="{active: activePanel === 'pedidos'}"><h2>Mis compras</h2></li>
          </ul>
        </aside>
        <div v-if="activePanel === 'details'" class="account__details">
          <section class="account__panel panel">
            <div v-if="!loggedUser.emailVerified" class="message message--alert">
              <header class="message__header">
                <h2>Cuenta no verificada</h2>
              </header>
              <article class="message__body">
                <p>Para poder hacer compras en nuestro sitio tenes que verificar tu cuenta</p>
                <p>Revisa tu cuenta de correo para obtener el link de verificación (puede estar en la carpeta spam/correo no deseado)</p>
                <p>Si no lo encontras, podes pedir que te lo reenviemos</p>
              </article>
              <a @click="sendVerificationMail" class="btn btn-red">Reenviar correo de verificación</a>
            </div>
            <article class="panel__body">
              <ul class="details-list">
                <li class="details-list__item">
                  <label class="details-list__label"><strong>Nombre y Apellido</strong></label>
                  <p class="details-list__info" v-if="!editData">{{ (user.name && user.name !== '') ? user.name : 'Sin datos' }}</p>
                  <input class="details-list__info form-control" v-if="editData" type="text" v-model="data.name">
                </li>
                <li class="details-list__item">
                  <label class="details-list__label"><strong>Dirección</strong></label>
                  <p class="details-list__info" v-if="!editData">{{ (user.address && user.address !== '') ? user.address.name : 'Sin datos' }}</p>
                  <div class="details-edit details-list__info" :class="{active: editData}">
                    <input class="form-control" id="autocomplete" type="text" v-model="data.address">
                  </div>
                </li>
                <!-- Es departamento -->
                <li class="details-list__item" v-if="editData">
                  <label class="details-list__label"><strong>Es departamento?</strong></label>
                  <el-radio class="radio" v-model="isDpto" :label="true">Si</el-radio>
                  <el-radio class="radio" v-model="isDpto" :label="false">No</el-radio>
                </li>
                <li class="details-list__item" v-if="isDpto">
                  <label class="details-list__label"><strong>Piso</strong></label>
                  <p class="details-list__info" v-if="!editData">{{ (user.floor && user.floor !== '') ? user.floor : 'Sin datos' }}</p>
                  <input class="form-control details-list__info" v-if="editData" type="text" v-model="data.floor">
                </li>
                <li class="details-list__item" v-if="isDpto">
                  <label class="details-list__label"><strong>Departamento</strong></label>
                  <p class="details-list__info" v-if="!editData">{{ (user.number && user.number !== '') ? user.number : 'Sin datos' }}</p>
                  <input class="form-control details-list__info" v-if="editData" type="text" v-model="data.number">
                </li>
                <!-- Telefono -->
                <li class="details-list__item">
                  <label class="details-list__label"><strong>Teléfono</strong></label>
                  <p class="details-list__info" v-if="!editData">{{ (user.phone && user.phone !== '') ? user.phone : 'Sin datos' }}</p>
                  <input class="form-control details-list__info" v-if="editData" type="text" v-model="data.phone">
                </li>
                <li class="details-list__item" :class="{ active: editData }">
                  <label class="details-list__label"><strong>Email</strong></label>
                  <div class="details-list__info">
                    <p >{{ user.email }}</p>
                    <a class="btn btn-cyan" v-if="editData">Cambiar dirección de correo</a>
                  </div>
                </li>
              </ul>
            </article>
            <footer class="panel__footer">
              <a v-if="!editData" @click="toggleEdit" class="btn btn-purple">Editar</a>
              <a v-if="editData" @click="saveData" class="btn btn-purple">Confirmar</a>
              <a v-if="editData" @click="editData = false" class="btn btn-red--transparent" style="margin-left: 1em">Cancelar</a>
            </footer>
          </section>
        </div>
        <account-pedidos v-if="activePanel === 'pedidos'"></account-pedidos>
      </div>
      <footer class="account__footer">
        <a @click="logOut" class="btn btn-cyan--transparent">Cerrar sesión</a>
      </footer>
    </main>
    <productos-ofertas></productos-ofertas>
    <div class="notification-container">
      <cart-notification></cart-notification>
    </div>
    <main-footer></main-footer>
  </div>
</template>

<script>
import firebase from 'firebase';
import GoogleMapsLoader from 'google-maps';
import globalMethods from '@/components/Mixins/globalMethods';
import linkMethods from '@/components/Mixins/linkMethods';
import MainNavbar from '@/components/Shared/MainNavbar';
import MainFooter from '@/components/Shared/MainFooter';
import AccountPedidos from '@/components/Account/AccountPedidos';
import ProductosOfertas from '@/components/Productos/ProductosOfertas';
import CartNotification from '@/components/Shared/CartNotification';

export default {
  name: 'account',
  mixins: [globalMethods, linkMethods],
  data() {
    return {
      activePanel: 'details',
      attempts: 10,
      editData: false,
      isDpto: false,
      data: {
        name: '',
        address: '',
        floor: '',
        number: '',
        phone: '',
      },
      selectedAddress: false,
      loading: 'Cargando datos...',
      // Gmaps api
      autocomplete: false,
    };
  },
  firebase() {
    return {
      users: this.database.ref('users'),
    };
  },
  computed: {
    loggedUser() {
      return this.$store.state.loggedUser;
    },
    user() {
      return this.users.filter((user) => {
        return user.uid === this.loggedUser.uid;
      })[0];
    },
    database() {
      return this.$store.state.firebaseApp.database();
    },
  },
  methods: {
    logOut() {
      this.$store.commit('logOutUser');
    },
    toggleEdit() {
      this.editData = true;

      if (this.user.address) this.selectedAddress = this.user.address;
      this.data = {
        name: this.user.name ? this.user.name : '',
        address: this.user.address ? this.user.address.name : '',
        floor: this.user.floor ? this.user.floor : '',
        number: this.user.number ? this.user.number : '',
        phone: this.user.phone ? this.user.phone : '',
      };
      this.isDpto = this.user.isDpto ? this.user.isDpto : false;
      GoogleMapsLoader.load((google) => {
        const input = document.getElementById('autocomplete');
        this.autocomplete = new google.maps.places.Autocomplete(input, { types: ['geocode'], componentRestrictions: { country: 'ar' } });
      });
    },
    saveData() {
      const place = this.autocomplete.getPlace();
      console.log(place);
      if (place) {
        if (place.name === 'Resistencia') {
          this.$notify.error({
            title: 'Error',
            message: 'Debe seleccionar una dirección valida. Ha seleccionado una ciudad.',
          });
        } else {
          this.selectedAddress = {
            name: place.name,
            address: place.formatted_address,
            city: place.vicinity,
            coords: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          };
          this.data.address = place.name;
          GoogleMapsLoader.load((google) => {
            const coords = [
              { lat: -27.4486345, lng: -58.9754285 },
              { lat: -27.4629984, lng: -58.9916419 },
              { lat: -27.4513197, lng: -59.004373 },
              { lat: -27.4368196, lng: -58.9887086 },
            ];
            const range = new google.maps.Polygon({ paths: coords });

            const validAddress = google.maps.geometry.poly.containsLocation(place.geometry.location, range);

            if (validAddress) {
              this.uploadData();
            } else {
              this.$notify.error({
                title: 'Error',
                message: 'La dirección esta fuera del rango de servicio. Click aqui para ver zonas de cobertura.',
                onClick() {
                  window.open('https://www.shoply.com.ar/', '_blank');
                },
              });
            }
          });
        }
      } else if (this.data.address === '') {
        this.selectedAddress = false;
        this.uploadData();
      } else if (this.selectedAddress) {
        this.uploadData();
      } else {
        this.$notify.error({
          title: 'Error',
          message: 'Debe seleccionar una dirección de la lista. Click aqui para saber como.',
          onClick() {
            window.open('https://www.shoply.com.ar/', '_blank');
          },
        });
      }
    },
    uploadData() {
      const newData = {
        email: this.user.email,
        emailVerified: this.loggedUser.emailVerified,
        uid: this.user.uid,
        name: this.data.name,
        address: this.selectedAddress,
        phone: this.data.phone,
        isDpto: this.isDpto,
        floor: this.data.floor,
        number: this.data.number,
      };

      this.$firebaseRefs.users.child(this.user['.key']).set(newData);

      this.$message({
        message: 'Datos guardados con éxito.',
        type: 'success',
      });

      this.editData = false;
    },
    sendVerificationMail() {
      const user = firebase.auth().currentUser;

      user.sendEmailVerification()
      .then(() => {
        this.$message({
          message: 'Correo enviado con éxito.',
          type: 'success',
        });
      })
      .catch((error) => {
        this.$message({
          message: `Error al enviar correo. ${error}`,
          type: 'error',
        });
      });
    },
    checkLoaded() {
      this.attempts -= 1;
      if (this.user) {
        this.loading = false;
      } else if (this.attempts > 0) {
        setTimeout(() => {
          this.checkLoaded();
        }, 1000);
      } else {
        this.loading = 'Sesión expirada';
      }
    },
  },
  mounted() {
    GoogleMapsLoader.KEY = 'AIzaSyDhBvBDCDM1cHWB7-vzSRZP7odkeU0SRGg';
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
    this.checkLoaded();
    this.handleLink();
  },
  components: {
    MainNavbar,
    MainFooter,
    AccountPedidos,
    ProductosOfertas,
    CartNotification,
  },
};
</script>
