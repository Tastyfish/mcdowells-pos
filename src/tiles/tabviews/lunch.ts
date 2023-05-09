import Rectangle from "@/api/rectangle";
import { StripProvider, newArrayStrip } from "@/api/strip";

import { newMealButton } from ".";
import { generateDrinkStrips } from "./drinks";

export const generateLunchViewStrips = (): StripProvider[] => ([
  ...generateDrinkStrips(),
  newArrayStrip(new Rectangle(0, 0, 8, 3), [
    newMealButton('bigmac'),
    newMealButton('2cheeseburgers'),
    newMealButton('quarterpounder'),
    newMealButton('DBLquarterpounder'),
    newMealButton('BCNclubhouseburger'),
    newMealButton('nuggets10'),
  ]),
]);
