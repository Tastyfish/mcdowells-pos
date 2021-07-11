import { MenuItem, ChoiceItem } from '@/api/menu';
import { NewOrderLine, NewOrderChoice } from '@/api/order';
import Sizes from './sizes';

/** Generic combo name generator * */
function displayComboName(item: NewOrderLine, name: string): string {
  if (item.size) {
    return `${item.size} ${name}`;
  }
  return name;
}

export const menu: MenuItem<NewOrderLine>[] = [
  {
    internalName: 'bigmac',
    getDisplayName: (order) => displayComboName(order, 'Big Mac'),
    choiceSlots: {
      grill: null,
      size: 'fries',
      drink: null,
    },
    allowedSizes: [Sizes.Small, Sizes.Medium, Sizes.Large, Sizes.HappyMeal],
  },
];

export const choices: ChoiceItem<NewOrderChoice>[] = [
  {
    internalName: 'cocacola',
    getDisplayName: (choice) => displayComboName(choice.line, 'Coca-Cola'),
    slots: ['drink'],
  },
];
