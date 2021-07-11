<template>
  <div id="app">
    <Tree class="orderBar" :value="nodes" :expandedKeys="expandedNodes" />
    <TileGrid :strip="root" class="grid" />
  </div>
</template>

<script lang="ts">
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["root", "nodes"] }] */

import { Component, /* Prop, */ Vue } from 'vue-property-decorator';
import { StripProvider } from '@/api/strip';
import TileGrid from '@/components/TileGrid.vue';
import generateTiles from '@/tiles';
import { generateLineTree, TreeNode } from '@/api/tree';

import vxm from '@/store';

interface NodeExpansionInfo {
  [key: number]: boolean
}

@Component({
  components: {
    TileGrid,
  },
})
export default class App extends Vue {
  get root(): StripProvider {
    return generateTiles();
  }

  get nodes(): TreeNode[] {
    return generateLineTree(vxm.order.lines, vxm.order.choices, vxm.order.currentLineID);
  }

  get expandedNodes(): NodeExpansionInfo {
    return this.nodes.reduce((dict, node) => ({ ...dict, [node.key]: true }), {});
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
