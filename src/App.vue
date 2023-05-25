<script setup lang="ts">

import { computed } from 'vue';
import { generateLineTree } from '@/api/tree';
import TileGrid from '@/components/TileGrid.vue';
import OrderTree from '@/components/OrderTree.vue';
import generateTiles from '@/tiles';

import { ChoiceMenuMode, useOrderStore, useUIStore } from '@/store';

const orderStore = useOrderStore();
const uiStore = useUIStore();

const root = computed(generateTiles);
const nodes = computed(() => generateLineTree(orderStore.lines, orderStore.currentLineID));

const isLoading = computed(() => uiStore.isLoading);

function select(lineID: number) {
  orderStore.setCurrentLine(lineID)
  uiStore.setChoiceMenuMode(ChoiceMenuMode.Default)
}

</script>

<template>
  <OrderTree :nodes="nodes" :scrollOrderCounter="orderStore.scrollOrderCounter" @select="select"
    class="flex-1 m-2 overflow-y-auto" />
  <TileGrid :strip="root" class="flex-2" />
  <div id="app-loading" class="absolute w-screen h-screen flex align-items-center justify-content-center bg-black-alpha-80" v-if="isLoading">
    <ProgressSpinner :pt="{
      spinner: { },
      circle: { style: { stroke: 'var(--primary-color !important' } },
    }" />
  </div>
</template>

<style>
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
  flex: 3 3 0%;
}
</style>
