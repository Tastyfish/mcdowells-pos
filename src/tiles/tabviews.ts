// The actually main menu content in the lower 4/5 of the screen.

import {
  newLabel, newButton, newToggle, severeup, Severity,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip, newContainerStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import { ChoiceSlot, OrderLine } from '@/api/order';
import { getChoiceSlot, getChoicesBySlot } from '@/menu';
import Sizes from '@/menu/sizes';

import { ChoiceMenuMode, useOrderStore, useUIStore } from '@/store';
import { SmartOrderPayload } from '@/store/order';

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

  const orderStore = useOrderStore();

  const lines = await orderStore.addSmartOrderLine({
    menuItemID: 'drink',
    defaultSize: Sizes.Medium,
  });

  await Promise.all(lines.map((line) => (
    orderStore.addSmartChoice({ choiceItemID, line, slot: drink })
  )));
}

async function addDrink(choiceItemID: string): Promise<void> {
  if (!drink) {
    throw new Error('Drink slot missing. This is a serious error.');
  }

  const orderStore = useOrderStore();

  const line = orderStore.currentLine;
  if (!line) {
    // Just add a drink to the order.
    await addSeperateDrink(choiceItemID);
    return;
  }

  try {
    await orderStore.addSmartChoice({
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
  const orderStore = useOrderStore();
  orderStore.lines.forEach((line) => orderStore.clearLine(line));
}

const generateSpecialFunctionsViewStrips = (): StripProvider[] => ([
  newArrayStrip(new Rectangle(0, 0, 1, 2), [
    newLabel(`Total Items: ${useOrderStore().lines.length}`),
    newButton(voidMenu, 'Void Order'),
  ]),
]);

const generateDrinkStrips = (): StripProvider[] => {
  const uiStore = useUIStore();

  return [
    newArrayStrip(new Rectangle(0, 4, 8, 2), [
      newButton(() => addDrink('coke'), 'Coke'),
      newButton(() => addDrink('dietcoke'), 'Diet Coke'),
      newButton(() => addDrink('sprite'), 'Sprite'),
      newButton(() => addDrink('fantaorange'), 'Fanta Orange'),
      newButton(() => addDrink('icedtea'), 'Iced Tea'),
      newButton(() => addDrink('sweettea'), 'Sweet Tea'),
      newButton(() => addDrink('coffee'), 'Coffee'),

      newToggle(false, () => { /* no */ }, 'Show Product Build'),

      newToggle(uiStore.showingPrices, () => uiStore.showPrices(!uiStore.showingPrices), 'Show Prices'),
    ]),
  ];
};

function finishAddLines(): void {
  useUIStore().setChoiceMenuMode(ChoiceMenuMode.Default);
}

function addMealItem(payload: string | SmartOrderPayload): Promise<void> {
  return useOrderStore()
    .addSmartOrderLine(payload)
    .then(finishAddLines);
}

const generateLunchViewStrips = (): StripProvider[] => ([
  ...generateDrinkStrips(),
  newArrayStrip(new Rectangle(0, 0, 3, 1), [
    newButton(
      () => addMealItem('bigmac'),
      'Big Mac',
    ),
    newButton(
      () => addMealItem('nuggets10'),
      'Nuggets',
    ),
  ]),
  newArrayStrip(new Rectangle(2, 2, 3, 1), [
    newButton(
      () => addMealItem({
        menuItemID: 'drink',
        defaultSize: Sizes.Medium,
      }),
      'Drink',
    ),
    newButton(
      async () => {
        await useOrderStore().addSmartOrderLine({
          menuItemID: 'side',
          defaultSize: Sizes.Medium,
        });
        useUIStore().setChoiceMenuMode('side');
      },
      'Side',
    ),
    severeup(newLabel(useUIStore().selectedMenuTab), Severity.Info),
  ]),
]);

const stripButtonDummyLine: OrderLine = {
  uid: -1,
  menuItem: {
    choiceSlots: {},
    id: 'dummy',
    getDisplayName: () => { throw new Error('This shouldn\'t be called.'); },
  },
};

// For the dedicated drinks and condiments menus
const generateStandaloneSlotStrips = (slot: ChoiceSlot, menuID?: string): StripProvider[] => {
  const uiStore = useUIStore();
  const orderStore = useOrderStore();

  return [
    ...generateDrinkStrips(),
    newArrayStrip(new Rectangle(0, 0, 8, 4),
      // Automatically generate tiles based on existing sauces
      getChoicesBySlot(slot.id).map((choice) => (
        newButton(
          async () => {
            // Apply sauce to all of the lines added.
            const lines = await orderStore.addSmartOrderLine({
              menuItemID: menuID ?? slot.id,
              defaultSize: slot.isComboOnly ? Sizes.Medium : undefined,
            });
            uiStore.setChoiceMenuMode(ChoiceMenuMode.Default);

            await Promise.all(lines.map((line) => (
              orderStore.addSmartChoice({
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
      ))
    ),
  ];
};

const generateCondimentViewStrips = (): StripProvider[] => generateStandaloneSlotStrips(sauce);
const generateDrinkViewStrips = (): StripProvider[] => generateStandaloneSlotStrips(drink);

const tabMap: {[tabKey: string]: () => StripProvider[]} = {
  special: generateSpecialFunctionsViewStrips,
  lu0: generateLunchViewStrips,
  co0: generateCondimentViewStrips,
  dr: generateDrinkViewStrips,
};

export default function generateTabViewGraph(): StripProvider {
  const currentTab = useUIStore().selectedMenuTab;

  return newContainerStrip(new Rectangle(1, 4, 8, 6),
    tabMap[currentTab]?.() ?? generateDrinkStrips());
}
