import { defineStore } from 'pinia';
import { ref } from 'vue';

// Alternative "choice" menus to show
export enum ChoiceMenuMode {
  Default,
  ChangeComboSize,
  ChangeSlot,
}

export const useUIStore = defineStore('ui', () => {
  // Showing the total screen, and also sealing order.
  const totallingOrder = ref(false)

  // Show prices on buttons.
  const showingPrices = ref(false)

  // Reveal product build
  const showingProductBuild = ref(false)

  // Current page on listed choice.
  const choicePage = ref(0)

  // Change to special choice menus.
  const choiceMenuMode = ref(ChoiceMenuMode.Default)

  // What is the slot ID for choiceMenuMode.ChangeSlot?
  const choiceMenuSlotID = ref(null as string | null)

  // Selected menu tab for the lower 4/5 area.
  const selectedMenuTab = ref('lu0')

  // Doing an intensive loading operation - block the screen.
  const isLoading = ref(false)

  function gotoNextChoicePage(): void {
    choicePage.value += 1
  }

  function setChoiceMenuMode(modeOrSlotID: ChoiceMenuMode | string): void {
    if (typeof modeOrSlotID === 'number') {
      choiceMenuMode.value = modeOrSlotID;
      choiceMenuSlotID.value = null;
    } else {
      choiceMenuMode.value = ChoiceMenuMode.ChangeSlot;
      choiceMenuSlotID.value = modeOrSlotID;
    }
    choicePage.value = 0;
  }

  /**
   * Reset relevent fields for a new order.
   */
  function resetToNewOrder() {
    totallingOrder.value = false
    choicePage.value = 0
    choiceMenuMode.value = ChoiceMenuMode.Default
    choiceMenuSlotID.value = null
    selectedMenuTab.value = 'lu0'
    isLoading.value = false
  }

  return {
    totallingOrder, showingPrices, showingProductBuild, choicePage, choiceMenuMode, choiceMenuSlotID, selectedMenuTab, isLoading,

    gotoNextChoicePage, setChoiceMenuMode, resetToNewOrder,
  }
})
