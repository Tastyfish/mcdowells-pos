import { defineStore } from 'pinia'

import { ChoiceSlot, getItemPrice, getMenuItemAllowedSizes, hasPrice, choiceSlots, choiceItems } from '@/api/menu'
import { NewOrderLine, OrderLine, NewOrderChoice, OrderChoice } from '@/api/order'
import { getMenuItem } from '@/menu'
import { computed, ref } from 'vue'
import { ComboSize } from '@/api/size'

export const NO_CURRENT_LINE = -1

// Options for multiplier choice buttons.
export type OrderCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

/// Advanced payload for addSmartOrderLine
export interface SmartOrderPayload {
    /// The menu item id.
    menuItemID: string
    /// The default size, if no size selected.
    defaultSize?: ComboSize
}

/// Store module for orders. Is fully replicated to DB.

export const useOrderStore = defineStore(
    'order',
    () => {
        const lines = ref([] as OrderLine[])
        let choices = ref([] as OrderChoice[])

        // The user-facing number for the entire order.
        const orderNumber = ref(10)

        // Highest line ID that's been used so far; used to assign the ID's
        let _highestLineID = NO_CURRENT_LINE

        // Highest choice ID that's been used so far; used to assign the ID's
        let _highestChoiceID = NO_CURRENT_LINE

        const currentLineID = ref(NO_CURRENT_LINE)

        // Handle size selection.
        const sizeSelection = ref(null as ComboSize | null)

        // Multiplying count selection.
        const countSelection = ref(1 as OrderCount)

        // Incremented to indicate we should scroll the receipt order view.
        const scrollOrderCounter = ref(0)

        const currentLine = computed((): OrderLine | undefined => {
            return lines.value.find((line) => line.uid === currentLineID.value)
        })

        function setCurrentLine(line: OrderLine | number): void {
            currentLineID.value = typeof line === 'number' ? line : line.uid
        }

        function addLine(line: NewOrderLine): void {
            // Assign ID to line.
            _highestLineID++
            const realLine: OrderLine = { ...line, uid: _highestLineID }

            lines.value.push(realLine)
            currentLineID.value = _highestLineID
            sizeSelection.value = null
            countSelection.value = 1
        }

        function clearLine(line: OrderLine): void {
            // Remove line and its choices.
            lines.value = lines.value.filter((l) => l.uid !== line.uid)
            choices.value = choices.value.filter((c) => c.line !== line)

            // Also unset current line IF it's the one being removed.
            if (currentLineID.value === line.uid) {
                currentLineID.value = lines.value.length === 0 ? NO_CURRENT_LINE : lines.value[lines.value.length - 1].uid
            }
        }

        /**
         * Replace existing line with one that contains ID.
         * Useful for mutably updating a line with eg. a new size.
         * @param {OrderLine} line the new line with index already injected.
         */
        function replaceLine(line: OrderLine): void {
            const idx = lines.value.findIndex((l) => l.uid === line.uid)

            if (idx === -1) {
                throw new RangeError('No existing order with ID.')
            }

            lines.value[idx] = line

            // And now also update all choices.
            choices.value = choices.value.map((c) => {
                if (c.line.uid === line.uid) {
                    return { ...c, line }
                }

                return c
            })
        }

        function addChoice(choice: NewOrderChoice): void {
            // Assign ID to choice.
            _highestChoiceID++
            const realChoice: OrderChoice = { ...choice, uid: _highestChoiceID }

            choices.value.push(realChoice)
        }

        function clearChoice(choice: OrderChoice): void {
            choices.value = choices.value.filter((l) => l.uid !== choice.uid)
        }

        function scrollOrderView(): void {
            scrollOrderCounter.value++
        }

        // /////////////////////////////////////////////////////////
        // Higher-level Actions
        // /////////////////////////////////////////////////////////

        /**
         * Add an order line, considering size, count, and default choices.
         * @param {SmartOrderPayload | string} Either the menu item key, or a SmartOrderPayload.
         * @return {OrderLine} the resulting order.
         */
        function addSmartOrderLine(payload: SmartOrderPayload | string): Promise<OrderLine[]> {
            const { menuItemID: menuItemKey, defaultSize } =
                typeof payload !== 'string'
                    ? payload
                    : {
                          menuItemID: payload,
                          defaultSize: undefined,
                      }

            const menuItem = getMenuItem(menuItemKey)

            if (!menuItem) {
                throw new Error(`Menu item ${menuItemKey} does not exist.`)
            }

            // Get size, if a size is selected and valid for menu item.
            const size = sizeSelection.value && getMenuItemAllowedSizes(menuItem)?.includes(sizeSelection.value) ? sizeSelection.value : defaultSize

            // copy of count to preserve across loop.
            const count = countSelection.value

            // Our list of lines.
            const lines: OrderLine[] = Array(count)

            for (let i = 0; i < count; i += 1) {
                addLine({ menuItem, size })
                const line = currentLine.value

                if (!line) {
                    throw new Error('Order store is in an invalid state and lines cannot be added.')
                }

                // Add default choices, if they're set.
                Object.entries(menuItem.choiceSlots).forEach(([slotID, slotDefault]) => {
                    if (slotDefault) {
                        const slot = choiceSlots.value[slotID]
                        const choiceItem = choiceItems.value[slotDefault]
                        if (slot && choiceItem) {
                            addChoice({ line, choiceItem })
                        }
                    }
                })

                lines[i] = line
            }

            // Select first item again.
            if (lines[0]) {
                setCurrentLine(lines[0])
                scrollOrderView()
            }

            return new Promise((resolve) => resolve(lines))
        }

        /**
         * Add a choice, removing any overlapping old one.
         * @param {Object} payload Info about choice.
         */
        function addSmartChoice(payload: { choiceItemID: string; line: OrderLine; slot: ChoiceSlot }): Promise<void> {
            // Remove old choice, if applicable.
            const { choiceItemID, line, slot } = payload

            const oldChoice = choices.value.find((c) => c.line === line && c.choiceItem.slot === slot.id)
            if (oldChoice) {
                clearChoice(oldChoice)
            }

            // Is this a valid choice?
            if (!(slot.id in line.menuItem.choiceSlots)) {
                return new Promise((_resolve, reject) => reject(new Error(`${line.menuItem.id} can not accept slot ${slot.grillLabel ?? slot.id}`)))
            }

            // Is this a combo choice on a non-combo line?
            if (!line.size && slot.isComboOnly) {
                return new Promise((_resolve, reject) => reject(new Error(`Line is not a combo so cannot accept slot ${slot.grillLabel ?? slot.id}`)))
            }

            // Add new choice
            const choiceItem = choiceItems.value[choiceItemID]
            if (choiceItem) {
                addChoice({ line, choiceItem })
            }

            return new Promise((resolve) => resolve())
        }

        /**
         * Clears entire slate.
         */
        function clearEntireOrder(): void {
            lines.value = []
            choices.value = []
            currentLineID.value = NO_CURRENT_LINE

            sizeSelection.value = null
            countSelection.value = 1

            orderNumber.value += 1
        }

        /**
         * Relatively expensive function to get fully selected choices for order line. Considers combo, etc.
         * @param line The line to get choices from.
         */
        function getLineChoices(line: OrderLine): { slotID: string; slot?: ChoiceSlot; choice?: OrderChoice | null }[] {
            return (
                Object.keys(line.menuItem.choiceSlots)
                    .map((slotID) => ({ slotID, slot: choiceSlots.value[slotID] }))
                    // Undefined slots always show up for debugging.
                    // Otherwise, require it be a listed slot and:
                    //   Either this is a combo, or the slot still exists on non-combo items.
                    .filter((s) => s.slot === undefined || (s.slot.isListed && (line.size !== undefined || !s.slot.isComboOnly)))
                    .map((s) => {
                        // Get actual slot object.
                        if (!s.slot) {
                            // Invalid slot, just return as-is.
                            return { slotID: s.slotID }
                        }

                        // Get the order's choice, or null.
                        const choice = choices.value.find((c) => c.line === line && c.choiceItem.slot === s.slotID) ?? null
                        // It's good.
                        return { slotID: s.slotID, slot: s.slot, choice }
                    })
            )
        }

        function getLinePrice(line: OrderLine): number {
            const mainPrice = getItemPrice(line.menuItem, line.size)
            const comboOffset = line.size?.priceOffset ?? 0

            // Add together choice prices, or if they don't have a price, use slot price.
            const slotPrices = getLineChoices(line).reduce(
                (total, choiceInfo) =>
                    total +
                    (!choiceInfo.choice
                        ? 0
                        : hasPrice(choiceInfo.choice.choiceItem)
                        ? getItemPrice(choiceInfo.choice.choiceItem, line.size)
                        : getItemPrice(choiceInfo.slot ?? { price: 0.0 }, line.size)),
                0
            )

            return mainPrice + comboOffset + slotPrices
        }

        return {
            orderNumber,
            currentLineID,
            sizeSelection,
            countSelection,
            scrollOrderCounter,

            lines,
            choices,
            currentLine,

            setCurrentLine,
            addLine,
            clearLine,
            replaceLine,
            addChoice,
            clearChoice,
            scrollOrderView,
            addSmartOrderLine,
            addSmartChoice,
            clearEntireOrder,
            getLineChoices,
            getLinePrice,
        }
    },
    {
        persist: {
            key: 'com.mcdowells.order',
            paths: ['orderNumber'],
        },
    }
)
