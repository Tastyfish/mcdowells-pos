import {
  Severity, newButton, severeup,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import vxm from '@/store';

function onClicky() {
  // do nothing
}

export default function generateCommanndsGraph(): StripProvider {
  return newArrayStrip(new Rectangle(9, 3, 1, 7), [
    severeup(
      newButton(onClicky, 'Special Functions'),
      Severity.Danger,
    ),
    newButton(onClicky, 'Promo Item'),
    newButton(onClicky, 'Clear Choice'),
    newButton(onClicky, 'Side Choice'),
    newButton(onClicky, 'Void Line'),
    { ...newButton(() => vxm.order.setTotallingOrder(true), 'Total'), ySpan: 2, severity: Severity.Success },
  ]);
}
