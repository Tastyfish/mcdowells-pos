import { ContainedStripInfo } from '@/api/strip'
import { assertGetItem, generateSimpleTabStrips } from '.'
import { useOrderStore, useUIStore } from '@/store'
import { Severity, newButton, newLabel } from '@/api/tile'
import { currency } from '@/config/locale.json'

const managerDiscount = assertGetItem('discount01')

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

function giveManagerDiscount(amount: number) {
    const orderStore = useOrderStore()

    // Use managerDiscount as a template, but update label and price.
    orderStore.addLine({
        menuItem: {
            ...managerDiscount,
            displayName: managerDiscount.displayName.replace('???', `${currency}${amount.toFixed(2)}`),
            price: -amount,
        },
    })
}

export const generateSpecialStrips = (): ContainedStripInfo[] => {
    const orderStore = useOrderStore()
    const uiStore = useUIStore()

    return generateSimpleTabStrips([
        newLabel(`Total Items: ${orderStore.lines.length}`),
        {
            ...newButton(() => uiStore.openMessageBox('Void entire order?', ['Void', 'Cancel'], voidMenu), 'Void Order'),
            severity: Severity.Danger,
        },
        {
            ...newButton(() => uiStore.openNumpad(giveManagerDiscount), 'MGR Discount'),
            severity: Severity.Help,
        },
        {
            ...newButton(() => uiStore.openMessageBox('Reset all settings and history?', ['Factory Reset', 'Cancel'], factoryReset), 'Factory Reset'),
            severity: Severity.Danger,
        },
    ])
}
