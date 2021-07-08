// The entire grid of tiles is defined by a single graph determined by state

import {
  StripProvider, newContainerStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import generateChoiceGraph from './choices';
import generateSizeGraph from './sizes';
import generateTabsGraph from './tabs';
import generateCountGraph from './count';

// Should be cached between state changes.
export default function generateGraph(): StripProvider {
  return newContainerStrip(new Rectangle(0, 0, 10, 10), [
    generateChoiceGraph(),
    generateCountGraph(),
    generateTabsGraph(),
    generateSizeGraph(),
  ]);
}
