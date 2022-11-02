// Completely different scene graph fork for when the cashier presses "Total"

import {
  Severity, newButton, severeup, newLabel,
} from '@/api/tile';
import {
  StripProvider, newContainerStrip, newArrayStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import vxm from '@/store';

function backOut() {
  // Leave the screen and go back.
  vxm.ui.setTotallingOrder(false);
}

export default function generateTotalScreenGraph(): StripProvider {
  return newContainerStrip(new Rectangle(0, 0, 10, 10), [
    newArrayStrip(new Rectangle(0, 0, 3, 1), [
      newLabel(`Total Items: ${vxm.order.lines.length}`),
      severeup(newLabel('Total: 0'), Severity.Info),
    ]),
    newArrayStrip(new Rectangle(9, 0, 1, 1), [
      severeup(newButton(backOut, 'Back'), Severity.Info),
    ]),
  ]);
}
