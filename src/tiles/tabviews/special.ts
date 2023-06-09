import { ContainedStripInfo } from '@/api/strip'
import { assertGetItem, generateSimpleTabStrips } from '.'
import { useOrderStore, useUIStore } from '@/store'
import { Severity, newButton, newLabel, severeup } from '@/api/tile'
import { currency } from '@/config/locale.json'

const managerDiscount = assertGetItem('discount01')

function voidMenu() {
    const orderStore = useOrderStore()
    orderStore.lines.forEach((line) => orderStore.clearLine(line))
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

    return generateSimpleTabStrips([
        newLabel(`Total Items: ${orderStore.lines.length}`),
        severeup(newButton(voidMenu, 'Void Order'), Severity.Danger),
        {
            ...newButton(() => useUIStore().openNumpad(giveManagerDiscount), 'MGR Discount'),
            severity: Severity.Help,
            classes: ['small-text-button'],
        },
    ])
}
