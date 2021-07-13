import {
  Severity, newButton, severeup,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import vxm from '@/store';

import { menu, choices } from '@/menu';
import Sizes from '@/menu/sizes';

function onClicky() {
  // do nothing
}

function demoPromo() {
  const bigmac = menu.find((i) => i.internalName === 'bigmac');
  const coke = choices.find((i) => i.internalName === 'cocacola');

  if (bigmac && coke) {
    vxm.order.addLine({
      menuItem: bigmac,
      size: Sizes.Small,
    });
    const line = vxm.order.currentLine;

    if (line) {
      vxm.order.addChoice({
        line,
        choiceItem: coke,
      });
    }
  }
}

export default function generateCommanndsGraph(): StripProvider {
  return newArrayStrip(new Rectangle(9, 3, 1, 7), [
    severeup(
      newButton(onClicky, 'Special Functions'),
      Severity.Danger,
    ),
    newButton(demoPromo, 'Promo Item'),
    newButton(onClicky, 'Clear Choice'),
    newButton(onClicky, 'Side Choice'),
    newButton(() => {
      if (vxm.order.currentLine) {
        vxm.order.clearLine(vxm.order.currentLine);
      }
    }, 'Void Line'),
    { ...newButton(() => vxm.order.setTotallingOrder(true), 'Total'), ySpan: 2, severity: Severity.Success },
  ]);
}
