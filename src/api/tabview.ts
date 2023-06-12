import tabviews from '@/config/tabviews.json'

// Structures for tabviews.json

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

interface TabViewLookup {
    [tabKey: string]: TabView
}

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

export function isActionTabItem(item: AdvancedTabItem): item is ActionTabItem {
    if (item.type !== 'action') {
        return false
    }

    if (!('action' in item) || typeof item.action !== 'string') {
        console.error('Var tab item missing required action in', item)
        return false
    }

    return true
}

export function isLabelTabItem(item: AdvancedTabItem): item is LabelTabItem {
    if (item.type !== 'label') {
        return false
    }

    if (!('label' in item) || typeof item.label !== 'string') {
        console.error('Var tab item missing required label in', item)
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
        case 'action':
            return isActionTabItem(item) ? item : null
        case 'label':
            return isLabelTabItem(item) ? item : null
        default:
            console.error(`Invalid advanced tab item type: ${item.type}`, item)
            return null
    }
}

function sanitizeTabView(view: TabView | TabItem[][]): TabView {
    const fullView: TabView = view instanceof Array ? { drinks: true, content: view } : view

    return {
        ...fullView,
        content: fullView.content.map((section) => section.map((item) => sanitizeTabItem(item)).filter((item) => item !== null) as TabItem[]),
    }
}

export default function parseTabviews(): TabViewLookup {
    return Object.fromEntries(Object.entries(tabviews).map(([tab, tabData]) => [tab, sanitizeTabView(tabData)]))
}
