import Rectangle from "@/api/rectangle";
import { StripProvider, newArrayStrip } from "@/api/strip";
import { newMealButton } from ".";

export const generateGiftStrips = (): StripProvider[] => ([
  newArrayStrip(new Rectangle(0, 0, 8, 3), [
    newMealButton('gift05'),
    newMealButton('gift10'),
    newMealButton('gift25'),
  ]),
]);
