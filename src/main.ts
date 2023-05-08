import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue';
import { setupPrime } from './prime';

import 'primevue/resources/themes/arya-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App)
    .use(createPinia())

setupPrime(app)

app.mount('#app')
