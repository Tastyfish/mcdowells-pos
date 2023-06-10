import { SplitToggleState, Severity, newToggle, newSplitToggle, withSeverity } from '@/api/tile'
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

export default function generateTabsGraph(): ContainedStripInfo {
    return {
        bounds: new Rectangle(0, 3, 10, 1),
        strip: newTileStrip([
            withSeverity(
                newSplitToggle(getSTab('br'), () => setSTab('br'), 'Breakfast', 'Breakfast 2'),
                Severity.Primary
            ),
            withSeverity(
                newSplitToggle(getSTab('lu'), () => setSTab('lu'), 'Lunch', 'Lunch 2'),
                Severity.Primary
            ),
            withSeverity(
                newSplitToggle(getSTab('mc'), () => setSTab('mc'), 'McValue', 'Salads'),
                Severity.Danger
            ),
            withSeverity(
                newToggle(getTTab('dr'), () => setTTab('dr'), 'Drinks'),
                Severity.Primary
            ),
            withSeverity(
                newToggle(getTTab('cf'), () => setTTab('cf'), 'McCafé'),
                Severity.Primary
            ),
            withSeverity(
                newSplitToggle(getSTab('de'), () => setSTab('de'), 'Desert', 'Desert 2'),
                Severity.Primary
            ),
            withSeverity(
                newToggle(getTTab('hm'), () => setTTab('hm'), 'Happy Meal'),
                Severity.Primary
            ),
            withSeverity(
                newToggle(getTTab('ls'), () => setTTab('ls'), 'LSM'),
                Severity.Primary
            ),
            withSeverity(
                newSplitToggle(getSTab('co'), () => setSTab('co'), 'Condiments', 'Gifts'),
                Severity.Primary
            ),
            withSeverity(
                newToggle(getTTab('special'), () => setTTab('special'), 'Special Functions'),
                Severity.Danger
            ),
        ]),
    }
}
