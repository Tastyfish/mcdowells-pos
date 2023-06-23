import { VALID_NUMBER, VALID_STRING, validateRequired } from './valid'

export interface ComboSize {
    /** Internal ID */
    id: string
    /** Label to stick in front of combos, eg Sm, Med, Lg */
    label: string
    /** The icon key to use for the button. */
    icon: string
    /** Price offset in a combo relative to buying a-la-carte. */
    priceOffset: number
}

export interface ComboSizeGroup {
    /** The ID used in the menu item definition. */
    id: string
    /** Menu item ID's in the group. */
    sizes: string[]
}

export function isValidComboSize(size: Partial<ComboSize>): size is ComboSize {
    return (
        validateRequired('ComboSize', size, 'id', VALID_STRING) &&
        validateRequired('ComboSize', size, 'label', VALID_STRING) &&
        validateRequired('ComboSize', size, 'icon', VALID_STRING) &&
        validateRequired('ComboSize', size, 'priceOffset', VALID_NUMBER)
    )
}

export function isValidComboGroup(group: Partial<ComboSizeGroup>): group is ComboSizeGroup {
    return validateRequired('ComboSizeGroup', group, 'id', VALID_STRING) && validateRequired('ComboSizeGroup', group, 'sizes', [VALID_STRING])
}

export * from './loaders/sizes'
