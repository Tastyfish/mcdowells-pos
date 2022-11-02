import {
  SplitToggleState, Severity, newToggle, newSplitToggle, severeup,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import vxm from '@/store';

/**
  Select a [tab]0, unless it's already selected, then pick tab[1].
  @param {string} base The key name of the tab.
*/
function setSTab(base: string): void {
  const tab0 = `${base}0`;

  if (vxm.ui.selectedMenuTab === tab0) {
    vxm.ui.setSelectedMenuTab(`${base}1`);
  } else {
    vxm.ui.setSelectedMenuTab(tab0);
  }
}

/**
  Convert selected tab into split button state.
  @param {string} base The key name of the tab.
  @return {SplitToggleState} the corresponding state.
*/
function getSTab(base: string): SplitToggleState {
  if (vxm.ui.selectedMenuTab === `${base}0`) {
    return SplitToggleState.Top;
  }
  if (vxm.ui.selectedMenuTab === `${base}1`) {
    return SplitToggleState.Bottom;
  }
  return SplitToggleState.Untoggled;
}

/**
  Select a [tab].
  @param {string} base The key name of the tab.
*/
function setTTab(base: string): void {
  vxm.ui.setSelectedMenuTab(base);
}

/**
  Convert selected tab into toggle button state.
  @param {string} base The key name of the tab.
  @return {boolean} the corresponding state.
*/
function getTTab(base: string): boolean {
  return vxm.ui.selectedMenuTab === base;
}

export default function generateTabsGraph(): StripProvider {
  return newArrayStrip(new Rectangle(0, 3, 10, 1), [
    severeup(
      newSplitToggle(getSTab('br'), () => setSTab('br'), 'Breakfast', 'Breakfast 2'),
      Severity.Primary,
    ),
    severeup(
      newSplitToggle(getSTab('lu'), () => setSTab('lu'), 'Lunch', 'Lunch 2'),
      Severity.Primary,
    ),
    severeup(
      newSplitToggle(getSTab('mc'), () => setSTab('mc'), 'McValue', 'Salads'),
      Severity.Danger,
    ),
    severeup(
      newToggle(getTTab('dr'), () => setTTab('dr'), 'Drinks'),
      Severity.Primary,
    ),
    severeup(
      newToggle(getTTab('cf'), () => setTTab('cf'), 'McCafé'),
      Severity.Primary,
    ),
    severeup(
      newSplitToggle(getSTab('de'), () => setSTab('de'), 'Desert', 'Desert 2'),
      Severity.Primary,
    ),
    severeup(
      newToggle(getTTab('hm'), () => setTTab('hm'), 'Happy Meal'),
      Severity.Primary,
    ),
    severeup(
      newToggle(getTTab('ls'), () => setTTab('ls'), 'LSM'),
      Severity.Primary,
    ),
    severeup(
      newSplitToggle(getSTab('co'), () => setSTab('co'), 'Condiments', 'Gifts'),
      Severity.Primary,
    ),
    severeup(
      newToggle(getTTab('special'), () => setTTab('special'), 'Special Functions'),
      Severity.Danger,
    ),
  ]);
}
