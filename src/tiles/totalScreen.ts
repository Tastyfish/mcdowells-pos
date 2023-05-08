// Completely different scene graph fork for when the cashier presses "Total"

import {
  Severity, newButton, severeup, newLabel,
} from '@/api/tile';
import {
  StripProvider, newContainerStrip, newArrayStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import { useOrderStore, useUIStore } from '@/store';

function backOut() {
  // Leave the screen and go back.
  useUIStore().setTotallingOrder(false);
}

async function cashOut() {
  const uiStore = useUIStore();

  uiStore.setLoading(true);

  await useOrderStore().cashOut();

  // Finish up.
  uiStore.$reset();
}

export default function generateTotalScreenGraph(): StripProvider {
  return newContainerStrip(new Rectangle(0, 0, 10, 10), [
    newArrayStrip(new Rectangle(0, 0, 3, 1), [
      newLabel(`Total Items: ${useOrderStore().lines.length}`),
      severeup(newLabel('Total: 0'), Severity.Info),
    ]),
    newArrayStrip(new Rectangle(9, 0, 1, 1), [
      severeup(newButton(backOut, 'Back'), Severity.Info),
    ]),
    newArrayStrip(new Rectangle(9, 4, 1, 2), [
      { ...newButton(cashOut, 'Card', 'pi pi-credit-card'), ySpan: 2, severity: Severity.Primary },
    ]),
    newArrayStrip(new Rectangle(9, 6, 1, 2), [
      { ...newButton(cashOut, 'Cash Out', 'pi pi-money-bill'), ySpan: 2, severity: Severity.Success },
    ]),
  ]);
}
