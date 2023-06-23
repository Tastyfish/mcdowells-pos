/**
  The restaurant kind of menu.
* */

import { ComboSize, defaultSize, sizeGroups, sizes } from './size'
import { VALID_BOOLEAN, VALID_NULL, VALID_NUMBER, VALID_STRING, validateOptional, validateRequired } from './valid'

/**
  Info about what choice slots a menu item has.
  Key is slot name and value is menu item that is default, or null for no default.
*/
interface ChoiceSlotInfo {
    readonly [slot: string]: string | readonly string[] | null
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
     * Price as a number or a mapping of size IDs to numbers. If using the mapping, the default key will be "_".
     */
    readonly price: number | { [size: string]: number }
}

/**
 * Is this item actually priced?
 * @param item A ChoiceItem or other item type where pricing is optional.
 * @returns Is priced.
 */
export function isPriced(item: Partial<PricedItem>): item is PricedItem {
    return item.price !== undefined
}

export function hasPrice(item: Partial<PricedItem>): item is PricedItem {
    return item.price !== undefined
}

export function getItemPrice(item: PricedItem, size?: ComboSize): number {
    if (typeof item.price === 'number') {
        return item.price
    }

    return item.price[size?.id ?? defaultSize.value?.id ?? '_'] ?? item.price['_'] ?? Number.NaN
}

/**
  Info about a menu item.
*/
export interface MenuItem extends ItemBase, PricedItem {
    /** Slot names and default values for choices */
    readonly choiceSlots: ChoiceSlotInfo

    /** Size group key allowed for comboing this item. If undefined, you cannot combo it. */
    readonly allowedSizes?: string
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
    /** True if allows multiple choices in slot at once. */
    readonly isMulti?: boolean
    /** This choice is specific to combos. */
    readonly isComboOnly?: boolean
    /** The label in the grill bar, if applicable. */
    readonly grillLabel?: string
}

export function getMenuItemAllowedSizes(item: MenuItem): ComboSize[] | undefined {
    if (item.allowedSizes === undefined) {
        return undefined
    }

    return sizeGroups.value[item.allowedSizes].sizes.map((sizeKey) => sizes.value[sizeKey])
}

/**
 * Determine if menu item is valid. Used for data loading.
 * @param item The menu item in question.
 * @returns Typeguard
 */
export function isValidItemBase(item: Partial<ItemBase>): item is ItemBase {
    return (
        validateRequired('ItemBase', item, 'id', VALID_STRING) &&
        validateRequired('ItemBase', item, 'displayName', VALID_STRING) &&
        validateOptional('ItemBase', item, 'simpleDisplayName', VALID_BOOLEAN)
    )
}

/**
 * Determine if priced item is valid. Used for data loading.
 * @param item The priced item in question.
 * @returns Typeguard
 */
export function isValidPricedItem(item: Partial<PricedItem>): item is PricedItem {
    if (
        !('price' in item) ||
        (typeof item.price !== 'number' && !validateRequired('PricedItem', item, 'price', { VALID_NUMBER } as Record<string, number> | number))
    ) {
        console.error('PricedItem missing required price in', item)
        return false
    }

    return true
}

/**
 * Determine if choice slot is valid. Used for data loading.
 * @param slot The choice slot in question.
 * @returns Typeguard
 */
export function isValidChoiceSlot(slot: Partial<ChoiceSlot>): slot is ChoiceSlot {
    return (
        isValidItemBase(slot) &&
        isValidPricedItem(slot as Partial<PricedItem>) &&
        validateOptional('ChoiceSlot', slot as ChoiceSlot, 'isListed', VALID_BOOLEAN) &&
        validateOptional('ChoiceSlot', slot as ChoiceSlot, 'isMulti', VALID_BOOLEAN) &&
        validateOptional('ChoiceSlot', slot as ChoiceSlot, 'isComboOnly', VALID_BOOLEAN) &&
        validateOptional('ChoiceSlot', slot as ChoiceSlot, 'grillLabel', VALID_STRING)
    )
}

/**
 * Determine if choice item is valid. Used for data loading.
 * @param item The choice item in question.
 * @returns Typeguard
 */
export function isValidChoiceItem(item: Partial<ChoiceItem>): item is ChoiceItem {
    return (
        isValidItemBase(item) &&
        (!('price' in item) || isValidPricedItem(item as Partial<PricedItem>)) &&
        validateRequired('ChoiceItem', item as ChoiceItem, 'slot', VALID_STRING)
    )
}

/**
 * Determine if menu item is valid. Used for data loading.
 * @param item The menu item in question.
 * @returns Typeguard
 */
export function isValidMenuItem(item: Partial<MenuItem>): item is MenuItem {
    return (
        isValidItemBase(item) &&
        isValidPricedItem(item as Partial<PricedItem>) &&
        validateRequired('MenuItem', item as MenuItem, 'choiceSlots', { VALID_STRING, a: [VALID_STRING], VALID_NULL } as {
            [key: string]: string | readonly string[] | null
        }) &&
        validateOptional('MenuItem', item as MenuItem, 'allowedSizes', VALID_STRING)
    )
}

export { default as choiceSlots } from './loaders/slots'
export * from './loaders/choices'
export { default as menuItems } from './loaders/menu'
