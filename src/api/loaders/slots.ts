import { ref, readonly } from 'vue'
import { loadConfig } from './config'
import { ChoiceSlot, isValidChoiceSlot } from '../menu'

type RawSlotSchema = Record<string, Omit<ChoiceSlot, 'id'>>

function sanitizeSlot(slot: ChoiceSlot): ChoiceSlot | null {
    return isValidChoiceSlot(slot) ? slot : null
}

function parseSlots(rawSlots: RawSlotSchema): Record<string, ChoiceSlot> {
    return Object.fromEntries(
        (
            Object.entries(rawSlots)
                .map(([id, slot]) => sanitizeSlot({ id, ...slot }))
                .filter((slot) => slot !== null) as ChoiceSlot[]
        ).map((slot) => [slot.id, slot])
    )
}

const slots = ref({} as Record<string, ChoiceSlot>)

async function loadSlots() {
    slots.value = parseSlots(await loadConfig<RawSlotSchema>('slots'))
}

loadSlots()

export default readonly(slots)
