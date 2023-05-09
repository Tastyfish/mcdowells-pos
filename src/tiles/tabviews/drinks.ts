import Rectangle from "@/api/rectangle";
import { StripProvider, newArrayStrip } from "@/api/strip";
import { newButton, newLabel, newToggle } from "@/api/tile";
import { useUIStore } from "@/store";
import { addDrink } from ".";

export const generateDrinkStrips = (): StripProvider[] => {
  const uiStore = useUIStore();

  return [
    newArrayStrip(new Rectangle(0, 4, 8, 1), [
      newButton(() => addDrink('coke'), 'Coke'),
      newButton(() => addDrink('dietcoke'), 'Diet Coke'),
      newButton(() => addDrink('sprite'), 'Sprite'),
      newButton(() => addDrink('fantaorange'), 'Fanta Orange'),
      newButton(() => addDrink('icedtea'), 'Iced Tea'),
      newButton(() => addDrink('sweettea'), 'Sweet Tea'),
      newButton(() => addDrink('coffee'), 'Coffee'),

      newToggle(uiStore.showingProductBuild, () => uiStore.showProductBuild(!uiStore.showingProductBuild), 'Show Product Build'),
    ]),
    newArrayStrip(new Rectangle(0, 5, 1, 1), [
      newToggle(uiStore.showingPrices, () => uiStore.showPrices(!uiStore.showingPrices), 'Show Prices'),
    ]),
  ].concat(uiStore.showingProductBuild ? [
    newArrayStrip(new Rectangle(1, 5, 3, 1), [
      { ...newLabel(`Software build: ${APP_VERSION}`), xSpan: 3 },
    ]),
    newArrayStrip(new Rectangle(4, 5, 3, 1), [
      { ...newLabel(`Menu build: ${4}`), xSpan: 3 },
    ]),
  ] : [] );
};
