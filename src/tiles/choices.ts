import {
  newLabel, newButton, newToggle,
} from '@/api/tile';
import {
  StripProvider, newListStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import vxm from '@/store';

function onClicky() {
  // do nothing
}

export default function generateChoiceGraph(): StripProvider {
  return newListStrip(new Rectangle(0, 0, 10, 2), [
    newLabel('Hi!'),
    newLabel('Bye!'),
    newButton(onClicky, 'Other CB'),
    newToggle(vxm.order.showingPrices, () => vxm.order.showPrices(!vxm.order.showingPrices), 'Show Prices'),
    newLabel('Subtotal: '),
    newLabel('Total: '),
    newButton(onClicky, 'Grill', 'pi pi-bars'),
    newLabel('1'),
    newLabel('2'),
    newLabel('3'),
    newLabel('4'),
  ], vxm.order.choicePage, vxm.order.gotoNextChoicePage);
}
