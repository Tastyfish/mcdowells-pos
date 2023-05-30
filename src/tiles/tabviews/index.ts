// The actually main menu content in the lower 4/5 of the screen.

import { newLabel, newButton, ButtonTile, Severity, severeup } from '@/api/tile';
import {
  StripProvider, newArrayStrip, newContainerStrip, newDownwardStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import { ChoiceSlot, isPriced } from '@/api/menu';
import { getMenuItem, getChoiceSlot, getChoicesBySlot } from '@/menu';
import Sizes from '@/menu/sizes';

import { ChoiceMenuMode, useOrderStore, useUIStore } from '@/store';
import { SmartOrderPayload } from '@/store/order';

import { generateLunchViewStrips } from './lunch';
import { generateDrinkStrips } from './drinks';
import { generateGiftStrips } from './gifts';
import { getItemPrice } from '@/api/menu';

import { currency } from '@/config/locale.json'

function assertGetSlot(slotID: string) {
  const slot = getChoiceSlot(slotID);

  if (!slot) {
    throw new Error(`Slot ${slotID} could not be found. This is catastrophic.`);
  }

  return slot;
}

function assertGetItem(itemID: string) {
  const item = getMenuItem(itemID);

  if (!item) {
    throw new Error(`Menu item ${itemID} could not be found. This is catastrophic.`);
  }

  return item;
}

const drink = assertGetSlot('drink');
const sauce = assertGetSlot('sauce');
const managerDiscount = assertGetItem('discount01');

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

export async function addDrink(choiceItemID: string): Promise<void> {
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

function giveManagerDiscount(amount: number) {
  const orderStore = useOrderStore();

  // Use managerDiscount as a template, but update label and price.
  orderStore.addLine({
    menuItem: {
      ...managerDiscount,
      displayName: managerDiscount.displayName.replace('???', `${currency}${amount.toFixed(2)}`),
      price: -amount,
    },
  })
}

function newManagerDiscountButton(amt: 1 | 5 | 10 | 25) {
  return {
    ...newButton(() => useUIStore().openNumpad(giveManagerDiscount), 'MGR Discount'),
    severity: Severity.Help,
    price: amt,
    classes: [ 'small-text-button' ],
  } as ButtonTile
}

const generateSpecialFunctionsViewStrips = (): StripProvider[] => ([
  newDownwardStrip(new Rectangle(0, 0, 8, 4), [
    newArrayStrip(new Rectangle(0, 0, 8, 1), [
      newLabel(`Total Items: ${useOrderStore().lines.length}`),
      severeup(newButton(voidMenu, 'Void Order'), Severity.Danger),
      newManagerDiscountButton(1),
    ]),
  ])
]);

export function finishAddLines(): void {
  useUIStore().setChoiceMenuMode(ChoiceMenuMode.Default);
}

export async function addMealItem(payload: string | SmartOrderPayload): Promise<void> {
  await useOrderStore().addSmartOrderLine(payload);

  return finishAddLines();
}

export function newMealButton(mealID: string): ButtonTile {
  const menuItem = getMenuItem(mealID);

  if(!menuItem) {
    return newButton(() => {}, mealID);
  }

  const price = getItemPrice(menuItem, undefined);

  return {
    ...newButton(
      () => addMealItem(mealID),
      menuItem.displayName,
    ),
    price,
    classes: [ 'small-text-button' ],
  };
}

// For the dedicated drinks and condiments menus
const generateStandaloneSlotStrips = (slot: ChoiceSlot, menuID?: string): StripProvider[] => {
  const uiStore = useUIStore();
  const orderStore = useOrderStore();

  return [
    ...generateDrinkStrips(),
    newArrayStrip(new Rectangle(0, 0, 8, 4),
      // Automatically generate tiles based on existing sauces
      getChoicesBySlot(slot.id).map((choice) => ({
        ...newButton(
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
          choice.displayName,
        ),
        price: isPriced(choice) ? getItemPrice(choice) : getItemPrice(slot),
        classes: [ 'small-text-button' ],
      }))
    ),
  ];
};

const generateCondimentViewStrips = (): StripProvider[] => generateStandaloneSlotStrips(sauce);
const generateDrinkViewStrips = (): StripProvider[] => generateStandaloneSlotStrips(drink);

const tabMap: {[tabKey: string]: () => StripProvider[]} = {
  special: generateSpecialFunctionsViewStrips,
  lu0: generateLunchViewStrips,
  dr: generateDrinkViewStrips,
  co0: generateCondimentViewStrips,
  co1: generateGiftStrips,
};

export default function generateTabViewGraph(): StripProvider {
  const currentTab = useUIStore().selectedMenuTab;

  return newContainerStrip(new Rectangle(1, 4, 8, 6),
    tabMap[currentTab]?.() ?? generateDrinkStrips());
}
