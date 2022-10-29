<template>
  <Button v-if="tile.type === 'BUTTON'"
    :class="['base', 'p-button-sm', ...extraClasses, ...(tile.classes || [])]"
    @click="buttonTile.onPress"
    :label="buttonTile.label"
    :icon="buttonTile.icon" />
  <Button v-else-if="tile.type === 'TOGGLE'"
    :class="['base', 'toggle', 'p-button-sm', ...extraClasses,
      { ['p-button-outlined']: toggleTile.state}, ...(tile.classes || [])]"
    @click="toggleTile.onPress"
    :label="toggleTile.label"
    :icon="toggleTile.icon" />
  <Button v-else-if="tile.type === 'SPLITTOGGLE'"
    :class="['base', 'split', 'p-button-sm', ...extraClasses, ...(tile.classes || [])]"
    @click="splitTile.onPress">
    <b v-if="splitTile.state == 'top'" class="stogsel">{{ splitTile.topLabel }}</b>
    <span v-else>{{ splitTile.topLabel }}</span>
    <div class="stogdiv"></div>
    <b v-if="splitTile.state == 'bottom'" class="stogsel">{{ splitTile.bottomLabel }}</b>
    <span v-else>{{ splitTile.bottomLabel }}</span>
  </Button>
  <div v-else
    :class="['base', 'label', ...extraClasses, ...(tile.classes || [])]">
    <span>{{ labelTile.label }}</span>
  </div>
</template>

<script lang="ts">
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["id"] }] */

import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  Tile, TileType, emptyTile, LabelTile, ButtonTile, ToggleTile, SplitToggleTile,
} from '@/api/tile';

@Component
export default class TileView extends Vue {
  @Prop({ default: () => emptyTile }) readonly tile!: Tile

  get severityClass(): string {
    switch (this.tile.type) {
      case TileType.Button:
        return `p-button-${this.tile.severity ?? 'primary'}`;
      case TileType.Toggle:
      case TileType.SplitToggle:
        return `p-button-${this.tile.severity ?? 'warning'}`;
      case TileType.Label:
        if (this.tile.severity) {
          return `p-inline-message p-inline-message-${this.tile.severity}`;
        }
        return '';
      default:
        return '';
    }
  }

  get extraClasses(): (string | undefined)[] {
    return [
      this.severityClass,
      this.tile.xSpan === 2 ? 'doublex' : undefined,
      this.tile.ySpan === 2 ? 'doubley' : undefined,
    ];
  }

  get buttonTile(): ButtonTile {
    return (this.tile as ButtonTile);
  }

  get toggleTile(): ToggleTile {
    return (this.tile as ToggleTile);
  }

  get splitTile(): SplitToggleTile {
    return (this.tile as SplitToggleTile);
  }

  get labelTile(): LabelTile {
    return (this.tile as LabelTile);
  }
}
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
</style>
