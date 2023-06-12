// Structures for tabs.json

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

/** A string means a menu item key. */
export type TabItem = AdvancedTabItem | string

// Schema of tabs.json
interface TabData {
    // Outer array is a section, inner is each item.
    [tabKey: string]: TabItem[][]
}

import tabs from '@/config/tabs.json'

function isPartialVarTabItem(item: AdvancedTabItem): item is PartialVarTabItem {
    if (item.type !== 'var') {
        return false
    }

    if (!('base' in item) || typeof item.base !== 'string') {
        console.error('Var tab item missing required base in', item)
        return false
    }
    if (!('label' in item) || typeof item.label !== 'string') {
        console.error('Var tab item missing required label in', item)
        return false
    }
    if ('replace' in item && typeof item.replace !== 'string') {
        console.error('Illegal replace in var tab item:', item.label, 'in', item)
        return false
    }
    if ('perPrice' in item && typeof item.perPrice !== 'number') {
        console.error('Illegal perPrice in var tab item:', item.label, 'in', item)
        return false
    }

    return true
}

export function isVarTabItem(item: AdvancedTabItem): item is VarTabItem {
    if (!isPartialVarTabItem(item)) {
        return false
    }

    return item.perPrice !== undefined && item.replace !== undefined
}

export function isSlotTabItem(item: AdvancedTabItem): item is SlotTabItem {
    if (item.type !== 'slot') {
        return false
    }

    if (!('slot' in item) || typeof item.slot !== 'string') {
        console.error('Var tab item missing required slot in', item)
        return false
    }

    return true
}

function sanitizeTabItem(item: TabItem): TabItem | null {
    if (typeof item === 'string') {
        return item
    }

    switch (item.type) {
        case 'var':
            return isPartialVarTabItem(item)
                ? ({
                      replace: '???',
                      perPrice: 1,
                      ...item,
                  } as VarTabItem)
                : null
        case 'slot':
            return isSlotTabItem(item) ? item : null
        default:
            console.error(`Invalid advanced tab item type: ${item.type}`, item)
            return null
    }
}

export default function parseTabs(): TabData {
    return Object.fromEntries(
        Object.entries(tabs).map(([tab, tabData]) => [
            tab,
            tabData.map((section) => section.map((item) => sanitizeTabItem(item)).filter((item) => item !== null) as TabItem[]),
        ])
    )
}
