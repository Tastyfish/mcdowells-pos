/**
  The restaurant kind of menu.
* */

import Sizes from '@/menu/sizes'

/**
  Info about what choice slots a menu item has.
  Key is slot name and value is menu item that is default, or null for no default.
*/
interface ChoiceSlotInfo {
    [slot: string]: string | null
}

interface ItemBase {
    /** Internal unique identifier */
    readonly id: string

    readonly displayName: string

    /// Normally extra terms are added to the display name, such as size and quantity.
    /// Setting this to true will only show the display name.
    readonly simpleDisplayName?: boolean
}

export interface PricedItem {
    /**
     * Price as a number or 3 numbers for the 3 sizes.
     */
    readonly price: number | [number, number, number]
}

/**
 * Is this item actually priced?
 * @param item A ChoiceItem or other item type where pricing is optional.
 * @returns Is priced.
 */
export function isPriced(item: Partial<PricedItem>): item is PricedItem {
    return item.price !== undefined
}

/**
 * Convert a size to an index in the price[size] array.
 * @param size The size to get an index of. Medium is the default.
 * @returns Size index.
 */
function getSizeComboPricingIndex(size?: Sizes): 0 | 1 | 2 {
    switch (size) {
        case Sizes.Medium:
        case undefined:
            return 1
        case Sizes.Large:
            return 2
        default:
            return 0
    }
}

export function hasPrice(item: Partial<PricedItem>): item is PricedItem {
    return item.price !== undefined
}

export function getItemPrice(item: PricedItem, size?: Sizes): number {
    if (typeof item.price === 'number') {
        return item.price
    }

    return item.price[getSizeComboPricingIndex(size)]
}

/**
  Info about a menu item.
*/
export interface MenuItem extends ItemBase, PricedItem {
    /** Slot names and default values for choices */
    readonly choiceSlots: ChoiceSlotInfo

    /** Sizes allowed for comboing this item. */
    readonly allowedSizes?: Sizes[]
}

/**
  Info about a specific choice of a menu item.
*/
export interface ChoiceItem extends ItemBase, Partial<PricedItem> {
    /** Which slots it can fit into. */
    readonly slot: string
}

/**
  Info about a choice slot.
*/
export interface ChoiceSlot extends ItemBase, PricedItem {
    /** True if listed in a receipt as its own line. */
    readonly isListed?: boolean
    /** This choice is specific to combos. */
    readonly isComboOnly?: boolean
    /** The label in the grill bar, if applicable. */
    readonly grillLabel?: string
}
