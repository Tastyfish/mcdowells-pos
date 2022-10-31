import {
  MenuItem, ChoiceItem, ChoiceSlot,
  NewOrderLine,
  ChoiceSlotMetaInfo,
} from '@/api/order';
import { baseSizesAndHMAndSr, baseSizesAndSr } from './sizes';

/** Generic combo name generator * */
function displayComboName(line: NewOrderLine, name: string): string {
  if (line.size) {
    return `${line.size} ${name}`;
  }
  return name;
}

/** choice-specific line. */
function displaySlot(info: ChoiceSlotMetaInfo, name: string): string {
  return info.choice?.choiceItem.getDisplayName(info.choice) ?? `Missing: ${name}`;
}

export const menu: MenuItem[] = [
  {
    id: 'bigmac',
    getDisplayName: (line) => displayComboName(line, 'Big Mac'),
    choiceSlots: {
      grill: null,
      side: 'fries',
      drink: null,
    },
    allowedSizes: baseSizesAndHMAndSr,
  },
  {
    id: 'nuggets8',
    getDisplayName: (line) => displayComboName(line, '8pc Nuggets'),
    choiceSlots: {
      sauce: null,
      side: 'fries',
      drink: null,
    },
    allowedSizes: baseSizesAndHMAndSr,
  },

  {
    id: 'drink',
    getDisplayName: (line) => displayComboName(line, 'Drink'),
    choiceSlots: { drink: null },
    allowedSizes: baseSizesAndSr,
  },
  {
    id: 'side',
    getDisplayName: (line) => displayComboName(line, 'Side'),
    choiceSlots: { side: null },
    allowedSizes: baseSizesAndSr,
  },

  {
    id: 'gift25',
    getDisplayName: () => '$25 Gift Card',
    choiceSlots: { },
  },
];

export const choices: ChoiceItem[] = [
  {
    id: 'coke',
    getDisplayName: (choice) => displayComboName(choice.line, 'Coca-Cola'),
    slot: 'drink',
  },
  {
    id: 'dietcoke',
    getDisplayName: (choice) => displayComboName(choice.line, 'Diet Coke'),
    slot: 'drink',
  },
  {
    id: 'sprite',
    getDisplayName: (choice) => displayComboName(choice.line, 'Sprite'),
    slot: 'drink',
  },
  {
    id: 'fantaorange',
    getDisplayName: (choice) => displayComboName(choice.line, 'Fanta Orange'),
    slot: 'drink',
  },
  {
    id: 'icedtea',
    getDisplayName: (choice) => displayComboName(choice.line, 'Iced Tea'),
    slot: 'drink',
  },
  {
    id: 'sweettea',
    getDisplayName: (choice) => displayComboName(choice.line, 'Sweet Tea'),
    slot: 'drink',
  },
  {
    id: 'coffee',
    getDisplayName: (choice) => displayComboName(choice.line, 'Coffee'),
    slot: 'drink',
  },

  {
    id: 'fries',
    getDisplayName: (choice) => displayComboName(choice.line, 'Fries'),
    slot: 'side',
  },
  {
    id: 'apples',
    getDisplayName: (choice) => displayComboName(choice.line, 'Apple Slices'),
    slot: 'side',
  },

  {
    id: 'no_sauce',
    getDisplayName: () => 'No Sauce',
    slot: 'sauce',
  },
  {
    id: 'ketchup',
    getDisplayName: () => 'Ketchup',
    slot: 'sauce',
  },
  {
    id: 'honey_mustard',
    getDisplayName: () => 'Honey Mustard',
    slot: 'sauce',
  },
  {
    id: 'bbq',
    getDisplayName: () => 'BBQ Sauce',
    slot: 'sauce',
  },
];

export const choiceSlots: ChoiceSlot[] = [
  {
    id: 'drink',
    getDisplayName: (info) => displaySlot(info, 'Drink'),
    isListed: true,
    isComboOnly: true,
  },
  {
    id: 'side',
    getDisplayName: (info) => displaySlot(info, 'Side'),
    isListed: true,
    isComboOnly: true,
  },
  {
    id: 'grill',
    getDisplayName: (info) => displaySlot(info, 'Toppings'),
    isListed: true,
    grillLabel: 'Grill',
  },
  {
    id: 'sauce',
    getDisplayName: (info) => displaySlot(info, 'Sauce'),
    isListed: true,
    grillLabel: 'Sauce',
  },
];

export function getMenuItem(id: string): MenuItem | undefined {
  return menu.find((item) => item.id === id);
}

export function getChoiceItem(id: string): ChoiceItem | undefined {
  return choices.find((item) => item.id === id);
}

export function getChoicesBySlot(slotID: string): ChoiceItem[] {
  return choices.filter((item) => item.slot === slotID);
}

export function getChoiceSlot(id: string): ChoiceSlot | undefined {
  return choiceSlots.find((item) => item.id === id);
}
