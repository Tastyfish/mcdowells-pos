// The entire grid of tiles is defined by a single graph determined by state

import { StripProvider, newContainerStrip } from '@/api/strip'

import { TileScreen, useUIStore } from '@/store'

import generateChoiceGraph from './choices'
import generateCountGraph from './count'
import generateCommandsGraph from './commands'
import generateOptionsGraph from './options'
import generateSizeGraph from './sizes'
import generateTabsGraph from './tabs'
import generateTabViewGraph from './tabviews'

import generateTotalScreenGraph from './totalScreen'
import generateNumpadGraph from './numpad'
import generateMessageBoxGraph from './messagebox'

// Should be cached between state changes.
export default function generateGraph(): StripProvider {
    const uiStore = useUIStore()

    switch (uiStore.tileScreen) {
        case TileScreen.Totalling:
            // Running the total and cashing out screen
            return generateTotalScreenGraph()
        case TileScreen.Numpad:
            // Modal numpad.
            return generateNumpadGraph()
        case TileScreen.MessageBox:
            // Modal message box.
            return generateMessageBoxGraph()
        default:
            // Main screen
            return newContainerStrip([
                generateChoiceGraph(),
                generateCommandsGraph(),
                generateCountGraph(),
                generateOptionsGraph(),
                generateSizeGraph(),
                generateTabsGraph(),
                generateTabViewGraph(),
            ])
    }
}
