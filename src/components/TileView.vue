<template>
  <Button v-if="tile.type === 'BUTTON'"
    :class="['base', 'p-button-sm', ...extraClasses, ...(tile.classes || [])]"
    @click="buttonTile?.onPress"
    :label="buttonTile?.label"
    :icon="buttonTile?.icon" />
  <Button v-else-if="tile.type === 'TOGGLE'"
    :class="['base', 'toggle', 'p-button-sm', ...extraClasses,
      { ['p-button-outlined']: toggleTile?.state}, ...(tile.classes || [])]"
    @click="toggleTile?.onPress"
    :label="toggleTile?.label"
    :icon="toggleTile?.icon" />
  <Button v-else-if="tile.type === 'SPLITTOGGLE'"
    :class="['base', 'split', 'p-button-sm', ...extraClasses, ...(tile.classes || [])]"
    @click="splitTile?.onPress">
    <span :class="['p-button-label', 'flex-none', {stogsel: splitTile?.state == 'top'}]">{{ splitTile?.topLabel }}</span>
    <div class="stogdiv"></div>
    <span :class="['p-button-label', 'flex-none', {stogsel: splitTile?.state == 'bottom'}]">{{ splitTile?.bottomLabel }}</span>
  </Button>
  <div v-else
    :class="['base', 'label', ...extraClasses, ...(tile.classes || [])]">
    <span>{{ labelTile?.label }}</span>
  </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue'

import {
  Tile, TileType, emptyTile,
  isLabel, isButton, isToggle, isSplitToggle, Severity,
} from '@/api/tile';

export default defineComponent({
  props: {
    tile: {
      type: Object as PropType<Tile>,
      default: () => emptyTile,
    },
  },
  computed: {
    severityClass() {
      switch (this.tile.type) {
        case TileType.Button:
          return `p-button-${this.tile.severity ?? 'primary'}`;
        case TileType.Toggle:
        case TileType.SplitToggle:
          return `p-button-${this.tile.severity ?? 'warning'}`;
        case TileType.Label:
          if (this.tile.severity) {
            const severity = this.tile.severity;

            // For some ungodly reason, inline messages use slightly different severities.

            const actualSeverity =
              severity === Severity.Warning ? 'warn' :
              severity === Severity.Danger ? 'error' :
              severity;

            return `p-inline-message p-inline-message-${actualSeverity}`;
          }
          return '';
        default:
          return '';
      }
    },

    extraClasses() {
      return [
        this.severityClass,
        this.tile.xSpan === 2 ? 'doublex' : this.tile.xSpan === 3 ? 'triplex' : undefined,
        this.tile.ySpan === 2 ? 'doubley' : this.tile.ySpan === 3 ? 'tripley' : undefined,
      ]
    },

    buttonTile() { return isButton(this.tile) ? this.tile : undefined },
    toggleTile() { return isToggle(this.tile) ? this.tile : undefined },
    splitTile() { return isSplitToggle(this.tile) ? this.tile : undefined },
    labelTile() { return isLabel(this.tile) ? this.tile : undefined },
  },
})

</script>

<style scoped>

.base {
  display: block;
}
.doublex {
  min-width: calc(200% + .5em) !important;
}
.doubley {
  min-height: calc(200% + .5em) !important;
}
.triplex {
  min-width: calc(300% + 1em) !important;
}
.tripley {
  min-height: calc(300% + 1em) !important;
}
.label {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
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
  margin: -.125rem;
  padding: .125rem;
}

.circle {
  border-radius: 100vh;
}

.small-text-button {
  font-size: 0.75rem !important;
}

</style>
