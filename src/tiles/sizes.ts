import { Severity, newLabel, newToggle, withSeverity } from '@/api/tile'
import { ContainedStripInfo, newTileStrip } from '@/api/strip'
import Rectangle from '@/api/rectangle'

import { useOrderStore } from '@/store'
import Sizes from '@/menu/sizes'

interface SizeInfo {
    name: string
    icon: string
}

const sizeInfo: { [key in Sizes]: SizeInfo } = {
    [Sizes.HappyMeal]: { name: 'Happy Meal', icon: 'pi pi-home' },
    [Sizes.XSmall]: { name: 'X Small', icon: 'pi pi-angle-double-down' },
    [Sizes.Small]: { name: 'Small', icon: 'pi pi-angle-down' },
    [Sizes.Medium]: { name: 'Medium', icon: 'pi pi-angle-right' },
    [Sizes.Large]: { name: 'Large', icon: 'pi pi-angle-up' },
    [Sizes.Senior]: { name: 'Senior', icon: 'pi pi-angle-left' },
}

function newSizeToggle(size: Sizes) {
    const { name, icon } = sizeInfo[size]
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
        name,
        icon
    )
}

export default function generateSizeGraph(): ContainedStripInfo {
    return {
        bounds: new Rectangle(0, 4, 1, 6),
        strip: newTileStrip([
            newSizeToggle(Sizes.XSmall),
            newSizeToggle(Sizes.Small),
            newSizeToggle(Sizes.Medium),
            newSizeToggle(Sizes.Large),
            withSeverity(newLabel('Lunch'), Severity.Success),
            newSizeToggle(Sizes.Senior),
        ]),
    }
}
