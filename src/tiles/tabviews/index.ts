// The actually main menu content in the lower 4/5 of the screen.

import { newButton, ButtonTile, Tile, Severity } from '@/api/tile'
import { ContainedStripInfo, newTileStrip, newContainerStrip, newDownwardStrip, StripProvider } from '@/api/strip'
import Rectangle from '@/api/rectangle'

import { ChoiceSlot, isPriced } from '@/api/menu'
import { getMenuItem, getChoiceSlot, getChoicesBySlot } from '@/menu'
import Sizes from '@/menu/sizes'

import { ChoiceMenuMode, useOrderStore, useUIStore } from '@/store'
import { SmartOrderPayload } from '@/store/order'

import { generateDrinkStrips } from './drinks'
import { getItemPrice } from '@/api/menu'
import parseTabs, { TabItem, VarTabItem, isSlotTabItem, isVarTabItem } from '@/api/tab'
import { generateSpecialStrips } from './special'

export function assertGetSlot(slotID: string) {
    const slot = getChoiceSlot(slotID)

    if (!slot) {
        throw new Error(`Slot ${slotID} could not be found.`)
    }

    return slot
}

export function assertGetItem(itemID: string) {
    const item = getMenuItem(itemID)

    if (!item) {
        throw new Error(`Menu item ${itemID} could not be found.`)
    }

    return item
}

const drink = assertGetSlot('drink')

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

function isStripProviders(strips: Tile[] | StripProvider[]): strips is StripProvider[] {
    return strips.some(strip => typeof strip === 'function')
}

export const generateSimpleTabStrips = (tilesOrStrips: Tile[] | StripProvider[]): ContainedStripInfo[] => [
    {
        bounds: new Rectangle(0, 0, 8, 4),
        strip: newDownwardStrip(isStripProviders(tilesOrStrips) ? tilesOrStrips : [newTileStrip(tilesOrStrips)]),
    },
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

const generateStandaloneSlotTiles = (slot: ChoiceSlot, menuID?: string): Tile[] => {
    const uiStore = useUIStore()
    const orderStore = useOrderStore()

    return getChoicesBySlot(slot.id).map((choice) => ({
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
}

function addVariableItem(item: VarTabItem, amount: number) {
    const orderStore = useOrderStore()
    const base = assertGetItem(item.base)
    const price = amount * item.perPrice

    // Use base as a template, but update label and price.
    orderStore.addLine({
        menuItem: {
            ...base,
            displayName: base.displayName.replace(item.replace, price.toFixed(2)),
            price,
        },
    })
}

function generateTabItems(item: TabItem): Tile[] {
    if (typeof item === 'string') {
        // Menu item.
        return [newMealButton(item)]
    }

    const uiStore = useUIStore()

    if (isVarTabItem(item)) {
        return [
            {
                ...newButton(() => uiStore.openNumpad((amount) => addVariableItem(item, amount)), item.label),
                severity: Severity.Help,
                classes: ['small-text-button'],
            },
        ]
    } else if (isSlotTabItem(item)) {
        return generateStandaloneSlotTiles(assertGetSlot(item.slot))
    }
}

function generateGenericTabView(sections: TabItem[][]): ContainedStripInfo[] {
    return [
        ...generateDrinkStrips(),
        ...generateSimpleTabStrips(sections.map((section) => newTileStrip(section.map((item) => generateTabItems(item)).flat()))),
    ]
}

const tabConfig = parseTabs()

const staticTabs: { [tabKey: string]: () => ContainedStripInfo[] } = {
    special: generateSpecialStrips,
}

export default function generateTabViewGraph(): ContainedStripInfo {
    const currentTab = useUIStore().selectedMenuTab

    return {
        bounds: new Rectangle(1, 4, 8, 6),
        strip: newContainerStrip(
            staticTabs[currentTab]?.() ?? (tabConfig[currentTab] ? generateGenericTabView(tabConfig[currentTab]) : generateDrinkStrips())
        ),
    }
}
