import {
  createModule, mutation,
} from 'vuex-class-component';

// Alternative "choice" menus to show
export enum ChoiceMenuMode {
  Default,
  ChangeComboSize,
  ChangeSlot,
}

const UIVuexModule = createModule({
  namespaced: 'ui',
  strict: true,
});

/// Store module for client UI state. Is not replicated and should not have ledger side-effects.
export class UIStore extends UIVuexModule {
  // Showing the total screen, and also sealing order.
  totallingOrder = false;

  // Show prices on buttons.
  showingPrices = false;

  // Current page on listed choice.
  choicePage = 0;

  // Change to special choice menus.
  choiceMenuMode: ChoiceMenuMode = ChoiceMenuMode.Default;

  // What is the slot ID for choiceMenuMode.ChangeSlot?
  choiceMenuSlotID: string | null = null;

  // Selected menu tab for the lower 4/5 area.
  selectedMenuTab = 'lu0';

  // /////////////////////////////////////////////////////////
  // Mutations
  // /////////////////////////////////////////////////////////

  @mutation
  setTotallingOrder(totalling: boolean): void {
    this.totallingOrder = totalling;
  }

  @mutation
  showPrices(show: boolean): void {
    this.showingPrices = show;
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
  setChoiceMenuMode(modeOrSlotID: ChoiceMenuMode | string): void {
    if (typeof modeOrSlotID === 'number') {
      this.choiceMenuMode = modeOrSlotID;
      this.choiceMenuSlotID = null;
    } else {
      this.choiceMenuMode = ChoiceMenuMode.ChangeSlot;
      this.choiceMenuSlotID = modeOrSlotID;
    }
    this.choicePage = 0;
  }

  @mutation
  setSelectedMenuTab(tab: string): void {
    this.selectedMenuTab = tab;
  }
}
