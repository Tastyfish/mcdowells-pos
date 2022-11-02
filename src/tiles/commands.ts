import {
  Severity, newButton,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import vxm from '@/store';

import { menu } from '@/menu';
import Sizes from '@/menu/sizes';

function demoPromo() {
  const gift25 = menu.find((i) => i.id === 'gift25');

  if (gift25) {
    vxm.order.addLine({
      menuItem: gift25,
    });
    vxm.ui.setChoicePage(0);
  }
}

export default function generateCommandsGraph(): StripProvider {
  return newArrayStrip(new Rectangle(9, 4, 1, 6), [
    newButton(demoPromo, 'Promo Item'),
    newButton(() => {
      const line = vxm.order.currentLine;
      if (line) {
        // clear last choice for line.
        const choice = vxm.order.choices.reverse().find((c) => c.line === line);
        if (choice) {
          vxm.order.clearChoice(choice);
        }
      }
    }, 'Clear Choice'),
    newButton(async () => {
      await vxm.order.addSmartOrderLine({
        menuItemKey: 'side',
        defaultSize: Sizes.Medium,
      });
      vxm.ui.setChoiceMenuMode('side');
    }, 'Side Choice'),
    newButton(() => {
      if (vxm.order.currentLine) {
        vxm.order.clearLine(vxm.order.currentLine);
        vxm.ui.setChoicePage(0);
      }
    }, 'Void Line'),
    { ...newButton(() => vxm.ui.setTotallingOrder(true), 'Total'), ySpan: 2, severity: Severity.Success },
  ]);
}
