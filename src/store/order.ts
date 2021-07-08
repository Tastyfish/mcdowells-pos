import {
  createModule, mutation,
} from 'vuex-class-component';

import { OrderLine } from '@/api/order';
import Sizes from '@/menu/sizes';

const OrderVuexModule = createModule({
  namespaced: 'order',
  strict: true,
});

export const NO_CURRENT_LINE = -1;

export type OrderCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export class OrderStore extends OrderVuexModule {
  lines: OrderLine[] = [];

  currentLineID: number = NO_CURRENT_LINE;

  // Current page on listed choice.
  choicePage = 0;

  // Show prices on buttons.
  showingPrices = false;

  // Handle size selection.
  sizeSelection: Sizes | null = null;

  // Multiplying count selection.
  countSelection: OrderCount = 1;

  // Showing the total screen, and also sealing order.
  totallingOrder = false;

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
  addLine(line: OrderLine): void {
    this.lines = this.lines.concat([line]);
    this.currentLineID = line.id;
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
}
