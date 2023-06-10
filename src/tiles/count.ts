// The 1, 2, 3, etc. buttons to multiply orders.

import { newToggle } from '@/api/tile'
import { ContainedStripInfo, newTileStrip } from '@/api/strip'
import Rectangle from '@/api/rectangle'

import { OrderCount, useOrderStore } from '@/store'

export default function generateCountGraph(): ContainedStripInfo {
    const orderStore = useOrderStore()

    return {
        bounds: new Rectangle(0, 2, 10, 1),
        strip: newTileStrip(
            Array(10)
                .fill(0)
                .map((_item, index) => ({
                    ...newToggle(
                        orderStore.countSelection === index + 1,
                        () => {
                            if (orderStore.countSelection === index + 1) {
                                orderStore.countSelection = 1
                            } else {
                                orderStore.countSelection = (index + 1) as OrderCount
                            }
                        },
                        (index + 1).toString()
                    ),
                    classes: ['circle'],
                }))
        ),
    }
}
