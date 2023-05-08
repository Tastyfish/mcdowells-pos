// The entire grid of tiles is defined by a single graph determined by state

import {
  StripProvider, newContainerStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import { useUIStore } from '@/store';

import generateChoiceGraph from './choices';
import generateSizeGraph from './sizes';
import generateTabsGraph from './tabs';
import generateCountGraph from './count';
import generateCommandsGraph from './commands';
import generateTabViewGraph from './tabviews';

import generateTotalScreenGraph from './totalScreen';

// Should be cached between state changes.
export default function generateGraph(): StripProvider {
  const uiStore = useUIStore();

  if (uiStore.totallingOrder) {
    // Running the total and cashing out screen
    return generateTotalScreenGraph();
  }

  // Main screen
  return newContainerStrip(new Rectangle(0, 0, 10, 10), [
    generateChoiceGraph(),
    generateCountGraph(),
    generateTabsGraph(),
    generateSizeGraph(),
    generateCommandsGraph(),
    generateTabViewGraph(),
  ]);
}
