import { defineStore } from 'pinia';

// Alternative "choice" menus to show
export enum ChoiceMenuMode {
  Default,
  ChangeComboSize,
  ChangeSlot,
}

/// Store module for client UI state. Is not replicated and should not have ledger side-effects.
export const useUIStore = defineStore('ui', {
  state: () => ({
    // Showing the total screen, and also sealing order.
    totallingOrder: false,

    // Show prices on buttons.
    showingPrices: false,

    // Reveal product build
    showingProductBuild: false,

    // Current page on listed choice.
    choicePage: 0,

    // Change to special choice menus.
    choiceMenuMode: ChoiceMenuMode.Default,

    // What is the slot ID for choiceMenuMode.ChangeSlot?
    choiceMenuSlotID: null as string | null,

    // Selected menu tab for the lower 4/5 area.
    selectedMenuTab: 'lu0',

    // Doing an intensive loading operation - block the screen.
    isLoading: false,
  }),
  actions: {
    setTotallingOrder(totalling: boolean): void {
      this.totallingOrder = totalling;
    },

    showPrices(show: boolean): void {
      this.showingPrices = show;
    },

    showProductBuild(show: boolean): void {
      this.showingProductBuild = show;
    },

    setChoicePage(page: number): void {
      this.choicePage = page;
    },

    gotoNextChoicePage(): void {
      this.choicePage += 1;
    },

    setChoiceMenuMode(modeOrSlotID: ChoiceMenuMode | string): void {
      if (typeof modeOrSlotID === 'number') {
        this.choiceMenuMode = modeOrSlotID;
        this.choiceMenuSlotID = null;
      } else {
        this.choiceMenuMode = ChoiceMenuMode.ChangeSlot;
        this.choiceMenuSlotID = modeOrSlotID;
      }
      this.choicePage = 0;
    },

    setSelectedMenuTab(tab: string): void {
      this.selectedMenuTab = tab;
    },

    setLoading(loading: boolean): void {
      this.isLoading = loading;
    },
  },
})
