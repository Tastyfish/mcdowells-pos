import { LabelTabItem } from '@/api/tabview'
import { newLabel } from '@/api/tile'
import { Tile } from '@/api/tile'
import { useOrderStore, useUIStore } from '@/store'

const varReplacement = /\{([^}]+)\}/g

const staticVars: { [varName: string]: string } = {
    appVersion: APP_VERSION,
    menuVersion: MENU_VERSION,
}

/**
 * The string replacer where the variable magic happens.
 * Labels can have a variable in the label from a store eg. `"Order Number: {order:orderNumber}"`
 * @param _whole The full chunk including curly brackets. Unused.
 * @param variable The inner variable.
 */
function parseLabelVar(_whole: string, variable: string): string {
    if (variable.includes(':')) {
        // Uses a store.
        const [storeName, storeVar] = variable.split(':')

        const store = storeName === 'order' ? useOrderStore() : storeName === 'ui' ? useUIStore() : null
        if (store === null) {
            return `STORE? ${storeName}`
        }

        if (!Object.keys(store).some((key) => key === storeVar)) {
            return `STOREVAR? ${storeName} : ${store}`
        }

        const value = Object.entries(store).find(([key]) => key === storeVar)?.[1]

        if (value === null || value === undefined) {
            return 'NULL'
        }

        if (value instanceof Array) {
            return value.length.toString()
        }

        return `${value}`
    }

    // Otherwise, we have some hardwired vars.
    return variable in staticVars ? staticVars[variable] : `VAR? ${variable}`
}

export function generateLabelItem(item: LabelTabItem): Tile {
    return newLabel(item.label.replace(varReplacement, parseLabelVar))
}
