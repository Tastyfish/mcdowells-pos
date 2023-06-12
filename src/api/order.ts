import Sizes from '@/menu/sizes'
import { MenuItem, ChoiceItem } from './menu'

/**
  The new line before it's assigned an ID by the datastore.
*/
export interface NewOrderLine {
    /** info about menu item. */
    readonly menuItem: MenuItem

    /** If this is a combo, the size. */
    readonly size?: Sizes
}

export function makeCombo(order: NewOrderLine, size: Sizes): NewOrderLine | null {
    // Can be made a combo and have this size?
    if (order.menuItem.allowedSizes?.includes(size)) {
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
