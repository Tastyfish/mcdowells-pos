import {
  SplitToggleState, Severity, newToggle, newSplitToggle, severeup,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

// import vxm from '@/store';

function onClicky() {
  // do nothing
}

export default function generateTabsGraph(): StripProvider {
  return newArrayStrip(new Rectangle(0, 3, 9, 1), [
    severeup(
      newSplitToggle(SplitToggleState.Untoggled, onClicky, 'Breakfast', 'Breakfast 2'),
      Severity.Primary,
    ),
    severeup(
      newSplitToggle(SplitToggleState.Untoggled, onClicky, 'Lunch', 'Lunch 2'),
      Severity.Primary,
    ),
    severeup(
      newSplitToggle(SplitToggleState.Untoggled, onClicky, 'McValue', 'Salads'),
      Severity.Danger,
    ),
    severeup(
      newToggle(false, onClicky, 'Drinks'),
      Severity.Primary,
    ),
    severeup(
      newToggle(false, onClicky, 'McCafé'),
      Severity.Primary,
    ),
    severeup(
      newSplitToggle(SplitToggleState.Untoggled, onClicky, 'Desert', 'Desert 2'),
      Severity.Primary,
    ),
    severeup(
      newToggle(false, onClicky, 'Happy Meal'),
      Severity.Primary,
    ),
    severeup(
      newToggle(false, onClicky, 'LSM'),
      Severity.Primary,
    ),
    severeup(
      newSplitToggle(SplitToggleState.Untoggled, onClicky, 'Condiments', 'Gifts'),
      Severity.Primary,
    ),
  ]);
}
