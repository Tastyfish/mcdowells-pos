<script setup lang="ts">

import { ComponentPublicInstance, computed, watch, nextTick, ref } from 'vue'
import Tree, { TreeExpandedKeys, TreeNode } from 'primevue/tree';
import { currency } from '@/config/locale.json';

const props = defineProps<{
  nodes: TreeNode[]
  scrollOrderCounter: number
}>();

const emits = defineEmits<{
  select: [lineID: number]
}>();

const treeComponent = ref(null as Tree | null);

const selectedKeys = computed(() => [] as (string | number)[]);

// Expand every branch always.
const expandedNodes = computed((): TreeExpandedKeys => props.nodes.reduce((dict, node) => ({ ...dict, [node.key as string]: true }), {}))

// On node selection
function select(node: TreeNode) {
  // Number before : in a node key is always the order line ID.
  emits('select', parseInt((node.key as string).split(':')[0], 10))
}

watch(
  () => props.scrollOrderCounter,
  async () => {
    // Scroll to bottom after rendering.
    await nextTick();

    const treeInstance = treeComponent.value as Partial<ComponentPublicInstance>

    treeInstance.$el.scrollTop = treeInstance.$el.scrollHeight
  }
);

</script>

<template>
  <Tree class="order-tree" ref="treeComponent" :value="nodes" :expandedKeys="expandedNodes"
  selectionMode="single" :selectionKeys="selectedKeys" @node-select="select">
    <template #default="slotProps">
      {{ slotProps.node.label }}
    </template>
    <template #priced="slotProps">
      <div class="w-full flex flex-row">
        <span class="flex-auto">{{ slotProps.node.label }}</span>
        <b>{{ currency }}{{ (slotProps.node.data as number).toFixed(2) }}</b>
      </div>
    </template>
  </Tree>
</template>

<style scoped>

.order-tree:deep(.p-treenode-label) {
  width: 100%;
}

</style>
