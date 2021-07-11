/**
  Adaption of order lines into the primevue tree api
  See: https://primefaces.org/primevue/showcase/#/tree
* */

import { OrderLine, OrderChoice } from './order';

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

const selectedStyle = 'background-color: var(--primary-color); color: var(--primary-color-text)';

/**
  Generate tree node for a given order line
  @param {OrderLine} line the line to convert.
  @param {boolean} selected whether it is the current line.
  @return {TreeNode} the tree node.
*/
export function convertLineToTreeNode(line: OrderLine, selected: boolean): TreeNode {
  return {
    key: line.id,
    label: line.menuItem.getDisplayName(line),
    style: selected ? selectedStyle : undefined,
  };
}

/**
  Generate tree node for a given choice. Very similar to above.
  @param {OrderChoice} choice the line to convert.
  @return {TreeNode} the tree node.
*/
export function convertChoiceToTreeNode(choice: OrderChoice): TreeNode {
  return {
    key: choice.id,
    label: choice.choiceItem.getDisplayName(choice),
  };
}

/**
  Generate full order tree.
*/
export function generateLineTree(
  lines: OrderLine[], choices: OrderChoice[], currentLineID: number,
): TreeNode[] {
  return lines.map(
    (line) => ({
      ...convertLineToTreeNode(line, currentLineID === line.id),
      children: choices.filter((c) => c.line === line).map((c) => convertChoiceToTreeNode(c)),
    }),
  );
}
