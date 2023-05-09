/**
  The restaurant kind of menu.
* */

import Sizes from '@/menu/sizes';

/**
  Info about what choice slots a menu item has.
  Key is slot name and value is menu item that is default, or null for no default.
*/
interface ChoiceSlotInfo {
  [slot: string]: string | null;
}

interface ItemBase<MetaInfo> {
  /** Internal unique identifier */
  readonly id: string

  /** Generator for user-friendly display name. */
  readonly getDisplayName: (info: MetaInfo) => string
}

export interface PricedItem {
  /**
   * Price as a number or 3 numbers for the 3 sizes.
   */
  readonly price: number | [number, number, number]
}

function getSizeComboPricingIndex(size?: Sizes): 0 | 1 | 2 {
  switch(size) {
    case Sizes.Medium:
      return 1;
    case Sizes.Large:
      return 2;
    default:
      return 0;
  }
}

export function hasPrice(item: Partial<PricedItem>): item is PricedItem {
  return item.price !== undefined;
}

export function getItemPrice(item: PricedItem, size?: Sizes): number {
  if(typeof item.price === "number") {
    return item.price;
  }

  return item.price[getSizeComboPricingIndex(size)];
}

/**
  Info about a menu item.
*/
export interface MenuItemM<M> extends ItemBase<M>, PricedItem {
  /** Slot names and default values for choices */
  readonly choiceSlots: ChoiceSlotInfo

  /** Sizes allowed for comboing this item. */
  readonly allowedSizes?: Sizes[]
}

/**
  Info about a specific choice of a menu item.
*/
export interface ChoiceItemM<M> extends ItemBase<M>, Partial<PricedItem> {
  /** Which slots it can fit into. */
  readonly slot: string
}

/**
  Info about a choice slot.
*/
export interface ChoiceSlotM<M> extends ItemBase<M>, PricedItem {
  /** True if listed in a receipt as its own line. */
  readonly isListed?: boolean
  /** This choice is specific to combos. */
  readonly isComboOnly?: boolean
  /** The label in the grill bar, if applicable. */
  readonly grillLabel?: string
}
