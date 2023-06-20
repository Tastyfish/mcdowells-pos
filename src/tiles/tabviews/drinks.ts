import { computed } from 'vue'
import Rectangle from '@/api/rectangle'
import { ContainedStripInfo, newListStrip } from '@/api/strip'
import { newButton } from '@/api/tile'
import { useOrderStore, useUIStore } from '@/store'
import { isPriced, getItemPrice, choiceItemsBySlot, choiceSlots, ChoiceSlot } from '@/api/menu'
import { defaultSize } from '@/api/size'

const drinkSlot = computed(() => choiceSlots.value['drink'] as ChoiceSlot | undefined)

async function addSeperateDrink(choiceItemID: string) {
    const slot = drinkSlot.value

    if (!slot) {
        throw new Error('Drink slot missing. This is a serious error.')
    }

    const orderStore = useOrderStore()

    const lines = await orderStore.addSmartOrderLine({
        menuItemID: 'drink',
        defaultSize: defaultSize.value,
    })

    await Promise.all(lines.map((line) => orderStore.addSmartChoice({ choiceItemID, line, slot })))
}

async function addSmartDrink(choiceItemID: string): Promise<void> {
    const slot = drinkSlot.value

    if (!slot) {
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
            slot,
        })
    } catch {
        // Likely due to the line not supporting drinks, add a stand-alone smart line.
        await addSeperateDrink(choiceItemID)
    }
}

export const generateDrinkStrips = (): ContainedStripInfo[] => {
    const uiStore = useUIStore()
    const slot = drinkSlot.value

    return [
        {
            bounds: new Rectangle(0, 4, 8, 1),
            strip: newListStrip(
                choiceItemsBySlot.value['drink']?.map((drink) => ({
                    ...newButton(() => addSmartDrink(drink.id), drink.displayName),
                    price: isPriced(drink) ? getItemPrice(drink) : slot ? getItemPrice(slot) : undefined,
                })) ?? [],
                uiStore.drinkPage,
                () => uiStore.drinkPage++
            ),
        },
    ]
}
