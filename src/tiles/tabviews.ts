// The actually main menu content in the lower 4/5 of the screen.

import {
  newLabel, severeup, Severity,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip, newContainerStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import vxm from '@/store';

export default function generateTabViewGraph(): StripProvider {
  return newContainerStrip(new Rectangle(1, 4, 8, 6), [
    newArrayStrip(new Rectangle(1, 1, 1, 1), [
      severeup(newLabel(vxm.order.selectedMenuTab), Severity.Info),
    ]),
  ]);
}
