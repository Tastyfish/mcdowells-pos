import Sizes from '@/menu/sizes';
import { MenuItemM, ChoiceItemM, ChoiceSlotM } from './menu';

/**
  The new line before it's assigned an ID by the datastore.
*/
export interface NewOrderLine {
  /** info about menu item. */
  readonly menuItem: MenuItemM<NewOrderLine>

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
  readonly uid: number
}

export interface NewOrderChoice {
  /** Line this is for. */
  readonly line: OrderLine
  /** info about choice. */
  readonly choiceItem: ChoiceItemM<NewOrderChoice>
}

export interface OrderChoice extends NewOrderChoice {
  /** The unique ID of this choice entry. */
  readonly uid: number
}

export interface ChoiceSlotMetaInfo {
  /** What is our slot? */
  readonly slot: ChoiceSlotM<ChoiceSlotMetaInfo>

  /** What is the filled in order choice selected, if any? */
  readonly choice?: NewOrderChoice
}

// Now export the complete menu interfaces.

export type MenuItem = MenuItemM<NewOrderLine>;
export type ChoiceItem = ChoiceItemM<NewOrderChoice>;
export type ChoiceSlot = ChoiceSlotM<ChoiceSlotMetaInfo>;
