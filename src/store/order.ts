import {
  createModule, mutation, action,
} from 'vuex-class-component';

import {
  NewOrderLine, OrderLine, NewOrderChoice, OrderChoice, ChoiceSlot,
} from '@/api/order';
import { menu, choices, choiceSlots } from '@/menu';
import Sizes from '@/menu/sizes';

const OrderVuexModule = createModule({
  namespaced: 'order',
  strict: true,
});

export const NO_CURRENT_LINE = -1;

// Options for multiplier choice buttons.
export type OrderCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Alternative "choice" menus to show
export enum ChoiceMenuMode {
  Default,
  ChangeComboSize,
  ChangeSlot,
}

export class OrderStore extends OrderVuexModule {
  lines: OrderLine[] = [];

  choices: OrderChoice[] = [];

  // Highest order ID that's been used so far; used to assign the ID's
  private highestOrderID = -1;

  // Highest choice ID that's been used so far; used to assign the ID's
  private highestChoiceID = -1;

  currentLineID: number = NO_CURRENT_LINE;

  // Current page on listed choice.
  choicePage = 0;

  // Show prices on buttons.
  showingPrices = false;

  // Handle size selection.
  sizeSelection: Sizes | null = null;

  // Multiplying count selection.
  countSelection: OrderCount = 1;

  // Change to special choice menus.
  choiceMenuMode: ChoiceMenuMode = ChoiceMenuMode.Default;

  // What is the slot ID for choiceMenuMode.ChangeSlot?
  choiceMenuSlotID: string | null = null;

  // Showing the total screen, and also sealing order.
  totallingOrder = false;

  // Selected menu tab for the lower 4/5 area.
  selectedMenuTab = 'lu0';

  // Incremented to indicate we should scroll the receipt order view.
  scrollOrderCounter = 0;

  // /////////////////////////////////////////////////////////
  // Getters
  // /////////////////////////////////////////////////////////

  get currentLine(): OrderLine | undefined {
    return this.lines.find((line) => line.id === this.currentLineID);
  }

  @mutation
  setCurrentLine(line: OrderLine | number): void {
    this.currentLineID = typeof line === 'number' ? line : line.id;
    this.choicePage = 0;
  }

  @mutation
  addLine(line: NewOrderLine): void {
    // Assign ID to line.
    this.highestOrderID += 1;
    const realLine: OrderLine = { ...line, id: this.highestOrderID };

    this.lines = this.lines.concat([realLine]);
    this.currentLineID = this.highestOrderID;
    this.choicePage = 0;
    this.sizeSelection = null;
    this.countSelection = 1;
  }

  @mutation
  clearLine(line: OrderLine): void {
    // Remove line and its choices.
    this.lines = this.lines.filter((l) => l.id !== line.id);
    this.choices = this.choices.filter((c) => c.line !== line);

    // Also unset current line IF it's the one being removed.
    if (this.currentLineID === line.id) {
      this.currentLineID = this.lines.length === 0
        ? NO_CURRENT_LINE : this.lines[this.lines.length - 1].id;
      this.choicePage = 0;
    }
  }

  /**
    Replace existing line with one that contains ID.
    Useful for mutably updating a line with eg. a new size.
    @param {OrderLine} line the new line with index already injected.
  * */
  @mutation
  replaceLine(line: OrderLine): void {
    const idx = this.lines.findIndex((l) => l.id === line.id);

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
      if (c.line.id === line.id) {
        return { ...c, line };
      }

      return c;
    });
  }

  @mutation
  addChoice(choice: NewOrderChoice): void {
    // Assign ID to choice.
    this.highestChoiceID += 1;
    const realChoice: OrderChoice = { ...choice, id: this.highestChoiceID };

    this.choices = this.choices.concat([realChoice]);
    this.choicePage = 0;
  }

  @mutation
  clearChoice(choice: OrderChoice): void {
    this.choices = this.choices.filter((l) => l.id !== choice.id);
  }

  @mutation
  setChoicePage(page: number): void {
    this.choicePage = page;
  }

  @mutation
  gotoNextChoicePage(): void {
    this.choicePage += 1;
  }

  @mutation
  showPrices(show: boolean): void {
    this.showingPrices = show;
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
  setTotallingOrder(totalling: boolean): void {
    this.totallingOrder = totalling;
  }

  @mutation
  setChoiceMenuMode(modeOrSlotID: ChoiceMenuMode | string): void {
    if (typeof modeOrSlotID === 'number') {
      this.choiceMenuMode = modeOrSlotID;
      this.choiceMenuSlotID = null;
    } else {
      this.choiceMenuMode = ChoiceMenuMode.ChangeSlot;
      this.choiceMenuSlotID = modeOrSlotID;
      this.choicePage = 0;
    }
  }

  @mutation
  setSelectedMenuTab(tab: string): void {
    this.selectedMenuTab = tab;
  }

  @mutation
  scrollOrderView(): void {
    this.scrollOrderCounter += 1;
  }

  /**
    Add an order line, considering size, count, and default choices.
    @param {string} menuItemKey The menu item key.
    @param {Sizes} defaultSize The default size, if no size selected.
    @return {OrderLine} the resulting order.
  */
  @action
  addSmartOrderLine(payload: { menuItemKey: string, defaultSize?: Sizes }): Promise<OrderLine[]> {
    const { menuItemKey, defaultSize } = payload;

    const menuItem = menu.find((a) => a.internalName === menuItemKey);

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

      // Add default choices, if they're set.
      if (line) {
        Object.entries(menuItem.choiceSlots).forEach(([slotID, slotDefault]) => {
          if (slotDefault) {
            const slot = choiceSlots.find((s) => s.internalName === slotID);
            const choiceItem = choices.find((c) => c.internalName === slotDefault);
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
    }

    return new Promise(() => lines[0]);
  }

  /**
    Add a choice, removing any overlapping old one.
    @param {Object} payload Info about choice.
  */
  @action
  addSmartChoice(payload: {
    choiceItemKey: string, line: OrderLine, slot: ChoiceSlot
  }): Promise<void> {
    // Remove old choice, if applicable.
    const { choiceItemKey, line, slot } = payload;

    const oldChoice = this.choices.find((c) => c.line === line
      && c.choiceItem.slot === slot.internalName);
    if (oldChoice) {
      this.clearChoice(oldChoice);
    }

    // Add new choice
    const choiceItem = choices.find((c) => c.internalName === choiceItemKey);
    if (choiceItem) {
      this.addChoice({ line, choiceItem });
    }

    return new Promise(() => {
      // return void
    });
  }
}
