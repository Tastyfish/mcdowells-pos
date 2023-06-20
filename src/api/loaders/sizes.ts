import { ref, readonly } from 'vue'
import { ComboSizeGroup, ComboSize, isValidComboSize, isValidComboGroup } from '../size'
import { loadConfig } from './config'

interface RawSizeSchema {
    /** The sizes */
    sizes: Record<string, Omit<ComboSize, 'id'>>
    /** The order they should appear in the sidebar. */
    order: string[]
    /** The allowed size groups that menu items use. */
    groups: Record<string, string[]>
    /** The default size when using side choice, independent drink, etc. */
    default: string
}

function parseSize(rawSizes: Record<string, Omit<ComboSize, 'id'>>): Record<string, ComboSize> {
    return Object.fromEntries(
        Object.entries(rawSizes)
            .map(([id, size]) => [id, { ...size, id }] as [string, ComboSize])
            .filter(([_id, size]) => isValidComboSize(size))
    )
}

function parseOrder(rawOrder: string[]): string[] {
    return rawOrder.filter((size) => typeof size === 'string')
}

function parseGroups(rawGroups: Record<string, string[]>): Record<string, ComboSizeGroup> {
    return Object.fromEntries(
        Object.entries(rawGroups)
            .map(([id, group]) => [id, { id, sizes: group }] as [string, ComboSizeGroup])
            .filter(([_id, group]) => isValidComboGroup(group))
    )
}

const _sizes = ref({} as Record<string, ComboSize>)
const _sizeOrder = ref([] as string[])
const _sizeGroups = ref({} as Record<string, ComboSizeGroup>)
const _defaultSize = ref(undefined as ComboSize | undefined)

async function loadSizes() {
    const raw = await loadConfig<RawSizeSchema>('sizes')

    if (!('sizes' in raw && 'order' in raw && 'groups' in raw)) {
        console.error('Config sizes.json does not have the correct root format.')
        return
    }

    _sizes.value = parseSize(raw.sizes)
    _sizeOrder.value = parseOrder(raw.order)
    _sizeGroups.value = parseGroups(raw.groups)
    _defaultSize.value = _sizes.value[raw.default]
}

loadSizes()

export const sizes = readonly(_sizes)
export const sizeOrder = readonly(_sizeOrder)
export const sizeGroups = readonly(_sizeGroups)
export const defaultSize = readonly(_defaultSize)
