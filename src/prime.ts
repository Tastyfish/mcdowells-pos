import { App } from 'vue';

import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import ToggleButton from 'primevue/togglebutton';
import Tree from 'primevue/tree';
import Divider from 'primevue/divider';
import ProgressSpinner from 'primevue/progressspinner';

export function setupPrime(app: App<Element>) {
  app.use(PrimeVue, { ripple: true });

  app.component('Button', Button);
  app.component('ToggleButton', ToggleButton);
  app.component('Tree', Tree);
  app.component('Divider', Divider);
  app.component('ProgressSpinner', ProgressSpinner);
}
