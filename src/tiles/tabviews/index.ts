// The actually main menu content in the lower 4/5 of the screen.

import { DeepReadonly } from 'vue'
import locale from '@/api/locale'
import { ChoiceSlot, getItemPrice, isPriced, slots } from '@/api/menu'
import Rectangle from '@/api/rectangle'
import { ContainedStripInfo, newTileStrip, newContainerStrip, newDownwardStrip, StripProvider } from '@/api/strip'
import tabviews, { TabItem, TabView, VarTabItem, isActionTabItem, isLabelTabItem, isSlotTabItem, isVarTabItem } from '@/api/tabview'
import { newButton, ButtonTile, Tile, Severity } from '@/api/tile'
import { getMenuItem, getChoicesBySlot } from '@/menu'
import { ChoiceMenuMode, SmartOrderPayload, useOrderStore, useUIStore } from '@/store'

import { generateActionItem } from './action'
import { generateDrinkStrips } from './drinks'
import { generateLabelItem } from './label'
import { defaultSize } from '@/api/size'

export function assertGetItem(itemID: string) {
    const item = getMenuItem(itemID)

    if (!item) {
        throw new Error(`Menu item ${itemID} could not be found.`)
    }

    return item
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

function isStripProviders(strips: Tile[] | StripProvider[]): strips is StripProvider[] {
    return strips.some((strip) => typeof strip === 'function')
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

const generateStandaloneSlotTiles = (slot: ChoiceSlot, menuID?: string): Tile[] => {
    const uiStore = useUIStore()
    const orderStore = useOrderStore()

    return getChoicesBySlot(slot.id).map((choice) => ({
        ...newButton(async () => {
            // Apply sauce to all of the lines added.
            const lines = await orderStore.addSmartOrderLine({
                menuItemID: menuID ?? slot.id,
                defaultSize: slot.isComboOnly ? defaultSize.value : undefined,
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

function generateVariableItem(item: VarTabItem, amount: number) {
    const orderStore = useOrderStore()
    const base = assertGetItem(item.base)
    const price = amount * item.perPrice

    // Use base as a template, but update label and price.
    orderStore.addLine({
        menuItem: {
            ...base,
            displayName: base.displayName.replace(item.replace, `${locale.value.currency}${price.toFixed(2)}`),
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
                ...newButton(() => uiStore.openNumpad((amount) => generateVariableItem(item, amount)), item.label),
                severity: Severity.Help,
                classes: ['small-text-button'],
                price: Number.NaN,
            } as ButtonTile,
        ]
    } else if (isSlotTabItem(item)) {
        const slot = slots.value[item.slot] ?? { id: item.slot, displayName: item.slot, price: 0 }
        return generateStandaloneSlotTiles(slot)
    } else if (isActionTabItem(item)) {
        return [generateActionItem(item)]
    } else if (isLabelTabItem(item)) {
        return [generateLabelItem(item)]
    }

    console.error('Unknown advanced tab item type: ', item)
    return []
}

function generateTabView(tabView: DeepReadonly<TabView>): ContainedStripInfo[] {
    return [
        ...(tabView.drinks ? generateDrinkStrips() : []),
        ...generateSimpleTabStrips(tabView.content.map((section) => newTileStrip(section.map((item) => generateTabItems(item)).flat()))),
    ]
}

export default function generateTabViewGraph(): ContainedStripInfo {
    const currentTab = useUIStore().selectedMenuTab

    return {
        bounds: new Rectangle(1, 4, 8, 5),
        strip: newContainerStrip(tabviews.value[currentTab] ? generateTabView(tabviews.value[currentTab]) : generateDrinkStrips()),
    }
}
