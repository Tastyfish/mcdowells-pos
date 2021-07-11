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
  readonly internalName: string

  /** Generator for user-friendly display name. */
  readonly getDisplayName: (info: MetaInfo) => string
}

/**
  Info about a menu item.
*/
export interface MenuItem<M> extends ItemBase<M> {
  /** Slot names and default values for choices */
  readonly choiceSlots: ChoiceSlotInfo

  /** Sizes allowed for comboing this item. */
  readonly allowedSizes?: Sizes[];
}

/**
  Info about a specific choice of a menu item.
*/
export interface ChoiceItem<M> extends ItemBase<M> {
  /** Which slots it can fit into. */
  readonly slots: string[]
}
