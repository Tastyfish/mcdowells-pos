<script setup lang='ts'>

import { StripProvider, emptyStrip } from '@/api/strip'
import TileView from './TileView.vue'

withDefaults(defineProps<{
  strip: StripProvider
}>(), {
  strip: () => emptyStrip,
})

</script>

<template>
  <div class="tile-grid">
    <div class="tile-row" v-for="y in strip.bounds.height" :key="y">
      <div class="tile-cell" v-for="x in strip.bounds.width" :key="x">
        <TileView :tile="strip.getTile(x - 1, y - 1)" />
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>

.tile-grid {
  display: flex;
  flex-direction: column;
}

.tile-row {
  min-height: 10%;
  max-height: 10%;
  display: flex;
  align-items: stretch;
  padding: 0.25em 0;
}

.tile-cell {
  min-width: 10%;
  max-width: 10%;
  padding: 0em 0.25em;

  * {
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
  }
}

</style>
