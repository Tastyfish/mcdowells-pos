import Rectangle from '@/api/rectangle'
import { ContainedStripInfo, newListStrip, newTileStrip } from '@/api/strip'
import { Tile, newButton, newLabel, newToggle } from '@/api/tile'
import { useUIStore } from '@/store'
import { addDrink } from '.'
import { getChoicesBySlot } from '@/menu'

export const generateDrinkStrips = (): ContainedStripInfo[] => {
    const uiStore = useUIStore()

    return [
        {
            bounds: new Rectangle(0, 4, 7, 1),
            strip: newListStrip(
                getChoicesBySlot('drink').map((drink) => newButton(() => addDrink(drink.id), drink.displayName) as Tile),
                uiStore.drinkPage,
                () => uiStore.drinkPage++
            ),
        },
        {
            bounds: new Rectangle(7, 4, 1, 1),
            strip: newTileStrip([
                newToggle(uiStore.showingProductBuild, () => (uiStore.showingProductBuild = !uiStore.showingProductBuild), 'Show Product Build'),
            ]),
        },
        {
            bounds: new Rectangle(0, 5, 8, 1),
            strip: newTileStrip(
                [newToggle(uiStore.showingPrices, () => (uiStore.showingPrices = !uiStore.showingPrices), 'Show Prices') as Tile].concat(
                    uiStore.showingProductBuild
                        ? [
                              { ...newLabel(`Software build: ${APP_VERSION}`), width: 3 },
                              { ...newLabel(`Menu build: ${4}`), width: 3 },
                          ]
                        : []
                )
            ),
        },
    ]
}
