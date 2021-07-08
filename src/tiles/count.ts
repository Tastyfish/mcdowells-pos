// The 1, 2, 3, etc. buttons to multiply orders.

import {
  newToggle, classup,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import vxm, { OrderCount } from '@/store';

export default function generateCountGraph(): StripProvider {
  return newArrayStrip(new Rectangle(0, 2, 10, 1), Array(10).fill(0).map(
    (_item, index) => classup(newToggle(
      vxm.order.countSelection === index + 1,
      () => {
        if (vxm.order.countSelection === index + 1) {
          vxm.order.startCountSelection(1);
        } else {
          vxm.order.startCountSelection((index + 1) as OrderCount);
        }
      },
      (index + 1).toString(),
    ), 'circle'),
  ));
}
