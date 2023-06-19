import { ref, readonly } from 'vue'
import { loadConfig } from './config'
import { Tab, isToggleTab, isSplitTab } from '../tab'

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
