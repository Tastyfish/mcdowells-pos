<template>
  <OrderTree :nodes="nodes" :scrollOrderCounter="scrollOrderCounter" @select="select"
    class="flex-1 m-2 overflow-y-auto" />
  <TileGrid :strip="root" class="flex-2" />
  <div id="app-loading" class="absolute w-screen h-screen flex align-items-center justify-content-center bg-black-alpha-80" v-if="isLoading">
    <ProgressSpinner :pt="{
      spinner: { },
      circle: { style: { stroke: 'var(--primary-color !important' } },
    }" />
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { generateLineTree } from '@/api/tree';
import TileGrid from '@/components/TileGrid.vue';
import OrderTree from '@/components/OrderTree.vue';
import generateTiles from '@/tiles';

import { ChoiceMenuMode, useOrderStore, useUIStore } from '@/store';
import { mapStores } from 'pinia';

export default defineComponent({
  components: {
    TileGrid,
    OrderTree,
  },
  computed: {
    root() {
      return generateTiles();
    },
    nodes() {
      return generateLineTree(
        this.orderStore.lines,
        this.orderStore.currentLineID,
      );
    },
    scrollOrderCounter() {
      return this.orderStore.scrollOrderCounter
    },
    isLoading() {
      return this.uiStore.isLoading
    },
    ...mapStores(useOrderStore, useUIStore),
  },
  methods: {
    select(lineID: number) {
      this.orderStore.setCurrentLine(lineID)
      this.uiStore.setChoiceMenuMode(ChoiceMenuMode.Default)
    }
  }
})

</script>

<style lang="scss">
body {
  margin: 0;
  background-color: var(--surface-b);
  color: var(--text-color);
  font-family: var(--font-family);
  overflow: hidden;
}
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}
</style>

<style scoped>
.tile-grid {
  flex: 2 2 0%;
}
</style>
