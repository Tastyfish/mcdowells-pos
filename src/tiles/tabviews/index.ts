// The actually main menu content in the lower 4/5 of the screen.

import { newButton, ButtonTile, Tile } from '@/api/tile'
import { ContainedStripInfo, newTileStrip, newContainerStrip, newDownwardStrip } from '@/api/strip'
import Rectangle from '@/api/rectangle'

import { ChoiceSlot, isPriced } from '@/api/menu'
import { getMenuItem, getChoiceSlot, getChoicesBySlot } from '@/menu'
import Sizes from '@/menu/sizes'

import { ChoiceMenuMode, useOrderStore, useUIStore } from '@/store'
import { SmartOrderPayload } from '@/store/order'

import { generateLunchViewStrips } from './lunch'
import { generateDrinkStrips } from './drinks'
import { generateGiftStrips } from './gifts'
import { getItemPrice } from '@/api/menu'
import { generateSpecialStrips } from './special'

export function assertGetSlot(slotID: string) {
    const slot = getChoiceSlot(slotID)

    if (!slot) {
        throw new Error(`Slot ${slotID} could not be found. This is catastrophic.`)
    }

    return slot
}

export function assertGetItem(itemID: string) {
    const item = getMenuItem(itemID)

    if (!item) {
        throw new Error(`Menu item ${itemID} could not be found. This is catastrophic.`)
    }

    return item
}

const drink = assertGetSlot('drink')
const sauce = assertGetSlot('sauce')

async function addSeperateDrink(choiceItemID: string) {
    if (!drink) {
        throw new Error('Drink slot missing. This is a serious error.')
    }

    const orderStore = useOrderStore()

    const lines = await orderStore.addSmartOrderLine({
        menuItemID: 'drink',
        defaultSize: Sizes.Medium,
    })

    await Promise.all(lines.map((line) => orderStore.addSmartChoice({ choiceItemID, line, slot: drink })))
}

export async function addDrink(choiceItemID: string): Promise<void> {
    if (!drink) {
        throw new Error('Drink slot missing. This is a serious error.')
    }

    const orderStore = useOrderStore()

    const line = orderStore.currentLine
    if (!line) {
        // Just add a drink to the order.
        await addSeperateDrink(choiceItemID)
        return
    }

    try {
        await orderStore.addSmartChoice({
            choiceItemID,
            line,
            slot: drink,
        })
    } catch {
        // Likely due to the line not supporting drinks, add a stand-alone smart line.
        await addSeperateDrink(choiceItemID)
    }
}

export const generateSimpleTabStrips = (tiles: Tile[]): ContainedStripInfo[] => [
    {
        bounds: new Rectangle(0, 0, 8, 4),
        strip: newDownwardStrip([
            newTileStrip(tiles),
        ]),
    },
]

export const generateMealTabStrips = (tiles: Tile[]): ContainedStripInfo[] => [
    ...generateSimpleTabStrips(tiles),
    ...generateDrinkStrips(),
]

export function finishAddLines(): void {
    useUIStore().setChoiceMenuMode(ChoiceMenuMode.Default)
}

export async function addMealItem(payload: string | SmartOrderPayload): Promise<void> {
    await useOrderStore().addSmartOrderLine(payload)

    return finishAddLines()
}

export function newMealButton(mealID: string): ButtonTile {
    const menuItem = getMenuItem(mealID)

    if (!menuItem) {
        return newButton(() => {}, mealID)
    }

    const price = getItemPrice(menuItem, undefined)

    return {
        ...newButton(() => addMealItem(mealID), menuItem.displayName),
        price,
        classes: ['small-text-button'],
    }
}

// For the dedicated drinks and condiments menus
const generateStandaloneSlotStrips = (slot: ChoiceSlot, menuID?: string): ContainedStripInfo[] => {
    const uiStore = useUIStore()
    const orderStore = useOrderStore()

    return generateMealTabStrips(
        // Automatically generate tiles based on existing sauces
        getChoicesBySlot(slot.id).map((choice) => ({
            ...newButton(async () => {
                // Apply sauce to all of the lines added.
                const lines = await orderStore.addSmartOrderLine({
                    menuItemID: menuID ?? slot.id,
                    defaultSize: slot.isComboOnly ? Sizes.Medium : undefined,
                })
                uiStore.setChoiceMenuMode(ChoiceMenuMode.Default)

                await Promise.all(
                    lines.map((line) =>
                        orderStore.addSmartChoice({
                            line,
                            choiceItemID: choice.id,
                            slot,
                        })
                    )
                )
            }, choice.displayName),
            price: isPriced(choice) ? getItemPrice(choice) : getItemPrice(slot),
            classes: ['small-text-button'],
        }))
    )
}

const generateCondimentViewStrips = (): ContainedStripInfo[] => generateStandaloneSlotStrips(sauce)
const generateDrinkViewStrips = (): ContainedStripInfo[] => generateStandaloneSlotStrips(drink)

const tabMap: { [tabKey: string]: () => ContainedStripInfo[] } = {
    special: generateSpecialStrips,
    lu0: generateLunchViewStrips,
    dr: generateDrinkViewStrips,
    co0: generateCondimentViewStrips,
    co1: generateGiftStrips,
}

export default function generateTabViewGraph(): ContainedStripInfo {
    const currentTab = useUIStore().selectedMenuTab

    return {
        bounds: new Rectangle(1, 4, 8, 6),
        strip: newContainerStrip(tabMap[currentTab]?.() ?? generateDrinkStrips()),
    }
}
