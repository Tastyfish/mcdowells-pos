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
    internalName: 'bigmac',
    getDisplayName: (line) => displayComboName(line, 'Big Mac'),
    choiceSlots: {
      grill: null,
      side: 'fries',
      drink: null,
    },
    allowedSizes: baseSizesAndHMAndSr,
  },
  {
    internalName: 'nuggets8',
    getDisplayName: (line) => displayComboName(line, '8pc Nuggets'),
    choiceSlots: {
      sauce: null,
      side: 'fries',
      drink: null,
    },
    allowedSizes: baseSizesAndHMAndSr,
  },

  {
    internalName: 'drink',
    getDisplayName: (line) => displayComboName(line, 'Drink'),
    choiceSlots: { drink: null },
    allowedSizes: baseSizesAndSr,
  },
  {
    internalName: 'side',
    getDisplayName: (line) => displayComboName(line, 'Side'),
    choiceSlots: { side: null },
    allowedSizes: baseSizesAndSr,
  },

  {
    internalName: 'gift25',
    getDisplayName: () => '$25 Gift Card',
    choiceSlots: { },
  },
];

export const choices: ChoiceItem[] = [
  {
    internalName: 'coke',
    getDisplayName: (choice) => displayComboName(choice.line, 'Coca-Cola'),
    slot: 'drink',
  },
  {
    internalName: 'dietcoke',
    getDisplayName: (choice) => displayComboName(choice.line, 'Diet Coke'),
    slot: 'drink',
  },
  {
    internalName: 'sprite',
    getDisplayName: (choice) => displayComboName(choice.line, 'Sprite'),
    slot: 'drink',
  },
  {
    internalName: 'fantaorange',
    getDisplayName: (choice) => displayComboName(choice.line, 'Fanta Orange'),
    slot: 'drink',
  },
  {
    internalName: 'icedtea',
    getDisplayName: (choice) => displayComboName(choice.line, 'Iced Tea'),
    slot: 'drink',
  },
  {
    internalName: 'sweettea',
    getDisplayName: (choice) => displayComboName(choice.line, 'Sweet Tea'),
    slot: 'drink',
  },
  {
    internalName: 'coffee',
    getDisplayName: (choice) => displayComboName(choice.line, 'Coffee'),
    slot: 'drink',
  },

  {
    internalName: 'fries',
    getDisplayName: (choice) => displayComboName(choice.line, 'Fries'),
    slot: 'side',
  },
  {
    internalName: 'apples',
    getDisplayName: (choice) => displayComboName(choice.line, 'Apple Slices'),
    slot: 'side',
  },

  {
    internalName: 'no_sauce',
    getDisplayName: () => 'No Sauce',
    slot: 'sauce',
  },
  {
    internalName: 'ketchup',
    getDisplayName: () => 'Ketchup',
    slot: 'sauce',
  },
  {
    internalName: 'honey_mustard',
    getDisplayName: () => 'Honey Mustard',
    slot: 'sauce',
  },
  {
    internalName: 'bbq',
    getDisplayName: () => 'BBQ Sauce',
    slot: 'sauce',
  },
];

export const choiceSlots: ChoiceSlot[] = [
  {
    internalName: 'drink',
    getDisplayName: (info) => displaySlot(info, 'Drink'),
    isListed: true,
    isComboOnly: true,
  },
  {
    internalName: 'side',
    getDisplayName: (info) => displaySlot(info, 'Side'),
    isListed: true,
    isComboOnly: true,
  },
  {
    internalName: 'grill',
    getDisplayName: (info) => displaySlot(info, 'Toppings'),
    isListed: true,
    grillLabel: 'Grill',
  },
  {
    internalName: 'sauce',
    getDisplayName: (info) => displaySlot(info, 'Sauce'),
    isListed: true,
    grillLabel: 'Sauce',
  },
];
