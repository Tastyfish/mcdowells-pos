import {
  newLabel, newButton, severeup, Tile, Severity,
} from '@/api/tile';
import {
  StripProvider, newListStrip, newDownwardStrip, newArrayStrip, newContainerStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import vxm, { ChoiceMenuMode } from '@/store';
import { getChoiceSlot, getChoicesBySlot } from '@/menu';
import Sizes from '@/menu/sizes';
import { OrderLine, ChoiceItem } from '@/api/order';

const choiceRect = new Rectangle(0, 0, 10, 2);
const rowRect = new Rectangle(0, 0, 10, 1);

const choiceModeBack = severeup(newButton(
  () => vxm.order.setChoiceMenuMode(ChoiceMenuMode.Default),
  'Back', 'pi pi-arrow-left',
), Severity.Info);

// A mock order line for generating the side buttons.
const mockOrderLine: OrderLine = {
  uid: 0,
  menuItem: {
    choiceSlots: { side: null },
    id: 'mock',
    getDisplayName: () => 'na',
  },
};

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

// A button to replace the side of the current line
function newChoiceButton(choice: ChoiceItem): Tile {
  const sideSlot = getChoiceSlot(choice.slot);

  if (!sideSlot) {
    throw new Error('Side slot missing.');
  }

  return newButton(() => {
    const line = vxm.order.currentLine;
    // Make sure the current line is exists and is a combo.
    if (line && line.size) {
      // Update side.
      vxm.order.addSmartChoice({
        choiceItemID: choice.id,
        line,
        slot: sideSlot,
      });
    }

    // Regardless, return to normal choices.
    vxm.order.setChoiceMenuMode(ChoiceMenuMode.Default);
  }, choice.getDisplayName({
    choiceItem: choice,
    line: mockOrderLine,
  }));
}

function generateSlotButtons(slotID: string): Tile[] {
  return getChoicesBySlot(slotID).map(newChoiceButton);
}

function slotName(id: string): string {
  const slot = getChoiceSlot(id);

  return slot?.grillLabel ?? id;
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
    case ChoiceMenuMode.ChangeSlot:
      return newDownwardStrip(choiceRect, [
        newListStrip(rowRect,
          generateSlotButtons(vxm.order.choiceMenuSlotID ?? 'side'),
          vxm.order.choicePage, vxm.order.gotoNextChoicePage),
        newContainerStrip(rowRect, [
          newArrayStrip(new Rectangle(9, 0, 1, 1), [choiceModeBack]),
        ]),
      ]);
    default:
    {
      const line = vxm.order.currentLine;
      if (!line) {
        return newArrayStrip(choiceRect, []);
      }

      const canCombo = line.menuItem.allowedSizes !== undefined;
      const canHaveSide = 'side' in line.menuItem.choiceSlots && line.size;

      const remainingSlots = Object.keys(line.menuItem.choiceSlots).filter((slotID) => slotID !== 'side' && slotID !== 'drink');

      return newDownwardStrip(choiceRect, [
        newListStrip(rowRect, remainingSlots.map((slot) => newButton(() => vxm.order.setChoiceMenuMode(slot), slotName(slot), 'pi pi-bars')),
          vxm.order.choicePage, vxm.order.gotoNextChoicePage),
        newArrayStrip(rowRect, [
          canCombo
            ? severeup(newButton(() => {
              vxm.order.setChoiceMenuMode(ChoiceMenuMode.ChangeComboSize);
            }, 'Combo', 'pi pi-arrow-right'), Severity.Info)
            : newLabel(''),
          canHaveSide
            ? severeup(newButton(() => {
              vxm.order.setChoiceMenuMode('side');
            }, 'Side', 'pi pi-palette'), Severity.Info)
            : newLabel(''),
        ]),
      ]);
    }
  }
}
