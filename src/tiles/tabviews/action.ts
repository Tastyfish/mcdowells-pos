import { useOrderStore, useUIStore } from '@/store'
import { Severity, Tile, newButton, newLabel } from '@/api/tile'
import { ActionTabItem } from '@/api/tabview'

function voidMenu(option: string) {
    if (option !== 'Void') {
        return
    }

    const orderStore = useOrderStore()
    orderStore.lines.forEach((line) => orderStore.clearLine(line))
}

function factoryReset(option: string) {
    if (option !== 'Factory Reset') {
        return
    }

    // Be thorough.
    const orderStore = useOrderStore()
    orderStore.orderNumber = 10

    const uiStore = useUIStore()
    uiStore.showingPrices = false
    uiStore.showingProductBuild = false
    uiStore.isLoading = true

    location.reload()
}

export function generateActionItem(item: ActionTabItem): Tile {
    const uiStore = useUIStore()

    switch (item.action) {
        case 'voidOrder':
            return {
                ...newButton(() => uiStore.openMessageBox('Void entire order?', ['Void', 'Cancel'], voidMenu), 'Void Order'),
                severity: Severity.Danger,
                classes: ['small-text-button'],
            }
        case 'factoryReset':
            return {
                ...newButton(
                    () => uiStore.openMessageBox('Reset all settings and history?', ['Factory Reset', 'Cancel'], factoryReset),
                    'Factory Reset'
                ),
                severity: Severity.Danger,
                classes: ['small-text-button'],
            }
        default:
            console.error('Unknown tab action type:', item.action)
            return newLabel(`ACTION? ${item.action}`)
    }
}
