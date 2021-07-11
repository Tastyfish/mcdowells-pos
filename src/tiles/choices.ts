import {
  newLabel, newButton, newToggle, severeup, Tile, Severity,
} from '@/api/tile';
import {
  StripProvider, newListStrip, newDownwardStrip, newArrayStrip, newContainerStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import vxm, { ChoiceMenuMode } from '@/store';
import Sizes from '@/menu/sizes';
import { OrderLine } from '@/api/order';

function onClicky() {
  // do nothing
}

const choiceRect = new Rectangle(0, 0, 10, 2);
const rowRect = new Rectangle(0, 0, 10, 1);

const choiceModeBack = severeup(newButton(
  () => vxm.order.setChoiceMenuMode(ChoiceMenuMode.Default),
  'Back', 'pi pi-arrow-left',
), Severity.Info);

// A button to retroactively change an item's size.
function newSizeButton(size: Sizes): Tile {
  return newButton(() => {
    const line = vxm.order.currentLine;
    // Make sure the current line is exists and combo size still valid.
    if (line?.menuItem.allowedSizes?.includes(size)) {
      // Change size and repost.
      vxm.order.replaceLine({ ...line, size });
    }

    // Regardless, return to normal choices.
    vxm.order.setChoiceMenuMode(ChoiceMenuMode.Default);
  }, size);
}

function generateChoiceButtons(line: OrderLine): Tile[] {
  // Check if is still and item that does combos at all.
  if (line.menuItem.allowedSizes) {
    return line.menuItem.allowedSizes.map(newSizeButton);
  }
  return [];
}

export default function generateChoiceGraph(): StripProvider {
  switch (vxm.order.choiceMenuMode) {
    case ChoiceMenuMode.ChangeComboSize:
      return newDownwardStrip(choiceRect, [
        newListStrip(rowRect,
          vxm.order.currentLine ? generateChoiceButtons(vxm.order.currentLine) : [],
          vxm.order.choicePage, vxm.order.gotoNextChoicePage),
        newContainerStrip(rowRect, [
          newArrayStrip(new Rectangle(9, 0, 1, 1), [choiceModeBack]),
        ]),
      ]);
    default:
      return newDownwardStrip(choiceRect, [
        newListStrip(rowRect, [
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
        ], vxm.order.choicePage, vxm.order.gotoNextChoicePage),
        newArrayStrip(rowRect, [
          severeup(newButton(() => {
            vxm.order.setChoiceMenuMode(ChoiceMenuMode.ChangeComboSize);
          }, 'Combo', 'pi pi-arrow-right'), Severity.Info),
        ]),
      ]);
  }
}
