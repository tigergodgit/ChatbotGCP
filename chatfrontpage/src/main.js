import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import socketclient from "socket.io-client";
import MuseUI from "muse-ui";
import "muse-ui/dist/muse-ui.css";
import "typeface-roboto";
const io = socketclient("http://23.106.139.127:9191/");
Vue.use(MuseUI);
Vue.config.productionTip = false;
Vue.prototype.$socket = io;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
