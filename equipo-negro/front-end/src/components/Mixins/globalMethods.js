import jump from 'jump.js';

// define a mixin object
const globalMethods = {
  methods: {
    iconsPath(image) {
      return `${this.$store.state.staticPath}images/icons/${image}`;
    },
    imagesPath(image) {
      return `${this.$store.state.staticPath}images/${image}`;
    },
    bgImage(image) {
      return `background-image: url(${this.imagesPath(image)})`;
    },
    bgImageServer(image) {
      return `background-image: url(${image})`;
    },
    smoothScrollTo(link) {
      jump(link);
    },
    linkTo(link) {
      if (this.$route.path === link) {
        this.smoothScrollTo('.main-navbar');
      } else {
        this.$router.push(link);
      }
    },
  },
};

export default globalMethods;
