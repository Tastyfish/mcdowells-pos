import Rectangle from '@/api/rectangle'
import { Severity, newButton, newLabel } from '@/api/tile'
import { StripProvider, newTileStrip, newContainerStrip, newDownwardStrip, newLeftwardStrip } from '@/api/strip'
import { TileScreen, useUIStore } from '@/store'

/**
 * Close numpad and call callback.
 */
function submit(label: string) {
    const uiStore = useUIStore()

    uiStore.tileScreen = TileScreen.Ordering
    uiStore.messageBoxCallback?.(label)
}

export default function generateMessageBoxGraph(): StripProvider {
    const uiStore = useUIStore()

    uiStore.tileScreen

    return newContainerStrip([
        {
            bounds: new Rectangle(3, 3, 4, 4),
            strip: newDownwardStrip([
                newTileStrip([
                    {
                        ...newLabel(uiStore.messageBoxText),
                        xSpan: 4,
                        ySpan: 2,
                    },
                ]),
                newLeftwardStrip([
                    newTileStrip(
                        uiStore.messageBoxOptions.reverse().map((label, index) => ({
                            ...newButton(() => submit(label), label),
                            severity: index === uiStore.messageBoxOptions.length - 1 ? Severity.Primary : Severity.Secondary,
                        }))
                    ),
                ]),
            ]),
        },
    ])
}
