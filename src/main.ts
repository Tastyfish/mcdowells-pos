import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import { setupPrime } from './prime'

import 'primevue/resources/themes/viva-dark/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const app = createApp(App).use(createPinia().use(piniaPluginPersistedstate))

setupPrime(app)

app.mount('#app')
