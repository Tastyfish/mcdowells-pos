import { ChoiceItem, getMenuItemAllowedSizes, choiceItemsBySlot, choiceSlots, ChoiceSlot } from '@/api/menu'
import { OrderLine } from '@/api/order'
import Rectangle from '@/api/rectangle'
import { ComboSize } from '@/api/size'
import { ContainedStripInfo, StripProvider, newListStrip, newDownwardStrip, newTileStrip, emptyStrip, newLeftwardStrip } from '@/api/strip'
import { newLabel, newButton, withSeverity, Tile, Severity, newToggle } from '@/api/tile'
import { ChoiceMenuMode, useOrderStore, useUIStore } from '@/store'

const choiceRect = new Rectangle(0, 0, 10, 2)

const choiceModeBack = withSeverity(
    newButton(() => useUIStore().setChoiceMenuMode(ChoiceMenuMode.Default), 'Back', 'pi pi-arrow-left'),
    Severity.Info
)

// A button to retroactively change an item's size.
function newSizeButton(size: ComboSize): Tile {
    return newButton(() => {
        const orderStore = useOrderStore()
        const line = orderStore.currentLine

        // Make sure the current line is exists and combo size still valid.
        if (line && getMenuItemAllowedSizes(line.menuItem)?.includes(size)) {
            // Change size and repost.
            orderStore.replaceLine({ ...line, size })
        }

        // Regardless, return to normal choices.
        useUIStore().setChoiceMenuMode(ChoiceMenuMode.Default)
    }, size.label)
}

function generateSizeButtons(line: OrderLine): Tile[] {
    // Check if is still and item that does combos at all.
    if (line.menuItem.allowedSizes) {
        return (getMenuItemAllowedSizes(line.menuItem) ?? []).map(newSizeButton)
    }
    return []
}

function addChoice(slot: ChoiceSlot, choice: ChoiceItem) {
    const orderStore = useOrderStore()
    const line = orderStore.currentLine

    // Make sure the current line is exists and is a combo.
    if (line) {
        // Update side.
        orderStore.addSmartChoice({
            choiceItemID: choice.id,
            line,
            slot,
        })
    }

    // Regardless, return to normal choices.
    useUIStore().setChoiceMenuMode(ChoiceMenuMode.Default)
}

// A button to replace the side of the current line
function newSlotButton(choice: ChoiceItem): Tile {
    const slot = choiceSlots.value[choice.slot]

    if (!slot) {
        throw new Error(`${choice.slot} slot missing.`)
    }

    if (slot.isMulti) {
        const orderStore = useOrderStore()
        const duplicate = orderStore.currentLine
            ? orderStore.getLineChoices(orderStore.currentLine).find((c) => c.choice?.choiceItem.id === choice.id)?.choice
            : null

        return newToggle(!!duplicate, () => (duplicate ? orderStore.clearChoice(duplicate) : addChoice(slot, choice)), choice.displayName)
    }

    return newButton(() => addChoice(slot, choice), choice.displayName)
}

function generateSlotButtons(slotID: string): Tile[] {
    return choiceItemsBySlot.value[slotID].map(newSlotButton)
}

function getSlotName(id: string): string {
    const slot = choiceSlots.value[id]

    return slot?.grillLabel ?? id
}

/// Generate single row for managing a strip.
const generateSlotGraph = (slotID: string): StripProvider => {
    const uiStore = useUIStore()

    return newListStrip(generateSlotButtons(slotID), uiStore.choicePage, () => uiStore.choicePage++)
}

/// Generate a single row of either slot options, or the slot graph if there is only one.
function generateRemainingSlotsGraph(slots: string[]): StripProvider {
    if (slots.length === 1) {
        return generateSlotGraph(slots[0])
    }

    const uiStore = useUIStore()

    return newListStrip(
        slots.map((slot) => newButton(() => uiStore.setChoiceMenuMode(slot), getSlotName(slot), 'pi pi-bars')),
        uiStore.choicePage,
        () => uiStore.choicePage++
    )
}

function generateChoiceInnerGraph(): StripProvider {
    const uiStore = useUIStore()
    const orderStore = useOrderStore()

    switch (uiStore.choiceMenuMode) {
        case ChoiceMenuMode.ChangeComboSize:
            return newDownwardStrip([
                newListStrip(
                    orderStore.currentLine ? generateSizeButtons(orderStore.currentLine) : [],
                    uiStore.choicePage,
                    () => uiStore.choicePage++
                ),
                newLeftwardStrip([newTileStrip([choiceModeBack])]),
            ])
        case ChoiceMenuMode.ChangeSlot:
            return newDownwardStrip([generateSlotGraph(uiStore.choiceMenuSlotID ?? 'side'), newLeftwardStrip([newTileStrip([choiceModeBack])])])
        default: {
            const line = orderStore.currentLine
            if (!line) {
                return emptyStrip
            }

            const canCombo = line.menuItem.allowedSizes !== undefined
            const canHaveSide = 'side' in line.menuItem.choiceSlots && line.size

            const remainingSlots = Object.keys(line.menuItem.choiceSlots).filter((slotID) => slotID !== 'side' && slotID !== 'drink')

            return newDownwardStrip([
                generateRemainingSlotsGraph(remainingSlots),
                newTileStrip([
                    canCombo
                        ? withSeverity(
                              newButton(
                                  () => {
                                      uiStore.setChoiceMenuMode(ChoiceMenuMode.ChangeComboSize)
                                  },
                                  line.size ? 'Size' : 'Combo',
                                  'pi pi-arrow-right'
                              ),
                              Severity.Info
                          )
                        : newLabel(''),
                    canHaveSide
                        ? withSeverity(
                              newButton(
                                  () => {
                                      uiStore.setChoiceMenuMode('side')
                                  },
                                  'Side',
                                  'pi pi-palette'
                              ),
                              Severity.Info
                          )
                        : newLabel(''),
                ]),
            ])
        }
    }
}

export default function generateChoiceGraph(): ContainedStripInfo {
    return {
        bounds: choiceRect,
        strip: generateChoiceInnerGraph(),
    }
}
