import { useOrderStore } from '@/store'

import { salesTax } from '@/config/locale.json'

export enum PaymentMethod {
    Cash,
    Credit,
}

/**
 * Perform final cashout of order.
 */
export async function cashOut(paymentMethod: PaymentMethod): Promise<void> {
    const delay = paymentMethod === PaymentMethod.Cash ? 500 : 1000

    await new Promise((resolve) => setTimeout(resolve, delay))

    useOrderStore().clearEntireOrder()
}

export interface OrderTotalInfo {
    /** The unique order number. */
    orderNumber: number
    /** Total number of order lines. */
    orderLineCount: number
    /** Total cost of all items, without tax. */
    subtotal: number
    /** Calcultated tax. */
    tax: number
    /** Total cost of all items, plus tax. */
    grandTotal: number
}

/**
 * Get OrderTotalInfo of the current order.
 * @returns The info about the current order.
 */
export function getOrderTotals(): OrderTotalInfo {
    const orderStore = useOrderStore()

    const subtotal = orderStore.lines.map((line) => orderStore.getLinePrice(line)).reduce((a, b) => a + b, 0)
    const tax = subtotal * salesTax
    const grandTotal = subtotal + tax

    return {
        orderNumber: orderStore.orderNumber,
        orderLineCount: orderStore.lines.length,
        subtotal,
        tax,
        grandTotal,
    }
}
