<template>
  <Button v-if="tile.type === 'BUTTON'"
    :class="['base', 'p-button-sm', ...extraClasses, ...tile.classes]"
    @click="tile.onPress" :label="tile.label" :icon="tile.icon" />
  <Button v-else-if="tile.type === 'TOGGLE'"
    :class="['base', 'toggle', 'p-button-sm', ...extraClasses,
      { ['p-button-outlined']: tile.state}, ...tile.classes]"
    @click="tile.onPress" :label="tile.label" :icon="tile.icon" />
  <Button v-else-if="tile.type === 'SPLITTOGGLE'"
    :class="['base', 'split', 'p-button-sm', ...extraClasses, ...tile.classes]"
    @click="tile.onPress">
    <b v-if="tile.state == 'top'" class="stogsel">{{ tile.topLabel }}</b>
    <span v-else>{{ tile.topLabel }}</span>
    <div class="stogdiv"></div>
    <b v-if="tile.state == 'bottom'" class="stogsel">{{ tile.bottomLabel }}</b>
    <span v-else>{{ tile.bottomLabel }}</span>
  </Button>
  <div v-else
    :class="['base', 'label', ...extraClasses, ...tile.classes]">
    <span>{{ tile.label }}</span>
  </div>
</template>

<script lang="ts">
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["id"] }] */

import { Component, Prop, Vue } from 'vue-property-decorator';
import { Tile, TileType, emptyTile } from '@/api/tile';

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
