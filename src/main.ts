import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import './prime';
import { store } from './store';

import 'primevue/resources/themes/arya-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  store,
}).$mount('#app');
