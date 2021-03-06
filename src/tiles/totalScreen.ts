// Completely different scene graph fork for when the cashier presses "Total"

import {
  Severity, newButton, severeup,
} from '@/api/tile';
import {
  StripProvider, newContainerStrip, newArrayStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import vxm from '@/store';

function backOut() {
  // Leave the screen and go back.
  vxm.order.setTotallingOrder(false);
}

export default function generateTotalScreenGraph(): StripProvider {
  return newContainerStrip(new Rectangle(0, 0, 10, 10), [
    newArrayStrip(new Rectangle(9, 0, 1, 1), [
      severeup(newButton(backOut, 'Back'), Severity.Info),
    ]),
  ]);
}
