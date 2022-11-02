import {
  createModule, mutation, action,
} from 'vuex-class-component';

import {
  NewOrderLine, OrderLine, NewOrderChoice, OrderChoice, ChoiceSlot,
} from '@/api/order';
import { getMenuItem, getChoiceSlot, getChoiceItem } from '@/menu';
import Sizes from '@/menu/sizes';

export const NO_CURRENT_LINE = -1;

// Options for multiplier choice buttons.
export type OrderCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/// Advanced payload for addSmartOrderLine
export interface SmartOrderPayload {
  /// The menu item key.
  menuItemKey: string
  /// The default size, if no size selected.
  defaultSize?: Sizes
}

const OrderVuexModule = createModule({
  namespaced: 'order',
  strict: true,
});

/// Store module for orders. Is fully replicated to DB.
export class OrderStore extends OrderVuexModule {
  lines: OrderLine[] = [];

  choices: OrderChoice[] = [];

  // Highest order ID that's been used so far; used to assign the ID's
  private highestOrderID = -1;

  // Highest choice ID that's been used so far; used to assign the ID's
  private highestChoiceID = -1;

  currentLineID: number = NO_CURRENT_LINE;

  // Handle size selection.
  sizeSelection: Sizes | null = null;

  // Multiplying count selection.
  countSelection: OrderCount = 1;

  // Incremented to indicate we should scroll the receipt order view.
  scrollOrderCounter = 0;

  // /////////////////////////////////////////////////////////
  // Getters
  // /////////////////////////////////////////////////////////

  get currentLine(): OrderLine | undefined {
    return this.lines.find((line) => line.uid === this.currentLineID);
  }

  // /////////////////////////////////////////////////////////
  // Mutations
  // /////////////////////////////////////////////////////////

  @mutation
  setCurrentLine(line: OrderLine | number): void {
    this.currentLineID = typeof line === 'number' ? line : line.uid;
  }

  @mutation
  addLine(line: NewOrderLine): void {
    // Assign ID to line.
    this.highestOrderID += 1;
    const realLine: OrderLine = { ...line, uid: this.highestOrderID };

    this.lines = this.lines.concat([realLine]);
    this.currentLineID = this.highestOrderID;
    this.sizeSelection = null;
    this.countSelection = 1;
  }

  @mutation
  clearLine(line: OrderLine): void {
    // Remove line and its choices.
    this.lines = this.lines.filter((l) => l.uid !== line.uid);
    this.choices = this.choices.filter((c) => c.line !== line);

    // Also unset current line IF it's the one being removed.
    if (this.currentLineID === line.uid) {
      this.currentLineID = this.lines.length === 0
        ? NO_CURRENT_LINE : this.lines[this.lines.length - 1].uid;
    }
  }

  /**
    Replace existing line with one that contains ID.
    Useful for mutably updating a line with eg. a new size.
    @param {OrderLine} line the new line with index already injected.
  * */
  @mutation
  replaceLine(line: OrderLine): void {
    const idx = this.lines.findIndex((l) => l.uid === line.uid);

    if (idx === -1) {
      throw new RangeError('No existing order with ID.');
    }

    // Replace directly.
    this.lines[idx] = line;

    this.lines = this.lines
      .slice(0, idx)
      .concat([line])
      .concat(this.lines.slice(idx + 1));

    // And now also update all choices.
    this.choices = this.choices.map((c) => {
      if (c.line.uid === line.uid) {
        return { ...c, line };
      }

      return c;
    });
  }

  @mutation
  addChoice(choice: NewOrderChoice): void {
    // Assign ID to choice.
    this.highestChoiceID += 1;
    const realChoice: OrderChoice = { ...choice, uid: this.highestChoiceID };

    this.choices = this.choices.concat([realChoice]);
  }

  @mutation
  clearChoice(choice: OrderChoice): void {
    this.choices = this.choices.filter((l) => l.uid !== choice.uid);
  }

  @mutation
  startSizeSelection(size: Sizes | null): void {
    this.sizeSelection = size;
  }

  @mutation
  startCountSelection(count: OrderCount): void {
    this.countSelection = count;
  }

  @mutation
  scrollOrderView(): void {
    this.scrollOrderCounter += 1;
  }

  // /////////////////////////////////////////////////////////
  // Actions
  // /////////////////////////////////////////////////////////

  /**
    Add an order line, considering size, count, and default choices.
    @param {SmartOrderPayload | string} Either the menu item key, or a SmartOrderPayload.
    @return {OrderLine} the resulting order.
  */
  @action
  addSmartOrderLine(payload: SmartOrderPayload | string): Promise<OrderLine[]> {
    const { menuItemKey, defaultSize } = (typeof payload !== 'string') ? payload : {
      menuItemKey: payload,
      defaultSize: undefined,
    };

    const menuItem = getMenuItem(menuItemKey);

    if (!menuItem) {
      throw new Error(`Menu item ${menuItemKey} does not exist.`);
    }

    // Get size, if a size is selefcted and valid for menu item.
    const size = this.sizeSelection
      && menuItem.allowedSizes?.includes(this.sizeSelection)
      ? this.sizeSelection : defaultSize;

    // copy of count to preserve across loop.
    const count = this.countSelection;

    // Our list of lines.
    const lines: OrderLine[] = Array(count);

    for (let i = 0; i < count; i += 1) {
      this.addLine({ menuItem, size });
      const line = this.currentLine;

      if (!line) {
        throw new Error('Order store is in an invalid state and lines cannot be added.');
      }

      // Add default choices, if they're set.
      Object.entries(menuItem.choiceSlots).forEach(([slotID, slotDefault]) => {
        if (slotDefault) {
          const slot = getChoiceSlot(slotID);
          const choiceItem = getChoiceItem(slotDefault);
          if (slot && choiceItem) {
            this.addChoice({ line, choiceItem });
          }
        }
      });

      lines[i] = line;
    }

    // Select first item again.
    if (lines[0]) {
      this.setCurrentLine(lines[0]);
      this.scrollOrderView();
    }

    return new Promise((resolve) => resolve(lines));
  }

  /**
    Add a choice, removing any overlapping old one.
    @param {Object} payload Info about choice.
  */
  @action
  addSmartChoice(payload: {
    choiceItemID: string, line: OrderLine, slot: ChoiceSlot
  }): Promise<void> {
    // Remove old choice, if applicable.
    const { choiceItemID, line, slot } = payload;

    const oldChoice = this.choices.find((c) => c.line === line
      && c.choiceItem.slot === slot.id);
    if (oldChoice) {
      this.clearChoice(oldChoice);
    }

    // Is this a valid choice?
    if (!(slot.id in line.menuItem.choiceSlots)) {
      return new Promise((_resolve, reject) => reject(new Error(`${line.menuItem.id} can not accept slot ${slot.grillLabel ?? slot.id}`)));
    }

    // Is this a combo choice on a non-combo line?
    if (!line.size && slot.isComboOnly) {
      return new Promise((_resolve, reject) => reject(new Error(`Line is not a combo so cannot accept slot ${slot.grillLabel ?? slot.id}`)));
    }

    // Add new choice
    const choiceItem = getChoiceItem(choiceItemID);
    if (choiceItem) {
      this.addChoice({ line, choiceItem });
    }

    return new Promise((resolve) => resolve());
  }
}
