import Vue from 'vue';
import Vuex from 'vuex';
import { extractVuexModule, createProxy } from 'vuex-class-component';

import { OrderStore } from './order';
import { UIStore } from './ui';

export { NO_CURRENT_LINE } from './order';
export type { OrderCount } from './order';
export { ChoiceMenuMode } from './ui';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(OrderStore),
    ...extractVuexModule(UIStore),
  },
});

export default {
  order: createProxy(store, OrderStore),
  ui: createProxy(store, UIStore),
};
