import {
  MenuItem, ChoiceItem, ChoiceSlot,
  NewOrderLine,
  ChoiceSlotMetaInfo,
} from '@/api/order';
import Sizes, { baseSizesAndHMAndSr, baseSizesAndSr } from './sizes';

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

type ComboOffset = {
  [size in Sizes]: number;
};

// Default offset. Also used for stand-alone drinks and sides to counter the built-in discount.
const COMBO_BASE_MOD = 1.08;

/**
 * How much to add to a combo after totalling the contents.
 */
export const COMBO_OFFSETS: ComboOffset = {
  [Sizes.HappyMeal]: -1.58,
  [Sizes.XSmall]: -3.08,
  [Sizes.Small]: -COMBO_BASE_MOD,
  [Sizes.Medium]: -COMBO_BASE_MOD,
  [Sizes.Large]: -COMBO_BASE_MOD,
  [Sizes.Senior]: -2.08,
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
    price: 3.99,
  },
  {
    id: 'nuggets10',
    getDisplayName: (line) => displayComboName(line, '10pc Nuggets'),
    choiceSlots: {
      sauce: null,
      side: 'fries',
      drink: null,
    },
    allowedSizes: baseSizesAndHMAndSr,
    price: 4.19, // sauce discounted.
  },

  {
    id: 'drink',
    getDisplayName: (line) => displayComboName(line, 'Drink'),
    choiceSlots: { drink: null },
    allowedSizes: baseSizesAndSr,
    price: COMBO_BASE_MOD,
  },
  {
    id: 'side',
    getDisplayName: (line) => displayComboName(line, 'Side'),
    choiceSlots: { side: null },
    allowedSizes: baseSizesAndSr,
    price: COMBO_BASE_MOD,
  },
  {
    id: 'sauce',
    getDisplayName: () => 'Condiment',
    choiceSlots: { sauce: null },
    price: 0.00, // Since this doesn't have sizes, we don't have to do weird incantations.
  },

  {
    id: 'gift25',
    getDisplayName: () => '$25 Gift Card',
    choiceSlots: { },
    price: 25.00,
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
    price: 1.00,
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
    price: [1.00, 1.29, 1.49],
  },
  {
    id: 'side',
    getDisplayName: (info) => displaySlot(info, 'Side'),
    isListed: true,
    isComboOnly: true,
    price: [1.39, 1.79, 1.89],
  },
  {
    id: 'grill',
    getDisplayName: (info) => displaySlot(info, 'Toppings'),
    isListed: true,
    grillLabel: 'Grill',
    price: 0.00,
  },
  {
    id: 'sauce',
    getDisplayName: (info) => displaySlot(info, 'Sauce'),
    isListed: true,
    grillLabel: 'Sauce',
    price: 0.30,
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
