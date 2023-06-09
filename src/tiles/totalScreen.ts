// Completely different scene graph fork for when the cashier presses "Total"

import { Severity, newButton, severeup, newLabel, emptyTile } from '@/api/tile'
import { StripProvider, newTileStrip, newLeftwardStrip, newDownwardStrip, newUpwardStrip, constrainWidth, grow } from '@/api/strip'

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
                newTileStrip([severeup(newButton(backOut, 'Back', 'pi pi-arrow-left'), Severity.Info)]),
                grow(newUpwardStrip([
                    newTileStrip([
                        { ...newButton(() => startCashOut(PaymentMethod.Credit), 'Card', 'pi pi-credit-card'), ySpan: 2, severity: Severity.Primary },
                        {
                            ...newButton(() => startCashOut(PaymentMethod.Cash), 'Cash Out', 'pi pi-money-bill'),
                            ySpan: 2,
                            severity: Severity.Success,
                        },
                    ]),
                ])),
            ])
        ),
        newTileStrip([{ ...emptyTile, xSpan: 3 }]),
        constrainWidth(
            3,
            newTileStrip([
                { ...newLabel(`Total Items: ${totals.orderLineCount}`), xSpan: 3 },
                { ...newLabel(`Subtotal: ${currency}${totals.subtotal.toFixed(2)}`), xSpan: 3 },
                { ...newLabel(`Tax: ${currency}${totals.tax.toFixed(2)}`), xSpan: 3 },
                { ...newLabel(`Final Total: ${currency}${totals.grandTotal.toFixed(2)}`), xSpan: 3, severity: Severity.Success },
            ])
        ),
    ])
}
