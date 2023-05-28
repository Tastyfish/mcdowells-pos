import Rectangle from './rectangle';
import {
  Tile, Severity, emptyTile, newButton, severeup,
} from './tile';

/**
  Base provider of strip info.
* */
export interface StripProvider {
  readonly bounds: Rectangle
  readonly getTile: (x: number, y: number) => Tile
}

/**
  Strip based on tile array. The backbone of providing raw tiles.
  @param {Rectangle} bounds The bounds relative to the parent provider.
  @param {Tile[]} tiles The actual tiles.
  @return {StripProvider} The resulting provider.
* */
export function newArrayStrip(bounds: Rectangle, tiles: Tile[]): StripProvider {
  // Adjust list to account for xSpan and ySpan.
  const realTiles: (Tile | undefined)[] = new Array(bounds.width * bounds.height);

  let tileIndex = 0;
  for(let y = 0; y < bounds.height; y++) {
    for(let x = 0; x < bounds.width;) {
      const tile = tiles[tileIndex] ?? emptyTile;

      if(realTiles[x + y * bounds.width]) {
        x++;
        continue;
      }

      realTiles[x + y * bounds.width] = tile;

      for(let subY = 1; subY < (tile.ySpan ?? 1); subY++) {
        realTiles[x + (y + subY) * bounds.width] = emptyTile;
      }

      x++;

      for(let subX = 1; subX < (tile.xSpan ?? 1); subX++, x++) {
        realTiles[x + y * bounds.width] = emptyTile;

        for(let subY = 1; subY < (tile.ySpan ?? 1); subY++) {
          realTiles[x + (y + subY) * bounds.width] = emptyTile;
        }
      }

      tileIndex++;
    }
  }

  return {
    bounds,
    getTile: (x, y) => {
      // Normalize x and y to not ruin the math.
      const rx = Math.max(0, Math.min(bounds.width - 1, x));
      const ry = Math.max(0, Math.min(bounds.height - 1, y));
      const idx = rx + ry * bounds.width;

      return realTiles[idx] ?? emptyTile;
    },
  };
}

/**
  Strip that provides no content.
* */
export const emptyStrip = newArrayStrip(new Rectangle(0, 0, 1, 1), []);

/**
  Strip containing other strips at arbitrary locations.
  The... other backbone of the tile system.
  @param {Rectangle} bounds The bounds relative to the parent provider.
  @param {StripProvider[]} strips The strips within.
  @return {StripProvider} The resulting provider.
* */
export function newContainerStrip(bounds: Rectangle, strips: StripProvider[])
  : StripProvider {
  return {
    bounds,
    getTile: (x, y) => {
      const matchedChild = strips.find((strip) => strip.bounds.contains(x, y));

      if (matchedChild !== undefined) {
        return matchedChild.getTile(
          x - matchedChild.bounds.x,
          y - matchedChild.bounds.y,
        );
      }
      return emptyTile;
    },
  };
}

/**
  Place a single strip in a different bounding box, ignoring the original strip's
* */
export function newFrameStrip(bounds: Rectangle, child: StripProvider)
  : StripProvider {
  return { bounds, getTile: child.getTile };
}

/**
  Create a list that fills the bounds, with a "More" button at the end,
  there's no more space.
  @param {Rectangle} bounds The bounds relative to the parent provider.
  @param {Tile[]} items The tiles to show that will be rotated through.
  @param {number} page The current page to display.
  @param {() => void} incrementPage The callback from pressing More.
  @return {StripProvider} The resulting provider.
* */
export function newListStrip(bounds: Rectangle, items: Tile[],
  page: number, incrementPage: () => void)
  : StripProvider {
  if (items.length <= bounds.width) {
    // We actually don't need the More button!
    return newArrayStrip(bounds, items);
  }
  // Show the current page, and the More button
  const pageSize = bounds.width - 1;
  const numPages = Math.ceil(items.length / pageSize);
  // Page number is fine with looping
  const realPage = page % numPages;
  const moreButton = severeup(
    newButton(incrementPage, 'MORE', 'pi pi-arrow-right'),
    Severity.Info,
  );
  // Note, the last page may be less than a page in length.
  const pageContent = items.slice(realPage * pageSize, (realPage + 1) * pageSize);

  return newArrayStrip(bounds,
    pageContent
      .concat(Array(pageSize - pageContent.length).fill(emptyTile))
      .concat([moreButton]));
}

/**
  Form a vertical strip going top-down.
  @param {Rectangle} bounds The bounds relative to the parent provider.
  @param {StripProvider[]} strips The strips within.
  @return {StripProvider} The resulting provider.
* */
export function newDownwardStrip(bounds: Rectangle, strips: StripProvider[])
  : StripProvider {
  // Move all the children into position with frames.
  let curY = 0;
  const framedStrips = strips.map((strip) => {
    const f = newFrameStrip(
      new Rectangle(0, curY, bounds.width, strip.bounds.height),
      strip,
    );
    curY += strip.bounds.height;
    return f;
  });

  return newContainerStrip(bounds, framedStrips);
}

/**
  Form a vertical strip going bottom-up.
  @param {Rectangle} bounds The bounds relative to the parent provider.
  @param {StripProvider[]} strips The strips within.
  @return {StripProvider} The resulting provider.
* */
export function newUpwardStrip(bounds: Rectangle, strips: StripProvider[])
  : StripProvider {
  // Move all the children into position with frames.
  let curY = bounds.height;
  const framedStrips = strips.map((strip) => {
    curY -= strip.bounds.height;
    return newFrameStrip(
      new Rectangle(0, curY, bounds.width, strip.bounds.height),
      strip,
    );
  });

  return newContainerStrip(bounds, framedStrips);
}

/**
  Form a horizontal strip going left-to-right.
  @param {Rectangle} bounds The bounds relative to the parent provider.
  @param {StripProvider[]} strips The strips within.
  @return {StripProvider} The resulting provider.
* */
export function newRightwardStrip(bounds: Rectangle, strips: StripProvider[])
  : StripProvider {
  // Move all the children into position with frames.
  let curX = 0;
  const framedStrips = strips.map((strip) => {
    const f = newFrameStrip(
      new Rectangle(curX, 0, strip.bounds.width, bounds.height),
      strip,
    );
    curX += strip.bounds.width;
    return f;
  });

  return newContainerStrip(bounds, framedStrips);
}

/**
  Form a vertical strip going right-to-left.
  @param {Rectangle} bounds The bounds relative to the parent provider.
  @param {StripProvider[]} strips The strips within.
  @return {StripProvider} The resulting provider.
* */
export function newLeftwardStrip(bounds: Rectangle, strips: StripProvider[])
  : StripProvider {
  // Move all the children into position with frames.
  let curX = bounds.width;
  const framedStrips = strips.map((strip) => {
    curX -= strip.bounds.width;
    return newFrameStrip(
      new Rectangle(curX, 0, strip.bounds.width, bounds.height),
      strip,
    );
  });

  return newContainerStrip(bounds, framedStrips);
}
