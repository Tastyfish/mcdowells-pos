import { ref, readonly, computed } from 'vue'
import { loadConfig } from './config'
import slots from './slots'
import { ChoiceItem, isValidChoiceItem } from '../menu'

type RawChoiceSchema = Record<string, Omit<ChoiceItem, 'id'>>

function parseChoices(rawChoices: RawChoiceSchema): Record<string, ChoiceItem> {
    return Object.fromEntries(
        Object.entries(rawChoices)
            .map(([id, choice]) => [id, { ...choice, id }] as [string, ChoiceItem])
            .filter(([_id, choice]) => isValidChoiceItem(choice))
    )
}

const _choices = ref({} as Record<string, ChoiceItem>)

async function loadChoices() {
    _choices.value = parseChoices(await loadConfig<RawChoiceSchema>('choices'))
}

loadChoices()

export const choiceItems = readonly(_choices)

/**
 * Map of slotID => ChoiceItems[] which are associated with that slot.
 */
export const choiceItemsBySlot = computed(() => {
    const slotIDs = Object.keys(slots.value)
    const choices_snapshot = Object.values(_choices.value)

    return Object.fromEntries(slotIDs.map((slotID) => [slotID, choices_snapshot.filter((choice) => choice.slot === slotID)]))
})
