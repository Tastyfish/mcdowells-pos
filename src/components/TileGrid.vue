<template>
  <div class="grid">
    <div class="row" v-for="y in strip.bounds.height" :key="y">
      <div class="cell" v-for="x in strip.bounds.width" :key="x">
        <TileView :tile="strip.getTile(x - 1, y - 1)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { StripProvider, emptyStrip } from '@/api/strip';
import TileView from './TileView.vue';

@Component({
  components: {
    TileView,
  },
})
export default class TileGrid extends Vue {
  @Prop({ default: () => emptyStrip }) readonly strip!: StripProvider
}
</script>

<style scoped lang='scss'>
  .grid {
    display: flex;
    flex-direction: column;
  }

  .row {
    min-height: 10%;
    max-height: 10%;
    display: flex;
    align-items: stretch;
    padding: 0.25em 0;
  }

  .cell {
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
