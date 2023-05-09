<template>
  <div class="tile-grid">
    <div class="tile-row" v-for="y in strip.bounds.height" :key="y">
      <div class="tile-cell" v-for="x in strip.bounds.width" :key="x">
        <TileView :tile="strip.getTile(x - 1, y - 1)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { StripProvider, emptyStrip } from '@/api/strip'
import TileView from './TileView.vue'

export default defineComponent({
  components: {
    TileView
  },
  props: {
    strip: {
      type: Object as PropType<StripProvider>,
      default: () => emptyStrip,
    }
  }
})

</script>

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
