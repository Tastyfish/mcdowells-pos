<script setup lang="ts">

import { computed } from 'vue'

import {
  Tile, TileType, emptyTile,
  isLabel, isButton, isToggle, isSplitToggle, Severity, ButtonTile, ToggleTile, SplitToggleTile,
} from '@/api/tile';
import { useUIStore } from '@/store';

import { currency } from '@/config/locale.json';

const props = withDefaults(defineProps<{
  tile: Tile,
}>(), {
  tile: () => emptyTile,
})

const uiStore = useUIStore();

const severityClass = computed(() => {
  switch (props.tile.type) {
    case TileType.Button:
      return `p-button-${props.tile.severity ?? 'primary'}`;
    case TileType.Toggle:
    case TileType.SplitToggle:
      return `p-button-${props.tile.severity ?? 'warning'}`;
    case TileType.Label:
      if (props.tile.severity) {
        const severity = props.tile.severity;

        // For some ungodly reason, inline messages use slightly different severities.

        const actualSeverity =
          severity === Severity.Warning ? 'warn' :
          severity === Severity.Danger ? 'error' :
          severity;

        return `p-message p-message-${actualSeverity}`;
      }
      return '';
    default:
      return '';
  }
});

const extraClasses = computed(() => ([severityClass.value]));

const extraStyles = computed(() => {
  const xSpan = props.tile.xSpan ? Math.floor(props.tile.xSpan) : undefined
  const ySpan = props.tile.ySpan ? Math.floor(props.tile.ySpan) : undefined

  return {
    minWidth: xSpan ? `calc(${xSpan}00% + ${(xSpan - 1) * 0.5}em) !important` : undefined,
    minHeight: ySpan ? `calc(${ySpan}00% + ${(ySpan - 1) * 0.5}em) !important` : undefined,
  }
});

</script>

<template>
  <Button v-if="isButton(tile)"
    :class="['base', 'p-button-sm', ...extraClasses, ...(tile.classes || [])]"
    :style="extraStyles"
    @click="(tile as ButtonTile).onPress"
    :label="tile.label"
    :icon="tile.icon"
    :badge="uiStore.showingPrices && tile.price !== undefined ? `${currency}${tile.price.toFixed(2)}` : undefined"
    badge-class="p-badge-success"
  />
  <Button v-else-if="isToggle(tile)"
    :class="['base', 'toggle', 'p-button-sm', ...extraClasses,
      { ['p-button-outlined']: tile.state}, ...(tile.classes || [])]"
    :style="extraStyles"
    @click="(tile as ToggleTile).onPress"
    :label="tile.label"
    :icon="tile.icon"
    :badge="uiStore.showingPrices && tile.price !== undefined ? `${currency}${tile.price.toFixed(2)}` : undefined"
    badge-class="p-badge-success"
  />
  <Button v-else-if="isSplitToggle(tile)"
    :class="['base', 'split', 'p-button-sm', ...extraClasses, ...(tile.classes || [])]"
    @click="(tile as SplitToggleTile).onPress"
    :style="extraStyles">
    <span :class="['p-button-label', 'flex-none', {stogsel: tile.state == 'top'}]">{{ tile.topLabel }}<Badge v-if="tile.topPrice" :value="tile.topPrice" class="p-badge-success" /></span>
    <div class="stogdiv"></div>
    <span :class="['p-button-label', 'flex-none', {stogsel: tile.state == 'bottom'}]">{{ tile.bottomLabel }}<Badge v-if="tile.bottomPrice" :value="tile.bottomPrice" class="p-badge-success" /></span>
  </Button>
  <div v-else-if="isLabel(tile)"
    :class="['base', 'label', ...extraClasses, ...(tile.classes || [])]"
    :style="extraStyles">
    <span>{{ tile.label }}</span>
  </div>
</template>

<style scoped>

.base {
  display: block;
}
.label {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 !important;
}
.toggle {
  display: flex;
}
.split {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: stretch;
}
.stogdiv {
  min-height: 1px;
  background-color: var(--primary-color-text);
  content: "";
}
.stogsel {
  background-color: var(--primary-color-text);
  color: var(--primary-color);
  margin: -.25rem;
  padding: .25rem;
}

.circle {
  border-radius: 100vh;
}

.small-text-button {
  font-size: 0.75rem !important;
}

</style>
