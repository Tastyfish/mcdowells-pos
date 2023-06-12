import tabs, { Tab, isSplitTab, isToggleTab } from '@/api/tab'
import { SplitToggleState, Severity, newToggle, newSplitToggle, withSeverity, emptyTile } from '@/api/tile'
import { ContainedStripInfo, newTileStrip } from '@/api/strip'
import Rectangle from '@/api/rectangle'
import { useUIStore } from '@/store'

/**
  Select a [tab]0, unless it's already selected, then pick [tab]1.
  @param {string} base The key name of the tab.
*/
function setSTab(base: string): void {
    const tab0 = `${base}0`
    const uiStore = useUIStore()

    if (uiStore.selectedMenuTab === tab0) {
        uiStore.selectedMenuTab = `${base}1`
    } else {
        uiStore.selectedMenuTab = tab0
    }
}

/**
  Convert selected tab into split button state.
  @param {string} base The key name of the tab.
  @return {SplitToggleState} the corresponding state.
*/
function getSTab(base: string): SplitToggleState {
    const uiStore = useUIStore()

    if (uiStore.selectedMenuTab === `${base}0`) {
        return SplitToggleState.Top
    }
    if (uiStore.selectedMenuTab === `${base}1`) {
        return SplitToggleState.Bottom
    }
    return SplitToggleState.Untoggled
}

/**
  Select a [tab].
  @param {string} base The key name of the tab.
*/
function setTTab(base: string): void {
    useUIStore().selectedMenuTab = base
}

/**
  Convert selected tab into toggle button state.
  @param {string} base The key name of the tab.
  @return {boolean} the corresponding state.
*/
function getTTab(base: string): boolean {
    return useUIStore().selectedMenuTab === base
}

function generateTabButton(tab: Tab) {
    if (isToggleTab(tab)) {
        return withSeverity(
            newToggle(getTTab(tab.key), () => setTTab(tab.key), tab.label),
            (tab.severity as Severity) ?? Severity.Primary
        )
    } else if (isSplitTab(tab)) {
        return withSeverity(
            newSplitToggle(getSTab(tab.key), () => setSTab(tab.key), tab.labels[0], tab.labels[1]),
            (tab.severity as Severity) ?? Severity.Primary
        )
    }

    console.error('Unknown tab type: ', tab)
    return emptyTile
}

export default function generateTabsGraph(): ContainedStripInfo {
    return {
        bounds: new Rectangle(0, 3, 10, 1),
        strip: newTileStrip(tabs.value.map((tab) => generateTabButton(tab))),
    }
}
