import Sizes from '@/menu/sizes';
import { MenuItem, ChoiceItem } from './menu';

/**
  The new line before it's assigned an ID by the datastore.
*/
export interface NewOrderLine {
  /** info about menu item. */
  readonly menuItem: MenuItem<NewOrderLine>

  /** If this is a combo, the size. */
  readonly size?: Sizes;
}

export function makeCombo(order: NewOrderLine, size: Sizes): NewOrderLine | null {
  // Can be made a combo and have this size?
  if (order.menuItem.allowedSizes?.includes(size)) {
    return { ...order, size };
  }

  return null;
}

/**
  A line in the customer's order
*/
export interface OrderLine extends NewOrderLine {
  /** Unique ID of this line within order */
  readonly id: number
}

export interface NewOrderChoice {
  /** Line this is for. */
  readonly line: OrderLine
  /** info about choice. */
  readonly choiceItem: ChoiceItem<NewOrderChoice>
}

export interface OrderChoice extends NewOrderChoice {
  /** The unique ID of this choice entry. */
  readonly id: number
}
