import { ref, readonly } from 'vue'
import { loadConfig } from './config'
import { MenuItem, isValidMenuItem } from '../menu'

type RawMenuSchema = Record<string, Omit<MenuItem, 'id'>>

function parseMenuItems(rawMenuItems: RawMenuSchema): Record<string, MenuItem> {
    return Object.fromEntries(
        Object.entries(rawMenuItems)
            .map(([id, item]) => [id, { ...item, id }] as [string, MenuItem])
            .filter(([_id, item]) => isValidMenuItem(item))
    )
}

const menuItems = ref({} as Record<string, MenuItem>)

async function loadChoices() {
    menuItems.value = parseMenuItems(await loadConfig<RawMenuSchema>('menu'))
}

loadChoices()

export default readonly(menuItems)
