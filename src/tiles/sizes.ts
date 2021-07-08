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
  size: Sizes,
  name: string,
  icon: string,
}

const sizeInfo: SizeInfo[] = [
  { size: Sizes.XSmall, name: 'X Small', icon: 'pi pi-angle-double-down' },
  { size: Sizes.Small, name: 'Small', icon: 'pi pi-angle-down' },
  { size: Sizes.Medium, name: 'Medium', icon: 'pi pi-angle-right' },
  { size: Sizes.Large, name: 'Large', icon: 'pi pi-angle-up' },
  { size: Sizes.Senior, name: 'Senior', icon: 'pi pi-angle-left' },
];

function newSizeToggle(info: SizeInfo) {
  return newToggle(
    vxm.order.sizeSelection === info.size,
    () => {
      if (vxm.order.sizeSelection === info.size) {
        // Turn off selection.
        vxm.order.startSizeSelection(null);
      } else {
        // Select.
        vxm.order.startSizeSelection(info.size);
      }
    },
    info.name,
    info.icon,
  );
}

export default function generateSizeGraph(): StripProvider {
  return newArrayStrip(new Rectangle(0, 4, 1, 6), [
    newSizeToggle(sizeInfo[0]),
    newSizeToggle(sizeInfo[1]),
    newSizeToggle(sizeInfo[2]),
    newSizeToggle(sizeInfo[3]),
    severeup(newLabel('Lunch'), Severity.Success),
    newSizeToggle(sizeInfo[4]),
  ]);
}
