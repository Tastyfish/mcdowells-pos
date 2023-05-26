import Rectangle from "@/api/rectangle";
import { StripProvider, newArrayStrip } from "@/api/strip";
import { Tile, newButton, newLabel, newToggle } from "@/api/tile";
import { useUIStore } from "@/store";
import { addDrink } from ".";
import { getChoicesBySlot } from "@/menu";

export const generateDrinkStrips = (): StripProvider[] => {
  const uiStore = useUIStore();

  return [
    newArrayStrip(new Rectangle(0, 4, 8, 1), getChoicesBySlot('drink').map(drink => (
      newButton(() => addDrink(drink.id), drink.displayName) as Tile
    )).concat([
      newToggle(uiStore.showingProductBuild, () => uiStore.showingProductBuild = !uiStore.showingProductBuild, 'Show Product Build'),
    ])),
    newArrayStrip(new Rectangle(0, 5, 1, 1), [
      newToggle(uiStore.showingPrices, () => uiStore.showingPrices = !uiStore.showingPrices, 'Show Prices'),
    ]),
  ].concat(uiStore.showingProductBuild ? [
    newArrayStrip(new Rectangle(1, 5, 6, 1), [
      { ...newLabel(`Software build: ${APP_VERSION}`), xSpan: 3 },
      { ...newLabel(`Menu build: ${4}`), xSpan: 3 },
    ]),
  ] : [] );
};
