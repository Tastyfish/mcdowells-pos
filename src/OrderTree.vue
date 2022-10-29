<template>
  <Tree ref="tree" class="tree" :value="nodes" :expandedKeys="expandedNodes"
  selectionMode="single" :selectionKeys="selectedKeys" @node-select="select" />
</template>

<script lang="ts">
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["selectedKeys"] }] */

import {
  Component, Vue, Ref, Watch, Prop,
} from 'vue-property-decorator';
import { TreeNode } from '@/api/tree';

interface NodeExpansionInfo {
  [key: number]: boolean
}

@Component({})
export default class App extends Vue {
  @Ref('tree') readonly treeComponent!: Vue

  @Prop(Array) readonly nodes!: TreeNode[]

  @Prop(Number) readonly scrollOrderCounter!: number

  get expandedNodes(): NodeExpansionInfo {
    return this.nodes.reduce((dict, node) => ({ ...dict, [node.key]: true }), {});
  }

  @Watch('scrollOrderCounter')
  onNodesChanged(): void {
    // Scroll to bottom after rendering.
    this.$nextTick(() => {
      this.treeComponent.$el.scrollTop = this.treeComponent.$el.scrollHeight;
    });
  }

  get selectedKeys(): (string | number)[] {
    return [];
  }

  // On node selection
  select(node: TreeNode): void {
    // Number before : in a node key is always the order line ID.
    this.$emit('select', parseInt((node.key as string).split(':')[0], 10));
  }
}
</script>

<style scoped>
.tree {
  width: 33.33%;
  margin: 0.5em;
  overflow-y: auto;
}
</style>
