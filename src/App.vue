<template>
  <div id="app">
    <Tree class="orderBar" />
    <TileGrid :strip="root" class="grid" />
  </div>
</template>

<script lang="ts">
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["root"] }] */

import { Component, /* Prop, */ Vue } from 'vue-property-decorator';
import { StripProvider } from '@/api/strip';
import TileGrid from '@/components/TileGrid.vue';
import generateTiles from '@/tiles';

@Component({
  components: {
    TileGrid,
  },
})
export default class App extends Vue {
  get root(): StripProvider {
    return generateTiles();
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  background-color: var(--surface-b);
  color: var(--text-color);
  font-family: var(--font-family);
}
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}
.orderBar {
  width: 33.33%;
  margin: 0.5em;
}
.grid {
  width: 66.67%;
}
</style>
