// The actually main menu content in the lower 4/5 of the screen.

import {
  newLabel, newButton, newToggle, severeup, Severity,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip, newContainerStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import { ChoiceSlot, OrderLine } from '@/api/order';
import { getChoiceSlot, getChoicesBySlot, getMenuItem } from '@/menu';
import Sizes from '@/menu/sizes';

import vxm from '@/store';

function assertGetSlot(slotID: string) {
  const slot = getChoiceSlot(slotID);

  if (!slot) {
    throw new Error(`Slot ${slotID} could not be found. This is catastrophic.`);
  }

  return slot;
}

const drink = assertGetSlot('drink');
const sauce = assertGetSlot('sauce');

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

const generateSpecialFunctionsViewStrips = (): StripProvider[] => ([
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

    newToggle(vxm.ui.showingPrices, () => vxm.ui.showPrices(!vxm.ui.showingPrices), 'Show Prices'),
  ]),
]);

function finishAddLines(): void {
  vxm.ui.setChoicePage(0);
}

const generateLunchViewStrips = (): StripProvider[] => ([
  ...generateDrinkStrips(),
  newArrayStrip(new Rectangle(0, 0, 3, 1), [
    newButton(
      () => vxm.order.addSmartOrderLine('bigmac').then(finishAddLines),
      'Big Mac',
    ),
    newButton(
      () => vxm.order.addSmartOrderLine('nuggets8').then(finishAddLines),
      'Nuggets',
    ),
  ]),
  newArrayStrip(new Rectangle(2, 2, 3, 1), [
    newButton(
      () => vxm.order.addSmartOrderLine({
        menuItemKey: 'drink',
        defaultSize: Sizes.Medium,
      }).then(finishAddLines),
      'Drink',
    ),
    newButton(
      async () => {
        await vxm.order.addSmartOrderLine({
          menuItemKey: 'side',
          defaultSize: Sizes.Medium,
        });
        vxm.ui.setChoiceMenuMode('side');
      },
      'Side',
    ),
    severeup(newLabel(vxm.ui.selectedMenuTab), Severity.Info),
  ]),
]);

const stripButtonDummyLine: OrderLine = {
  uid: -1,
  menuItem: {
    choiceSlots: {},
    id: 'dummy',
    getDisplayName: () => 'dummy',
  },
};

// For the dedicated drinks and condiments menus
const generateStandaloneSlotStrips = (slot: ChoiceSlot, menuID?: string): StripProvider[] => ([
  ...generateDrinkStrips(),
  newArrayStrip(new Rectangle(0, 0, 8, 4),
    // Automatically generate tiles based on existing sauces
    getChoicesBySlot(slot.id).map((choice) => (
      newButton(
        async () => {
          // Apply sauce to all of the lines added.
          const lines = await vxm.order.addSmartOrderLine({
            menuItemKey: menuID ?? slot.id,
            defaultSize: slot.isComboOnly ? Sizes.Medium : undefined,
          });
          vxm.ui.setChoicePage(0);

          await Promise.all(lines.map((line) => (
            vxm.order.addSmartChoice({
              line,
              choiceItemID: choice.id,
              slot,
            })
          )));
        },
        choice.getDisplayName({
          line: stripButtonDummyLine,
          choiceItem: choice,
        }),
      )
    ))),
]);

const generateCondimentViewStrips = (): StripProvider[] => generateStandaloneSlotStrips(sauce);
const generateDrinkViewStrips = (): StripProvider[] => generateStandaloneSlotStrips(drink);

const tabMap: {[tabKey: string]: () => StripProvider[]} = {
  special: generateSpecialFunctionsViewStrips,
  lu0: generateLunchViewStrips,
  co0: generateCondimentViewStrips,
  dr: generateDrinkViewStrips,
};

export default function generateTabViewGraph(): StripProvider {
  const currentTab = vxm.ui.selectedMenuTab;

  return newContainerStrip(new Rectangle(1, 4, 8, 6),
    tabMap[currentTab]?.() ?? generateDrinkStrips());
}
