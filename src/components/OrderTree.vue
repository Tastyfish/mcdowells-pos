<template>
  <Tree ref="tree" :value="nodes" :expandedKeys="expandedNodes"
  selectionMode="single" :selectionKeys="selectedKeys" @node-select="select">
    <template #default="slotProps">
      {{ slotProps.node.label }}
    </template>
    <template #priced="slotProps">
      <div class="w-full flex flex-row">
        <span class="flex-auto">{{ slotProps.node.label }}</span>
        <b>${{ (slotProps.node.data as number).toFixed(2) }}</b>
      </div>
    </template>
  </Tree>
</template>

<script lang="ts">

import { defineComponent, PropType, ComponentPublicInstance } from 'vue'
import Tree, { TreeExpandedKeys, TreeNode } from 'primevue/tree';

export default defineComponent({
  props: {
    nodes: {
      type: Array as PropType<TreeNode[]>,
      required: true as true,
    },
    scrollOrderCounter: Number,
  },
  emits: ['select'],
  computed: {
    treeComponent() { return this.$refs.tree as Tree },
    selectedKeys() { return [] as (string | number)[] },
    expandedNodes(): TreeExpandedKeys {
      return this.$props.nodes.reduce((dict, node) => ({ ...dict, [node.key as string]: true }), {})
    },
  },
  methods: {
    // On node selection
    select(node: TreeNode) {
      // Number before : in a node key is always the order line ID.
      this.$emit('select', parseInt((node.key as string).split(':')[0], 10))
    }
  },
  watch: {
    scrollOrderCounter() {
      // Scroll to bottom after rendering.
      this.$nextTick(() => {
        const treeInstance = this.treeComponent as Partial<ComponentPublicInstance>

        treeInstance.$el.scrollTop = treeInstance.$el.scrollHeight
      });
    }
  }
})

</script>

<style>

.p-treenode-label {
  width: 100%;
}

</style>