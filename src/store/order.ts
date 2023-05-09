import { defineStore } from 'pinia';

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
  /// The menu item id.
  menuItemID: string
  /// The default size, if no size selected.
  defaultSize?: Sizes
}

/// Store module for orders. Is fully replicated to DB.

export const useOrderStore = defineStore('order', {
  state: () => ({
    lines: [] as OrderLine[],
    choices: [] as OrderChoice[],

    // Highest order ID that's been used so far; used to assign the ID's
    _highestOrderID: -1,

    // Highest choice ID that's been used so far; used to assign the ID's
    _highestChoiceID: -1,

    currentLineID: NO_CURRENT_LINE,

    // Handle size selection.
    sizeSelection: null as Sizes | null,

    // Multiplying count selection.
    countSelection: 1 as OrderCount,

    // Incremented to indicate we should scroll the receipt order view.
    scrollOrderCounter: 0,
  }),
  getters: {
    currentLine(): OrderLine | undefined {
      return this.lines.find((line) => line.uid === this.currentLineID)
    }
  },
  actions: {
    setCurrentLine(line: OrderLine | number): void {
      this.currentLineID = typeof line === 'number' ? line : line.uid;
    },

    addLine(line: NewOrderLine): void {
      // Assign ID to line.
      this._highestOrderID += 1;
      const realLine: OrderLine = { ...line, uid: this._highestOrderID };

      this.lines = this.lines.concat([realLine]);
      this.currentLineID = this._highestOrderID;
      this.sizeSelection = null;
      this.countSelection = 1;
    },

    clearLine(line: OrderLine): void {
      // Remove line and its choices.
      this.lines = this.lines.filter((l) => l.uid !== line.uid);
      this.choices = this.choices.filter((c) => c.line !== line);

      // Also unset current line IF it's the one being removed.
      if (this.currentLineID === line.uid) {
        this.currentLineID = this.lines.length === 0
          ? NO_CURRENT_LINE : this.lines[this.lines.length - 1].uid;
      }
    },

    /**
    Replace existing line with one that contains ID.
    Useful for mutably updating a line with eg. a new size.
    @param {OrderLine} line the new line with index already injected.
    */
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
    },

    addChoice(choice: NewOrderChoice): void {
      // Assign ID to choice.
      this._highestChoiceID += 1;
      const realChoice: OrderChoice = { ...choice, uid: this._highestChoiceID };

      this.choices = this.choices.concat([realChoice]);
    },

    clearChoice(choice: OrderChoice): void {
      this.choices = this.choices.filter((l) => l.uid !== choice.uid);
    },

    startSizeSelection(size: Sizes | null): void {
      this.sizeSelection = size;
    },

    startCountSelection(count: OrderCount): void {
      this.countSelection = count;
    },

    scrollOrderView(): void {
      this.scrollOrderCounter += 1;
    },

    // /////////////////////////////////////////////////////////
    // Higher-level Actions
    // /////////////////////////////////////////////////////////

    /**
        Add an order line, considering size, count, and default choices.
        @param {SmartOrderPayload | string} Either the menu item key, or a SmartOrderPayload.
        @return {OrderLine} the resulting order.
    */
    addSmartOrderLine(payload: SmartOrderPayload | string): Promise<OrderLine[]> {
      const { menuItemID: menuItemKey, defaultSize } = (typeof payload !== 'string') ? payload : {
        menuItemID: payload,
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
    },

    /**
      Add a choice, removing any overlapping old one.
      @param {Object} payload Info about choice.
    */
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
    },

    /**
      Actually submit order as completed.
      Currently just cleans state.
    */
    async cashOut(): Promise<void> {
      // Simulate it being more complex.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.lines.forEach((line) => this.clearLine(line));

      this.startSizeSelection(null);
      this.startCountSelection(1);
    },

    /**
     * Relatively expensive function to get fully selected choices for order line. Considers combo, etc.
     * @param line The line to get choices from.
     */
    getLineChoices(line: OrderLine): { slotID: string, slot?: ChoiceSlot, choice?: OrderChoice | null }[] {
      return Object.keys(line.menuItem.choiceSlots)
        .map((slotID) => ({ slotID, slot: getChoiceSlot(slotID) }))
        // Undefined slots always show up for debugging.
        // Otherwise, require it be a listed slot and:
        //   Either this is a combo, or the slot still exists on non-combo items.
        .filter((s) => s.slot === undefined
          || (s.slot.isListed && (line.size !== undefined || !s.slot.isComboOnly)))
        .map((s) => {
          // Get actual slot object.
          if (!s.slot) {
            // Invalid slot, just return as-is.
            return { slotID: s.slotID };
          }

          // Get the order's choice, or null.
          const choice = this.choices.find(
            (c) => c.line === line && c.choiceItem.slot === s.slotID,
          ) ?? null;
          // It's good.
          return { slotID: s.slotID, slot: s.slot, choice };
        });
    },
  }
})
