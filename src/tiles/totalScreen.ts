// Completely different scene graph fork for when the cashier presses "Total"

import { Severity, newButton, newLabel, emptyTile } from '@/api/tile'
import { StripProvider, newTileStrip, newLeftwardStrip, newDownwardStrip, newUpwardStrip, constrainWidth, grow, emptyStrip } from '@/api/strip'

import { TileScreen, useUIStore } from '@/store'
import { PaymentMethod, cashOut, getOrderTotals } from '@/api/cashout'

import { currency } from '@/config/locale.json'

function backOut() {
    // Leave the screen and go back.
    useUIStore().tileScreen = TileScreen.Ordering
}

async function startCashOut(method: PaymentMethod) {
    const uiStore = useUIStore()

    uiStore.isLoading = true

    await cashOut(method)

    // Finish up.
    uiStore.resetToNewOrder()
}

export default function generateTotalScreenGraph(): StripProvider {
    const totals = getOrderTotals()

    return newLeftwardStrip([
        constrainWidth(
            1,
            newDownwardStrip([
                grow(emptyStrip),
                newTileStrip([{ ...newButton(backOut, 'Back', 'pi pi-arrow-left'), height: 2, severity: Severity.Info }]),
                grow(
                    newUpwardStrip([
                        newTileStrip([
                            {
                                ...newButton(() => startCashOut(PaymentMethod.Credit), 'Card', 'pi pi-credit-card'),
                                height: 2,
                                severity: Severity.Primary,
                            },
                            {
                                ...newButton(() => startCashOut(PaymentMethod.Cash), 'Cash Out', 'pi pi-money-bill'),
                                height: 2,
                                severity: Severity.Success,
                            },
                        ]),
                    ])
                ),
            ])
        ),
        newTileStrip([{ ...emptyTile, width: 3 }]),
        constrainWidth(
            3,
            newTileStrip([
                { ...emptyTile, width: 3, height: 2 },
                { ...newLabel(`Total Items: ${totals.orderLineCount}`), width: 3 },
                { ...newLabel(`Order Number: ${totals.orderNumber}`), width: 3, severity: Severity.Info },
                { ...newLabel(`Subtotal: ${currency}${totals.subtotal.toFixed(2)}`), width: 3 },
                { ...newLabel(`Tax: ${currency}${totals.tax.toFixed(2)}`), width: 3 },
                { ...newLabel(`Final Total: ${currency}${totals.grandTotal.toFixed(2)}`), width: 3, severity: Severity.Success },
            ])
        ),
    ])
}
