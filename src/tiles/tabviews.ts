// The actually main menu content in the lower 4/5 of the screen.

import {
  newLabel, newButton, newToggle, severeup, Severity,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip, newContainerStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

// import { OrderLine } from '@/api/order';
// import { menu, choices } from '@/menu';

import vxm from '@/store';
import { choiceSlots } from '@/menu';
import Sizes from '@/menu/sizes';

const drink = choiceSlots.find((s) => s.internalName === 'drink');

function addDrink(choiceItemKey: string): void {
  const line = vxm.order.currentLine;
  if (drink && line) {
    vxm.order.addSmartChoice({
      choiceItemKey,
      line,
      slot: drink,
    });
  }
}

function voidMenu() {
  vxm.order.lines.forEach((line) => vxm.order.clearLine(line));
}

function generateSpecialFunctionsStrips(): StripProvider[] {
  return [
    newArrayStrip(new Rectangle(0, 0, 1, 2), [
      newLabel(`Total Items: ${vxm.order.lines.length}`),
      newButton(voidMenu, 'Void Order'),
    ]),
  ];
}

function generateMenuTabStrips(): StripProvider[] {
  return [
    newArrayStrip(new Rectangle(2, 2, 3, 1), [
      newButton(() => vxm.order.addSmartOrderLine({
        menuItemKey: 'drink',
        defaultSize: Sizes.Medium,
      }), 'Drink'),
      newButton(() => {
        vxm.order.addSmartOrderLine({
          menuItemKey: 'side',
          defaultSize: Sizes.Medium,
        });
        vxm.order.setChoiceMenuMode('side');
      }, 'Side'),
      severeup(newLabel(vxm.order.selectedMenuTab), Severity.Info),
    ]),
    newArrayStrip(new Rectangle(0, 4, 8, 2), [
      newButton(() => addDrink('coke'), 'Coke'),
      newButton(() => addDrink('dietcoke'), 'Diet Coke'),
      newButton(() => addDrink('sprite'), 'Sprite'),
      newButton(() => addDrink('fantaorange'), 'Fanta Orange'),
      newButton(() => addDrink('icedtea'), 'Iced Tea'),
      newButton(() => addDrink('sweettea'), 'Sweet Tea'),
      newButton(() => addDrink('coffee'), 'Coffee'),

      newToggle(false, () => { /* no */ }, 'Show Product Build'),

      newToggle(vxm.order.showingPrices, () => vxm.order.showPrices(!vxm.order.showingPrices), 'Show Prices'),
    ]),
  ];
}

function generateLunchStrips(): StripProvider[] {
  return [
    ...generateMenuTabStrips(),
    newArrayStrip(new Rectangle(0, 0, 3, 1), [
      newButton(() => vxm.order.addSmartOrderLine({
        menuItemKey: 'bigmac',
      }), 'Big Mac'),
      newButton(() => vxm.order.addSmartOrderLine({
        menuItemKey: 'nuggets8',
      }), 'Nuggets'),
    ]),
  ];
}

const tabMap: {[tabKey: string]: () => StripProvider[]} = {
  special: generateSpecialFunctionsStrips,
  lu0: generateLunchStrips,
};

export default function generateTabViewGraph(): StripProvider {
  const currentTab = vxm.order.selectedMenuTab;

  return newContainerStrip(new Rectangle(1, 4, 8, 6),
    tabMap[currentTab]?.() ?? generateMenuTabStrips());
}
