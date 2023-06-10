import { newLabel, newButton, severeup, Tile, Severity } from '@/api/tile'
import { ContainedStripInfo, StripProvider, newListStrip, newDownwardStrip, newTileStrip, emptyStrip, newLeftwardStrip } from '@/api/strip'
import Rectangle from '@/api/rectangle'

import { ChoiceMenuMode, useOrderStore, useUIStore } from '@/store'
import { getChoiceSlot, getChoicesBySlot } from '@/menu'
import Sizes from '@/menu/sizes'
import { ChoiceItem } from '@/api/menu'
import { OrderLine } from '@/api/order'

const choiceRect = new Rectangle(0, 0, 10, 2)

const choiceModeBack = severeup(
    newButton(() => useUIStore().setChoiceMenuMode(ChoiceMenuMode.Default), 'Back', 'pi pi-arrow-left'),
    Severity.Info
)

// A button to retroactively change an item's size.
function newSizeButton(size: Sizes): Tile {
    return newButton(() => {
        const orderStore = useOrderStore()
        const line = orderStore.currentLine

        // Make sure the current line is exists and combo size still valid.
        if (line?.menuItem.allowedSizes?.includes(size)) {
            // Change size and repost.
            orderStore.replaceLine({ ...line, size })
        }

        // Regardless, return to normal choices.
        useUIStore().setChoiceMenuMode(ChoiceMenuMode.Default)
    }, size)
}

function generateChoiceButtons(line: OrderLine): Tile[] {
    // Check if is still and item that does combos at all.
    if (line.menuItem.allowedSizes) {
        return line.menuItem.allowedSizes.map(newSizeButton)
    }
    return []
}

// A button to replace the side of the current line
function newChoiceButton(choice: ChoiceItem): Tile {
    const sideSlot = getChoiceSlot(choice.slot)

    if (!sideSlot) {
        throw new Error('Side slot missing.')
    }

    return newButton(() => {
        const orderStore = useOrderStore()
        const line = orderStore.currentLine

        // Make sure the current line is exists and is a combo.
        if (line) {
            // Update side.
            orderStore.addSmartChoice({
                choiceItemID: choice.id,
                line,
                slot: sideSlot,
            })
        }

        // Regardless, return to normal choices.
        useUIStore().setChoiceMenuMode(ChoiceMenuMode.Default)
    }, choice.displayName)
}

function generateSlotButtons(slotID: string): Tile[] {
    return getChoicesBySlot(slotID).map(newChoiceButton)
}

function slotName(id: string): string {
    const slot = getChoiceSlot(id)

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
        slots.map((slot) => newButton(() => uiStore.setChoiceMenuMode(slot), slotName(slot), 'pi pi-bars')),
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
                    orderStore.currentLine ? generateChoiceButtons(orderStore.currentLine) : [],
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
                        ? severeup(
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
                        ? severeup(
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
