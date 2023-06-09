import { ContainedStripInfo } from "@/api/strip";
import { generateMealTabStrips, newMealButton } from ".";

export const generateLunchViewStrips = (): ContainedStripInfo[] => generateMealTabStrips([
    newMealButton('bigmac'),
    newMealButton('2cheeseburgers'),
    newMealButton('quarterpounder'),
    newMealButton('DBLquarterpounder'),
    newMealButton('BCNclubhouseburger'),
    newMealButton('nuggets10'),
])
