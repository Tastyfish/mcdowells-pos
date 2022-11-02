import {
  Severity, newLabel, newToggle, severeup,
} from '@/api/tile';
import {
  StripProvider, newArrayStrip,
} from '@/api/strip';
import Rectangle from '@/api/rectangle';

import vxm from '@/store';
import Sizes from '@/menu/sizes';

interface SizeInfo {
  name: string,
  icon: string,
}

const sizeInfo: { [key in Sizes]: SizeInfo } = {
  [Sizes.HappyMeal]: { name: 'Happy Meal', icon: 'pi pi-home' },
  [Sizes.XSmall]: { name: 'X Small', icon: 'pi pi-angle-double-down' },
  [Sizes.Small]: { name: 'Small', icon: 'pi pi-angle-down' },
  [Sizes.Medium]: { name: 'Medium', icon: 'pi pi-angle-right' },
  [Sizes.Large]: { name: 'Large', icon: 'pi pi-angle-up' },
  [Sizes.Senior]: { name: 'Senior', icon: 'pi pi-angle-left' },
};

function newSizeToggle(size: Sizes) {
  const { name, icon } = sizeInfo[size];

  return newToggle(
    vxm.order.sizeSelection === size,
    () => {
      if (vxm.order.sizeSelection === size) {
        // Turn off selection.
        vxm.order.startSizeSelection(null);
      } else {
        // Select.
        vxm.order.startSizeSelection(size);
      }
    },
    name,
    icon,
  );
}

export default function generateSizeGraph(): StripProvider {
  return newArrayStrip(new Rectangle(0, 4, 1, 6), [
    newSizeToggle(Sizes.XSmall),
    newSizeToggle(Sizes.Small),
    newSizeToggle(Sizes.Medium),
    newSizeToggle(Sizes.Large),
    severeup(newLabel('Lunch'), Severity.Success),
    newSizeToggle(Sizes.Senior),
  ]);
}
