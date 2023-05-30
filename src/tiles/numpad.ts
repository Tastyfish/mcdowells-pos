import Rectangle from "@/api/rectangle"
import {
  Severity, newButton, newLabel,
} from '@/api/tile'
import { StripProvider, newArrayStrip, newContainerStrip } from "@/api/strip"
import { TileScreen, useUIStore } from "@/store"

/**
 * Leave the screen and go back.
 */
function cancel() {
  const uiStore = useUIStore()

  uiStore.tileScreen = TileScreen.Ordering
}

/**
 * Close numpad and call callback.
 */
function submit() {
  const uiStore = useUIStore()

  uiStore.tileScreen = TileScreen.Ordering
  uiStore.numpadCallback?.(parseFloat(uiStore.numpadValue))
  uiStore.numpadValue = '0'
  uiStore.numpadCallback = null
}

/**
 * Backspace the input.
 * @param uiStore The UI store to mutate.
 */
function backspace(uiStore: ReturnType<typeof useUIStore>) {
  const newVal = uiStore.numpadValue.substring(0, uiStore.numpadValue.length - 1);

  uiStore.numpadValue = newVal.length === 0 ? '0' : newVal
}

/**
 * Add a numeric digit.
 * @param uiStore The UI store to mutate.
 * @param digit The digit to add.
 */
function addDigit(uiStore: ReturnType<typeof useUIStore>, digit: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) {
  const newVal = uiStore.numpadValue + digit

  uiStore.numpadValue = newVal[0] === '0' && newVal[1] !== '.' ? newVal.substring(1) : newVal
}

/**
 * Add or move the decimal point if there already is one.
 * @param uiStore The UI store to mutate.
 */
function addDecimal(uiStore: ReturnType<typeof useUIStore>) {
  uiStore.numpadValue = uiStore.numpadValue.replace('.', '') + '.'
}

export default function generateNumpadGraph(): StripProvider {
  const uiStore = useUIStore()

  return newContainerStrip(new Rectangle(0, 0, 10, 10), [
    newArrayStrip(new Rectangle(3, 2, 10, 1), [
      {
        ...newLabel(uiStore.numpadValue.toString()),
        xSpan: 4,
        severity: Severity.Info,
      }
    ]),
    newArrayStrip(new Rectangle(3, 4, 4, 4), [
      newButton(() => addDigit(uiStore, 1), '1'),
      newButton(() => addDigit(uiStore, 2), '2'),
      newButton(() => addDigit(uiStore, 3), '3'),
      {
        ...newButton(cancel, 'Cancel', 'pi pi-arrow-left'),
        severity: Severity.Info,
        ySpan: 2,
      },
      newButton(() => addDigit(uiStore, 4), '4'),
      newButton(() => addDigit(uiStore, 5), '5'),
      newButton(() => addDigit(uiStore, 6), '6'),
      newButton(() => addDigit(uiStore, 7), '7'),
      newButton(() => addDigit(uiStore, 8), '8'),
      newButton(() => addDigit(uiStore, 9), '9'),
      {
        ...newButton(submit, 'Enter', 'pi pi-arrow-right'),
        severity: Severity.Success,
        ySpan: 2,
      },
      {
        ...newButton(() => backspace(uiStore), 'BS', 'pi pi-delete-left'),
        severity: Severity.Danger,
      },
      newButton(() => addDigit(uiStore, 0), '0'),
      {
        ...newButton(() => addDecimal(uiStore), '.'),
        severity: Severity.Secondary,
      },
    ]),
  ]);
}
