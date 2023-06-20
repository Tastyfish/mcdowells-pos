import { ref, readonly } from 'vue'
import { loadConfig } from './config'
import { ChoiceSlot, isValidChoiceSlot } from '../menu'

type RawSlotSchema = Record<string, Omit<ChoiceSlot, 'id'>>

function parseSlots(rawSlots: RawSlotSchema): Record<string, ChoiceSlot> {
    return Object.fromEntries(
        Object.entries(rawSlots)
            .map(([id, slot]) => ({ id, ...slot }))
            .filter((slot) => isValidChoiceSlot(slot))
            .map((slot) => [slot.id, slot])
    )
}

const slots = ref({} as Record<string, ChoiceSlot>)

async function loadSlots() {
    slots.value = parseSlots(await loadConfig<RawSlotSchema>('slots'))
}

loadSlots()

export default readonly(slots)
