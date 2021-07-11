import Vue from 'vue';
import Vuex from 'vuex';
import { extractVuexModule, createProxy } from 'vuex-class-component';

import { OrderStore } from './order';

export { NO_CURRENT_LINE, ChoiceMenuMode } from './order';
export type { OrderCount } from './order';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(OrderStore),
  },
});

export default {
  order: createProxy(store, OrderStore),
};
