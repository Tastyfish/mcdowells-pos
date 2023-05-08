<template>
  <div id="app">
    <OrderTree :nodes="nodes" :scrollOrderCounter="scrollOrderCounter" @select="select" />
    <TileGrid :strip="root" class="grid" />
    <div id="app-loading" v-if="isLoading">
      <ProgressSpinner />
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { generateLineTree } from '@/api/tree';
import TileGrid from '@/components/TileGrid.vue';
import OrderTree from '@/OrderTree.vue';
import generateTiles from '@/tiles';
import { choiceSlots } from '@/menu';

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
        this.orderStore.choices,
        choiceSlots,
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
}
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}
#app-loading {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: #000C;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style scoped>
.grid {
  width: 66.67%;
}
</style>
