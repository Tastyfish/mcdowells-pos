import {
  createModule, mutation,
} from 'vuex-class-component';

import {
  NewOrderLine, OrderLine, NewOrderChoice, OrderChoice,
} from '@/api/order';
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

  // Showing the total screen, and also sealing order.
  totallingOrder = false;

  // Selected menu tab for the lower 4/5 area.
  selectedMenuTab = 'lu0';

  // /////////////////////////////////////////////////////////
  // Getters
  // /////////////////////////////////////////////////////////

  get currentLine(): OrderLine | undefined {
    return this.lines.find((line) => line.id === this.currentLineID);
  }

  @mutation
  setCurrentLine(line: OrderLine): void {
    this.currentLineID = line.id;
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
  }

  @mutation
  clearLine(line: OrderLine): void {
    this.lines = this.lines.filter((l) => l.id !== line.id);
    // Also unset current line IF it's the one being removed.
    if (this.currentLineID === line.id) {
      this.currentLineID = NO_CURRENT_LINE;
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
  setChoiceMenuMode(mode: ChoiceMenuMode): void {
    this.choiceMenuMode = mode;
    this.choicePage = 0;
  }

  @mutation setSelectedMenuTab(tab: string): void {
    this.selectedMenuTab = tab;
  }
}
