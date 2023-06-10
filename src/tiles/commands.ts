import { Severity, newButton } from '@/api/tile'
import { ContainedStripInfo, newTileStrip } from '@/api/strip'
import Rectangle from '@/api/rectangle'

import { ChoiceMenuMode, TileScreen, useOrderStore, useUIStore } from '@/store'

import { getMenuItem } from '@/menu'
import Sizes from '@/menu/sizes'

function demoPromo() {
    const gift25 = getMenuItem('gift25')

    if (gift25) {
        useOrderStore().addLine({
            menuItem: gift25,
        })
        useUIStore().setChoiceMenuMode(ChoiceMenuMode.Default)
    }
}

function gotoTotalScreen() {
    const orderStore = useOrderStore()
    const uiStore = useUIStore()

    uiStore.tileScreen = TileScreen.Totalling
    orderStore.scrollOrderView()
}

export default function generateCommandsGraph(): ContainedStripInfo {
    const orderStore = useOrderStore()
    const uiStore = useUIStore()

    return {
        bounds: new Rectangle(9, 4, 1, 6),
        strip: newTileStrip([
            newButton(demoPromo, 'Promo Item'),
            newButton(() => {
                const line = orderStore.currentLine
                if (line) {
                    // clear last choice for line.
                    const choice = orderStore.choices.reverse().find((c) => c.line === line)
                    if (choice) {
                        orderStore.clearChoice(choice)
                    }
                }
            }, 'Clear Choice'),
            newButton(async () => {
                await orderStore.addSmartOrderLine({
                    menuItemID: 'side',
                    defaultSize: Sizes.Medium,
                })
                uiStore.setChoiceMenuMode('side')
            }, 'Side Choice'),
            newButton(() => {
                if (orderStore.currentLine) {
                    orderStore.clearLine(orderStore.currentLine)
                    uiStore.setChoiceMenuMode(ChoiceMenuMode.Default)
                }
            }, 'Void Line'),
            { ...newButton(gotoTotalScreen, 'Total'), height: 2, severity: Severity.Success },
        ]),
    }
}
