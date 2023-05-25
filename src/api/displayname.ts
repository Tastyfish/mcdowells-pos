import { ChoiceSlot } from "./menu";
import { NewOrderLine, NewOrderChoice } from "./order";

export function getMenuItemDisplayName(line: NewOrderLine) {
  if (!line.menuItem.simpleDisplayName && line.size) {
    return `${line.size} ${line.menuItem.displayName}`;
  }
  return line.menuItem.displayName;
}

export function getChoiceItemDisplayName(choice: NewOrderChoice) {
  if (!choice.choiceItem.simpleDisplayName && choice.line.size) {
    return `${choice.line.size} ${choice.choiceItem.displayName}`;
  }
  return choice.choiceItem.displayName;
}

/**
 * Get the display name for a choice slot.
 * @param slot What is our slot?
 * @param choice What is the filled in order choice selected, if any?
 * @returns The display name.
 */
export function getChoiceSlotDisplayName(slot: ChoiceSlot, choice?: NewOrderChoice) {
  return choice ? getChoiceItemDisplayName(choice) : `Missing: ${slot.displayName}`;
}
