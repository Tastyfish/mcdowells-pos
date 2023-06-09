import { ContainedStripInfo } from '@/api/strip'
import { assertGetItem, generateSimpleTabStrips, newMealButton } from '.'
import { newButton, Severity } from '@/api/tile'
import { useOrderStore, useUIStore } from '@/store'

const giftCard = assertGetItem('gift10')

function giveVariableGift(amount: number) {
    const orderStore = useOrderStore()

    // Use giftCard as a template, but update label and price.
    orderStore.addLine({
        menuItem: {
            ...giftCard,
            displayName: giftCard.displayName.replace('10', amount.toFixed(2)),
            price: amount,
        },
    })
}

export const generateGiftStrips = (): ContainedStripInfo[] => {
    const uiStore = useUIStore()

    return generateSimpleTabStrips([
        newMealButton('gift05'),
        newMealButton('gift10'),
        newMealButton('gift25'),
        {
            ...newButton(() => uiStore.openNumpad(giveVariableGift), '? Gift Card'),
            severity: Severity.Help,
            classes: ['small-text-button'],
        },
    ])
}
