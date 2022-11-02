// The actually main menu content in the lower 4/5 of the screen.

import {
  newLabel, newButton, newToggle, severeup, Severity,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip, newContainerStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import vxm from '@/store';
import { getChoiceSlot, getChoicesBySlot } from '@/menu';
import Sizes from '@/menu/sizes';

const drink = getChoiceSlot('drink');
const sauce = getChoiceSlot('sauce');

async function addSeperateDrink(choiceItemID: string) {
  if (!drink) {
    throw new Error('Drink slot missing. This is a serious error.');
  }

  const lines = await vxm.order.addSmartOrderLine({
    menuItemKey: 'drink',
    defaultSize: Sizes.Medium,
  });

  await Promise.all(lines.map((line) => (
    vxm.order.addSmartChoice({ choiceItemID, line, slot: drink })
  )));
}

async function addDrink(choiceItemID: string): Promise<void> {
  if (!drink) {
    throw new Error('Drink slot missing. This is a serious error.');
  }

  const line = vxm.order.currentLine;
  if (!line) {
    // Just add a drink to the order.
    await addSeperateDrink(choiceItemID);
    return;
  }

  try {
    await vxm.order.addSmartChoice({
      choiceItemID,
      line,
      slot: drink,
    });
  } catch {
    // Likely due to the line not supporting drinks, add a stand-alone smart line.
    await addSeperateDrink(choiceItemID);
  }
}

function voidMenu() {
  vxm.order.lines.forEach((line) => vxm.order.clearLine(line));
}

const generateSpecialFunctionsStrips = (): StripProvider[] => ([
  newArrayStrip(new Rectangle(0, 0, 1, 2), [
    newLabel(`Total Items: ${vxm.order.lines.length}`),
    newButton(voidMenu, 'Void Order'),
  ]),
]);

const generateDrinkStrips = (): StripProvider[] => ([
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
]);

const generateLunchStrips = (): StripProvider[] => ([
  ...generateDrinkStrips(),
  newArrayStrip(new Rectangle(0, 0, 3, 1), [
    newButton(
      () => vxm.order.addSmartOrderLine('bigmac'),
      'Big Mac',
    ),
    newButton(
      () => vxm.order.addSmartOrderLine('nuggets8'),
      'Nuggets',
    ),
  ]),
  newArrayStrip(new Rectangle(2, 2, 3, 1), [
    newButton(
      () => vxm.order.addSmartOrderLine({
        menuItemKey: 'drink',
        defaultSize: Sizes.Medium,
      }),
      'Drink',
    ),
    newButton(
      async () => {
        await vxm.order.addSmartOrderLine({
          menuItemKey: 'side',
          defaultSize: Sizes.Medium,
        });
        vxm.order.setChoiceMenuMode('side');
      },
      'Side',
    ),
    severeup(newLabel(vxm.order.selectedMenuTab), Severity.Info),
  ]),
]);

const generateCondimentStrips = (): StripProvider[] => ([
  ...generateDrinkStrips(),
  newArrayStrip(new Rectangle(0, 0, 8, 2),
    // Automatically generate tiles based on existing sauces
    getChoicesBySlot('sauce').map((choice) => (
      newButton(
        async () => {
          if (!sauce) {
            throw new Error('Sauce slot missing. This is a serious error');
          }

          // Apply sauce to all of the lines added.
          const lines = await vxm.order.addSmartOrderLine('sauce');

          await Promise.all(lines.map((line) => (
            vxm.order.addSmartChoice({
              line,
              choiceItemID: choice.id,
              slot: sauce,
            })
          )));
        },
        choice.getDisplayName({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          line: vxm.order.currentLine!,
          choiceItem: choice,
        }),
      )
    ))),
]);

const tabMap: {[tabKey: string]: () => StripProvider[]} = {
  special: generateSpecialFunctionsStrips,
  lu0: generateLunchStrips,
  co0: generateCondimentStrips,
};

export default function generateTabViewGraph(): StripProvider {
  const currentTab = vxm.order.selectedMenuTab;

  return newContainerStrip(new Rectangle(1, 4, 8, 6),
    tabMap[currentTab]?.() ?? generateDrinkStrips());
}
