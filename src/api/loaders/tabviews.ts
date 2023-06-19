import { ref, readonly } from 'vue'
import { loadConfig } from './config'
import { TabItem, TabView, VarTabItem, isSlotTabItem, isActionTabItem, isLabelTabItem, isPartialVarTabItem } from '../tabview'

interface TabViewLookup {
    [tabKey: string]: TabView
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

function parseTabviews(raw: TabViewLookup): TabViewLookup {
    return Object.fromEntries(Object.entries(raw).map(([tab, tabData]) => [tab, sanitizeTabView(tabData)]))
}

const tabviews = ref({} as TabViewLookup)

async function loadTabviews() {
    tabviews.value = parseTabviews(await loadConfig<TabViewLookup>('tabviews'))
}

loadTabviews()

export default readonly(tabviews)
