import {
  Severity, newButton,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import vxm from '@/store';

import { menu } from '@/menu';

function onClicky() {
  // do nothing
}

function demoPromo() {
  const gift25 = menu.find((i) => i.internalName === 'gift25');

  if (gift25) {
    vxm.order.addLine({
      menuItem: gift25,
    });
  }
}

export default function generateCommanndsGraph(): StripProvider {
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
    newButton(onClicky, 'Side Choice'),
    newButton(() => {
      if (vxm.order.currentLine) {
        vxm.order.clearLine(vxm.order.currentLine);
      }
    }, 'Void Line'),
    { ...newButton(() => vxm.order.setTotallingOrder(true), 'Total'), ySpan: 2, severity: Severity.Success },
  ]);
}
