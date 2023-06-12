import { readonly, ref } from 'vue'
import { loadConfig } from './config'

// Structures for tabs.json

export interface Tab {
    key: string
    type?: 'toggle' | 'split'
    severity?: string
}

export interface ToggleTab extends Tab {
    type: 'toggle'
    label: string
}

export interface SplitTab extends Tab {
    type: 'split'
    labels: [string, string]
}

export function isToggleTab(tab: Tab): tab is ToggleTab {
    if (tab.type !== undefined && tab.type !== 'toggle') {
        return false
    }

    if (!('label' in tab) || typeof tab.label !== 'string') {
        console.error('Toggle tab missing required label in', tab)
        return false
    }

    if ('severity' in tab && typeof tab.severity !== 'string') {
        console.error('Illegal severity in tab:', tab.severity, 'in', tab)
        return false
    }

    return true
}

export function isSplitTab(tab: Tab): tab is SplitTab {
    if (tab.type !== 'split') {
        return false
    }

    if (!('labels' in tab) || !(tab.labels instanceof Array) || typeof tab.labels[0] !== 'string' || typeof tab.labels[1] !== 'string') {
        console.error('Split tab missing required [string, string] labels in', tab)
        return false
    }

    if ('severity' in tab && typeof tab.severity !== 'string') {
        console.error('Illegal severity in tab:', tab.severity, 'in', tab)
        return false
    }

    return true
}

function sanitizeTab(tab: Tab): Tab | null {
    switch (tab.type) {
        case undefined:
        case 'toggle':
            return isToggleTab(tab) ? tab : null
        case 'split':
            return isSplitTab(tab) ? tab : null
        default:
            console.error(`Invalid tab type: ${tab.type}`, tab)
            return null
    }
}

function parseTabs(rawTabs: Tab[]): Tab[] {
    return rawTabs.map((tab) => sanitizeTab(tab as Tab)).filter((tab) => tab !== null) as Tab[]
}

const tabs = ref([] as Tab[])

interface RawTabSchema {
    tabs: Tab[]
}

async function loadTabs() {
    tabs.value = parseTabs((await loadConfig<RawTabSchema>('tabs')).tabs)
}

loadTabs()

export default readonly(tabs)
