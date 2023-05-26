/**
  Adaption of order lines into the primevue tree api
  See: https://primefaces.org/primevue/showcase/#/tree
* */

import { TreeNode } from 'primevue/tree';

import { ChoiceSlot } from './menu';
import { OrderLine, OrderChoice } from './order';
import { getMenuItemDisplayName, getChoiceSlotDisplayName } from './displayname';
import { useOrderStore, useUIStore } from '@/store';
import { getOrderTotals } from './cashout';

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
    key: line.uid.toString(),
    label: getMenuItemDisplayName(line),
    style: selected ? selectedStyle : undefined,
    type: "priced",
    data: useOrderStore().getLinePrice(line),
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
    key: `${line.uid}:${slot.id}`,
    label: getChoiceSlotDisplayName(slot, choice ?? undefined),
    style: getSlotStyle(selected, choice === null),
  };
}

/**
 * Generate extra nodes at the end if the order is being totalled.
 * @returns {TreeNode[]} The tree nodes.
 */
function getTotalsNodes(): TreeNode[] {
  const orders = useOrderStore();
  const ui = useUIStore();

  if (!ui.totallingOrder || orders.lines.length === 0) {
    return [];
  }

  // Use the last real line's ID for all of them since they shouldn't be selected.
  const lastLineID = orders.lines[orders.lines.length - 1].uid.toString();
  const totals = getOrderTotals();

  return [
    {
      key: `${lastLineID}:subtotal`,
      label: 'Subtotal:',
      type: 'priced',
      data: totals.subtotal,
      icon: 'pi pi-calculator',
    },
    {
      key: `${lastLineID}:tax`,
      label: 'Tax:',
      type: 'priced',
      data: totals.tax,
      icon: 'pi pi-credit-card',
    },
    {
      key: `${lastLineID}:grantTotal`,
      label: 'Final Total:',
      type: 'priced',
      data: totals.grandTotal,
      styleClass: 'p-inline-message p-inline-message-success',
    },
  ]
}

/**
  Generate full order tree.
*/
export function generateLineTree(
  lines: OrderLine[], currentLineID: number,
): TreeNode[] {
  // Generate receipt tree based on provided order.
  return lines
    .map(
      (line) => ({
        ...convertLineToTreeNode(line, currentLineID === line.uid),
        children: useOrderStore().getLineChoices(line).map(choiceInfo => {
          if(choiceInfo.choice !== undefined && choiceInfo.slot) {
            return convertSlotToTreeNode(line, choiceInfo.slot, choiceInfo.choice, currentLineID === line.uid)
          } else {
            // Invalid slot, just make placeholder item.
            return { key: choiceInfo.slotID, label: choiceInfo.slotID };
          }
        })
      } as TreeNode),
    )
    .concat(getTotalsNodes());
}
