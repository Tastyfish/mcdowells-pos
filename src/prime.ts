import Vue from 'vue';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import ToggleButton from 'primevue/togglebutton';
import Tree from 'primevue/tree';
import Divider from 'primevue/divider';

Vue.use(PrimeVue, { ripple: true });

Vue.component('Button', Button);
Vue.component('ToggleButton', ToggleButton);
Vue.component('Tree', Tree);
Vue.component('Divider', Divider);
