<template>
  <div id="app">
    <OrderTree :nodes="nodes" :scrollOrderCounter="scrollOrderCounter" @select="select" />
    <TileGrid :strip="root" class="grid" />
  </div>
</template>

<script lang="ts">
/* eslint class-methods-use-this: [
  "error", { "exceptMethods": ["root", "nodes", "scrollOrderCounter", "select"
] }] */

import {
  Component, Vue,
} from 'vue-property-decorator';
import { StripProvider } from '@/api/strip';
import { generateLineTree, TreeNode } from '@/api/tree';
import TileGrid from '@/components/TileGrid.vue';
import OrderTree from '@/OrderTree.vue';
import generateTiles from '@/tiles';
import { choiceSlots } from '@/menu';

import vxm from '@/store';

@Component({
  components: {
    TileGrid,
    OrderTree,
  },
})
export default class App extends Vue {
  get root(): StripProvider {
    return generateTiles();
  }

  get nodes(): TreeNode[] {
    return generateLineTree(
      vxm.order.lines, vxm.order.choices,
      choiceSlots, vxm.order.currentLineID,
    );
  }

  get scrollOrderCounter(): number {
    return vxm.order.scrollOrderCounter;
  }

  // An order was selected.
  select(lineID: number): void {
    vxm.order.setCurrentLine(lineID);
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
</style>

<style scoped>
.grid {
  width: 66.67%;
}
</style>
