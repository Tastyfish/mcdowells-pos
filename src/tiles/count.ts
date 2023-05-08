// The 1, 2, 3, etc. buttons to multiply orders.

import {
  newToggle, classup,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import { OrderCount, useOrderStore } from '@/store';

export default function generateCountGraph(): StripProvider {
  const orderStore = useOrderStore();

  return newArrayStrip(new Rectangle(0, 2, 10, 1), Array(10).fill(0).map(
    (_item, index) => classup(newToggle(
      orderStore.countSelection === index + 1,
      () => {
        if (orderStore.countSelection === index + 1) {
          orderStore.startCountSelection(1);
        } else {
          orderStore.startCountSelection((index + 1) as OrderCount);
        }
      },
      (index + 1).toString(),
    ), ['circle']),
  ));
}
