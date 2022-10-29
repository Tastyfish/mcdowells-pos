/**
  Adaption of order lines into the primevue tree api
  See: https://primefaces.org/primevue/showcase/#/tree
* */

import { OrderLine, OrderChoice, ChoiceSlot } from './order';

export interface TreeNode {
  key: string | number
  label: string
  data?: unknown
  type?: string
  icon?: string
  children?: TreeNode[]
  style?: string
  styleClass?: string
  selectable?: boolean
  leaf?: boolean
}

const selectedStyle = 'background-color: var(--primary-color); color: var(--primary-color-text);';
const emptySlotStyle = 'color: var(--orange-400);';
const emptySelectedSlotStyle = 'background-color: var(--orange-400); color: var(--primary-color-text);';

/**
  Generate tree node for a given order line
  @param {OrderLine} line the line to convert.
  @param {boolean} selected whether it is the current line.
  @return {TreeNode} the tree node.
*/
export function convertLineToTreeNode(line: OrderLine, selected: boolean): TreeNode {
  return {
    key: line.id.toString(),
    label: line.menuItem.getDisplayName(line),
    style: selected ? selectedStyle : undefined,
  };
}

function getSlotStyle(selected: boolean, empty: boolean) {
  if (selected) {
    return empty ? emptySelectedSlotStyle : selectedStyle;
  }
  return empty ? emptySlotStyle : undefined;
}

/**
  Generate tree node for a given choice. Very similar to above.
  @param {ChoiceSlot} slot the slot to convert.
  @param {OrderChoice} choice the choice.
  @return {TreeNode} the tree node.
*/
export function convertSlotToTreeNode(
  line: OrderLine, slot: ChoiceSlot, choice: OrderChoice | null, selected: boolean,
): TreeNode {
  return {
    key: `${line.id}:${slot.internalName}`,
    label: slot.getDisplayName({ slot, choice: choice ?? undefined }),
    style: getSlotStyle(selected, choice === null),
  };
}

/**
  Generate full order tree.
*/
export function generateLineTree(
  lines: OrderLine[], choices: OrderChoice[], slots: ChoiceSlot[], currentLineID: number,
): TreeNode[] {
  // Generate receipt tree based on provided order.
  return lines.map(
    (line) => ({
      ...convertLineToTreeNode(line, currentLineID === line.id),
      children: Object.keys(line.menuItem.choiceSlots)
        .map((slotID) => ({ slotID, slot: slots.find((s) => s.internalName === slotID) }))
        // Undefined slots always show up for debugging.
        // Otherwise, require it be a listed slot and:
        //   Either this is a combo, or the slot still exists on non-combo items.
        .filter((s) => s.slot === undefined
          || (s.slot.isListed && (line.size !== undefined || !s.slot.isComboOnly)))
        .map((s) => {
          // Get actual slot object.
          if (!s.slot) {
            // Invalid slot, just make placeholder item.
            return { key: s.slotID, label: s.slotID };
          }
          // Get the order's choice, or null.
          const choice = choices.find(
            (c) => c.line === line && c.choiceItem.slot === s.slotID,
          ) ?? null;
          // Convert.
          return convertSlotToTreeNode(line, s.slot, choice, currentLineID === line.id);
        }),
    }),
  );
}
