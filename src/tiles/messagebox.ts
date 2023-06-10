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

    const options = uiStore.messageBoxOptions
    const optionSpan = Math.floor(4 / options.length)

    return newContainerStrip([
        {
            bounds: new Rectangle(3, 3, 4, 4),
            strip: newDownwardStrip([
                newTileStrip([
                    {
                        ...newLabel(uiStore.messageBoxText),
                        width: 4,
                        height: 2,
                    },
                ]),
                newLeftwardStrip([
                    newTileStrip(
                        options.reverse().map((label, index) => ({
                            ...newButton(() => submit(label), label),
                            severity: index === options.length - 1 ? Severity.Primary : Severity.Secondary,
                            width: optionSpan,
                        }))
                    ),
                ]),
            ]),
        },
    ])
}
