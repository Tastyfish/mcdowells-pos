import { defineStore } from 'pinia'
import { ref } from 'vue'

// Alternative "choice" menus to show
export enum ChoiceMenuMode {
    Default,
    ChangeComboSize,
    ChangeSlot,
}

export enum TileScreen {
    Ordering,
    Totalling,
    Numpad,
    MessageBox,
}

export const useUIStore = defineStore(
    'ui',
    () => {
        // Showing the total screen, and also sealing order.
        const tileScreen = ref(TileScreen.Ordering)

        // Show prices on buttons.
        const showingPrices = ref(false)

        // Reveal product build
        const showingProductBuild = ref(false)

        // Page number on the lower drink strip
        const drinkPage = ref(0)

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

        // numpad value, as a string to ease decimal input handling.
        const numpadValue = ref('0')

        // numpad callback
        const numpadCallback = ref(null as ((value: number) => void) | null)

        // User-facing text for message box.
        const messageBoxText = ref('')

        // Button option labels. Labels will also be returned as-is.
        const messageBoxOptions = ref([] as string[])

        const messageBoxCallback = ref(null as ((label: string) => void) | null)

        function setChoiceMenuMode(modeOrSlotID: ChoiceMenuMode | string): void {
            if (typeof modeOrSlotID === 'number') {
                choiceMenuMode.value = modeOrSlotID
                choiceMenuSlotID.value = null
            } else {
                choiceMenuMode.value = ChoiceMenuMode.ChangeSlot
                choiceMenuSlotID.value = modeOrSlotID
            }
            choicePage.value = 0
        }

        /**
         * Reset relevent fields for a new order.
         */
        function resetToNewOrder() {
            tileScreen.value = TileScreen.Ordering
            drinkPage.value = 0
            choicePage.value = 0
            choiceMenuMode.value = ChoiceMenuMode.Default
            choiceMenuSlotID.value = null
            selectedMenuTab.value = 'lu0'
            isLoading.value = false
        }

        /**
         * Open a modal numpad for entry.
         * @param callback Callback function that receives resulting float number.
         */
        function openNumpad(callback: (value: number) => void) {
            tileScreen.value = TileScreen.Numpad
            numpadValue.value = '0'
            numpadCallback.value = callback
        }

        /**
         * Open a modal message box with multiple options.
         * @param text The text to display to the user.
         * @param options The labels for each option.
         * @param callback Callback function that receives which label was pressed.
         */
        function openMessageBox<OT extends string>(text: string, options: OT[], callback: (label: OT) => void) {
            tileScreen.value = TileScreen.MessageBox
            messageBoxText.value = text
            ;(messageBoxOptions.value = options), (messageBoxCallback.value = callback as (label: string) => void)
        }

        return {
            tileScreen,
            showingPrices,
            showingProductBuild,

            drinkPage,
            choicePage,

            choiceMenuMode,
            choiceMenuSlotID,
            selectedMenuTab,

            isLoading,

            numpadValue,
            numpadCallback,
            messageBoxText,
            messageBoxOptions,
            messageBoxCallback,

            setChoiceMenuMode,
            resetToNewOrder,
            openNumpad,
            openMessageBox,
        }
    },
    {
        persist: {
            key: 'com.mcdowells.ui',
            paths: ['showingPrices', 'showingProductBuild'],
        },
    }
)
