import {
  Severity, newButton,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import { ChoiceMenuMode, useOrderStore, useUIStore } from '@/store';

import { getMenuItem } from '@/menu';
import Sizes from '@/menu/sizes';

function demoPromo() {
  const gift25 = getMenuItem('gift25');

  if (gift25) {
    useOrderStore().addLine({
      menuItem: gift25,
    });
    useUIStore().setChoiceMenuMode(ChoiceMenuMode.Default);
  }
}

export default function generateCommandsGraph(): StripProvider {
  const orderStore = useOrderStore();
  const uiStore = useUIStore();

  return newArrayStrip(new Rectangle(9, 4, 1, 6), [
    newButton(demoPromo, 'Promo Item'),
    newButton(() => {
      const line = orderStore.currentLine;
      if (line) {
        // clear last choice for line.
        const choice = orderStore.choices.reverse().find((c) => c.line === line);
        if (choice) {
          orderStore.clearChoice(choice);
        }
      }
    }, 'Clear Choice'),
    newButton(async () => {
      await orderStore.addSmartOrderLine({
        menuItemID: 'side',
        defaultSize: Sizes.Medium,
      });
      uiStore.setChoiceMenuMode('side');
    }, 'Side Choice'),
    newButton(() => {
      if (orderStore.currentLine) {
        orderStore.clearLine(orderStore.currentLine);
        uiStore.setChoiceMenuMode(ChoiceMenuMode.Default);
      }
    }, 'Void Line'),
    { ...newButton(() => uiStore.totallingOrder = true, 'Total'), ySpan: 2, severity: Severity.Success },
  ]);
}
