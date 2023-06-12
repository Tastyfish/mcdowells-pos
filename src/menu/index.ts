import { MenuItem, ChoiceItem, ChoiceSlot } from '@/api/menu';
import Sizes, { baseSizesAndHMAndSr, baseSizesAndSr } from './sizes';

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
    displayName: 'Big Mac',
    choiceSlots: {
      grill: null,
      side: 'fries',
      drink: null,
    },
    allowedSizes: baseSizesAndHMAndSr,
    price: 3.99,
  },
  {
    id: '2cheeseburgers',
    displayName: '2 Cheeseburgers',
    choiceSlots: {
      grill: null,
      side: 'fries',
      drink: null,
    },
    allowedSizes: baseSizesAndHMAndSr,
    price: 2.00,
  },
  {
    id: 'quarterpounder',
    displayName: '¼ Pounder w/ Cheese',
    choiceSlots: {
      grill: null,
      side: 'fries',
      drink: null,
    },
    allowedSizes: baseSizesAndHMAndSr,
    price: 3.79,
  },
  {
    id: 'DBLquarterpounder',
    displayName: 'Double ¼ Pounder w/ Cheese',
    choiceSlots: {
      grill: null,
      side: 'fries',
      drink: null,
    },
    allowedSizes: baseSizesAndHMAndSr,
    price: 4.79,
  },
  {
    id: 'BCNclubhouseburger',
    displayName: 'Bacon Clubhouse Burger',
    choiceSlots: {
      grill: null,
      side: 'fries',
      drink: null,
    },
    allowedSizes: baseSizesAndHMAndSr,
    price: 4.49,
  },
  {
    id: 'nuggets10',
    displayName: '10pc Nuggets',
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
    displayName: 'Drink',
    choiceSlots: { drink: null },
    allowedSizes: baseSizesAndSr,
    price: COMBO_BASE_MOD,
  },
  {
    id: 'side',
    displayName: 'Side',
    choiceSlots: { side: null },
    allowedSizes: baseSizesAndSr,
    price: COMBO_BASE_MOD,
  },
  {
    id: 'sauce',
    displayName: 'Condiment',
    simpleDisplayName: true,
    choiceSlots: { sauce: null },
    price: 0.00, // Since this doesn't have sizes, we don't have to do weird incantations.
  },

  {
    id: 'gift05',
    displayName: '$5 Gift Card',
    simpleDisplayName: true,
    choiceSlots: { },
    price: 5.00,
  },
  {
    id: 'gift10',
    displayName: '$10 Gift Card',
    simpleDisplayName: true,
    choiceSlots: { },
    price: 10.00,
  },
  {
    id: 'gift25',
    displayName: '$25 Gift Card',
    simpleDisplayName: true,
    choiceSlots: { },
    price: 25.00,
  },
  {
    id: 'giftV',
    displayName: '??? Gift Card',
    simpleDisplayName: true,
    choiceSlots: { },
    price: 1.00,
  },
  {
    id: 'discountV', // Label and price is filled in by a numpad callback.
    displayName: '** ??? Discount **',
    simpleDisplayName: true,
    choiceSlots: { },
    price: -1.00,
  },
];

export const choices: ChoiceItem[] = [
  {
    id: 'coke',
    displayName: 'Coca-Cola',
    slot: 'drink',
  },
  {
    id: 'dietcoke',
    displayName: 'Diet Coke',
    slot: 'drink',
  },
  {
    id: 'sprite',
    displayName: 'Sprite',
    slot: 'drink',
  },
  {
    id: 'fantaorange',
    displayName: 'Fanta Orange',
    slot: 'drink',
  },
  {
    id: 'icedtea',
    displayName: 'Iced Tea',
    slot: 'drink',
  },
  {
    id: 'sweettea',
    displayName: 'Sweet Tea',
    slot: 'drink',
  },
  {
    id: 'coffee',
    displayName: 'Coffee',
    slot: 'drink',
  },

  {
    id: 'fries',
    displayName: 'Fries',
    slot: 'side',
  },
  {
    id: 'apples',
    displayName: 'Apple Slices',
    slot: 'side',
    price: 1.00,
  },

  {
    id: 'no_sauce',
    displayName: 'No Sauce',
    simpleDisplayName: true,
    slot: 'sauce',
    price: 0.00,
  },
  {
    id: 'ketchup',
    displayName: 'Ketchup',
    simpleDisplayName: true,
    slot: 'sauce',
  },
  {
    id: 'honey_mustard',
    displayName: 'Honey Mustard',
    simpleDisplayName: true,
    slot: 'sauce',
  },
  {
    id: 'bbq',
    displayName: 'BBQ Sauce',
    simpleDisplayName: true,
    slot: 'sauce',
  },
];

export const choiceSlots: ChoiceSlot[] = [
  {
    id: 'drink',
    displayName: 'Drink',
    isListed: true,
    isComboOnly: true,
    price: [1.00, 1.29, 1.49],
  },
  {
    id: 'side',
    displayName: 'Side',
    isListed: true,
    isComboOnly: true,
    price: [1.39, 1.79, 1.89],
  },
  {
    id: 'grill',
    displayName: 'Toppings',
    isListed: true,
    grillLabel: 'Grill',
    price: 0.00,
  },
  {
    id: 'sauce',
    displayName: 'Sauce',
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
