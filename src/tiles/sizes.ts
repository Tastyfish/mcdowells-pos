import { ComboSize, sizeOrder, sizes } from '@/api/size'
import { ContainedStripInfo, newTileStrip } from '@/api/strip'
import { Severity, newLabel, newToggle, withSeverity } from '@/api/tile'
import Rectangle from '@/api/rectangle'

import { useOrderStore } from '@/store'

function newSizeToggle(size: ComboSize) {
    const orderStore = useOrderStore()

    return newToggle(
        orderStore.sizeSelection === size,
        () => {
            if (orderStore.sizeSelection === size) {
                // Turn off selection.
                orderStore.sizeSelection = null
            } else {
                // Select.
                orderStore.sizeSelection = size
            }
        },
        size.label,
        `pi pi-${size.icon}`
    )
}

export default function generateSizeGraph(): ContainedStripInfo {
    return {
        bounds: new Rectangle(0, 4, 1, 6),
        strip: newTileStrip([...sizeOrder.value.map((size) => newSizeToggle(sizes.value[size])), withSeverity(newLabel('Lunch'), Severity.Success)]),
    }
}
