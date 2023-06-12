import Rectangle from '@/api/rectangle'
import { ContainedStripInfo, newListStrip } from '@/api/strip'
import { Tile, newButton } from '@/api/tile'
import { useOrderStore, useUIStore } from '@/store'
import { assertGetSlot } from '.'
import { getChoicesBySlot } from '@/menu'
import Sizes from '@/menu/sizes'

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

async function addSmartDrink(choiceItemID: string): Promise<void> {
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

export const generateDrinkStrips = (): ContainedStripInfo[] => {
    const uiStore = useUIStore()

    return [
        {
            bounds: new Rectangle(0, 4, 8, 1),
            strip: newListStrip(
                getChoicesBySlot('drink').map((drink) => newButton(() => addSmartDrink(drink.id), drink.displayName) as Tile),
                uiStore.drinkPage,
                () => uiStore.drinkPage++
            ),
        },
    ]
}
