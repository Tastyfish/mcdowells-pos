import { ComboSize } from './size'
import { MenuItem, ChoiceItem, getMenuItemAllowedSizes } from './menu'

/**
  The new line before it's assigned an ID by the datastore.
*/
export interface NewOrderLine {
    /** info about menu item. */
    readonly menuItem: MenuItem

    /** If this is a combo, the size. */
    readonly size?: ComboSize
}

export function makeCombo(order: NewOrderLine, size: ComboSize): NewOrderLine | null {
    // Can be made a combo and have this size?
    if (getMenuItemAllowedSizes(order.menuItem)?.includes(size)) {
        return { ...order, size }
    }

    return null
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
    readonly choiceItem: ChoiceItem
}

export interface OrderChoice extends NewOrderChoice {
    /** The unique ID of this choice entry. */
    readonly uid: number
}
