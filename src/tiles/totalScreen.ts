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
  useUIStore().totallingOrder = false;
}

async function cashOut() {
  const uiStore = useUIStore();

  uiStore.isLoading = true;

  await useOrderStore().cashOut();

  // Finish up.
  uiStore.resetToNewOrder()
}

export default function generateTotalScreenGraph(): StripProvider {
  const orderStore = useOrderStore();

  const subtotal = orderStore.lines.map((line) => orderStore.getLinePrice(line)).reduce((a, b) => a + b, 0);
  const tax = subtotal * 0.15;
  const grandTotal = subtotal + tax;

  return newContainerStrip(new Rectangle(0, 0, 10, 10), [
    newArrayStrip(new Rectangle(0, 0, 3, 4), [
      { ...newLabel(`Total Items: ${orderStore.lines.length}`), xSpan: 3 },
      { ...newLabel(`Subtotal: $${subtotal.toFixed(2)}`), xSpan: 3 },
      { ...newLabel(`Tax: $${tax.toFixed(2)}`), xSpan: 3 },
      { ...newLabel(`Final Total: $${grandTotal.toFixed(2)}`), xSpan: 3, severity: Severity.Success },
    ]),
    newArrayStrip(new Rectangle(9, 0, 1, 1), [
      severeup(newButton(backOut, 'Back', 'pi pi-arrow-left'), Severity.Info),
    ]),
    newArrayStrip(new Rectangle(9, 6, 1, 4), [
      { ...newButton(cashOut, 'Card', 'pi pi-credit-card'), ySpan: 2, severity: Severity.Primary },
      { ...newButton(cashOut, 'Cash Out', 'pi pi-money-bill'), ySpan: 2, severity: Severity.Success },
    ]),
  ]);
}
