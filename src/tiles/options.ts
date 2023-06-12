import Rectangle from "@/api/rectangle";
import { ContainedStripInfo, newTileStrip } from "@/api/strip";
import { newToggle, Tile, newLabel } from "@/api/tile";
import { useUIStore } from "@/store";

export default function generateOptionsGraph(): ContainedStripInfo {
    const uiStore = useUIStore()

    return {
        bounds: new Rectangle(1, 9, 8, 1),
        strip: newTileStrip(
            [
                newToggle(uiStore.showingPrices, () => (uiStore.showingPrices = !uiStore.showingPrices), 'Show Prices') as Tile,
                newToggle(uiStore.showingProductBuild, () => (uiStore.showingProductBuild = !uiStore.showingProductBuild), 'Show Product Build'),
            ].concat(
                uiStore.showingProductBuild
                    ? [
                          { ...newLabel(`Software build: ${APP_VERSION}`), width: 3 },
                          { ...newLabel(`Menu build: ${MENU_VERSION}`), width: 3 },
                      ]
                    : []
            )
        ),
    }
}
