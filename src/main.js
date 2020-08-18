import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueCookies from "vue-cookies";
import Vuex from "vuex";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@/plugins/echarts";
import VueNumber from "vue-number-animation";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueCookies);
Vue.use(Vuex);
Vue.use(VueNumber);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
