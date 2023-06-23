import { VALID_NUMBER, VALID_STRING, validateOptional, validateRequired } from './valid'

/**
 * Base for advanced tab items that aren't just menu item keys.
 */
export interface AdvancedTabItem {
    /** Type of advanced item. Determines extra fields. */
    type: string
}

interface PartialVarTabItem extends AdvancedTabItem {
    type: 'var'
    /** What menu item to base this variable item on. */
    base: string
    /** What to use as the button label. */
    label: string
    /** What to replace in the item name to produce the correct receipt item name. Default is '???' */
    replace?: string
    /** What to scale the variable by to get the final price. Defualt is 1. */
    perPrice?: number
}

export type VarTabItem = Required<PartialVarTabItem>

export interface SlotTabItem extends AdvancedTabItem {
    type: 'slot'
    /** Which slot ID to fill the tab with. */
    slot: string
}

export interface ActionTabItem extends AdvancedTabItem {
    type: 'action'
    /** Which tile prefab is being used. Not verified until render. */
    action: string
}

export interface LabelTabItem extends AdvancedTabItem {
    type: 'label'
    /** Which tile prefab is being used. Not verified until render. */
    label: string
}

/** A string means a menu item key. */
export type TabItem = AdvancedTabItem | string

/**
 * Info about a tab view.
 */
export interface TabView {
    /** Outer array is a section, inner is each item. */
    content: TabItem[][]

    /** Whether the drinks bar appears or not. */
    drinks: boolean
}

export function isPartialVarTabItem(item: AdvancedTabItem): item is PartialVarTabItem {
    return (
        item.type === 'var' &&
        validateRequired('VarTabItem', item as PartialVarTabItem, 'base', VALID_STRING) &&
        validateRequired('VarTabItem', item as PartialVarTabItem, 'label', VALID_STRING) &&
        validateOptional('VarTabItem', item as PartialVarTabItem, 'replace', VALID_STRING) &&
        validateOptional('VarTabItem', item as PartialVarTabItem, 'perPrice', VALID_NUMBER)
    )
}

export function isVarTabItem(item: AdvancedTabItem): item is VarTabItem {
    return isPartialVarTabItem(item) && 'perPrice' in item && 'replace' in item
}

export function isSlotTabItem(item: AdvancedTabItem): item is SlotTabItem {
    return item.type === 'slot' && validateRequired('SlotTabItem', item as SlotTabItem, 'slot', VALID_STRING)
}

export function isActionTabItem(item: AdvancedTabItem): item is ActionTabItem {
    return item.type === 'action' && validateRequired('ActionTabItem', item as ActionTabItem, 'action', VALID_STRING)
}

export function isLabelTabItem(item: AdvancedTabItem): item is LabelTabItem {
    return item.type === 'label' && validateRequired('LabelTabItem', item as LabelTabItem, 'label', VALID_STRING)
}

export { default } from './loaders/tabviews'
