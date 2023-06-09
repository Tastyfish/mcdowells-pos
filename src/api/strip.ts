import Rectangle from './rectangle'
import { Tile, Severity, emptyTile, newButton, severeup } from './tile'

/**
  Base provider of strip info.
* */
export interface StripProvider {
    /**
     * Solidify contents as provided strips.
     * @param maxWidth Max width.
     * @param maxHeight Max height.
     */
    (maxWidth: number, maxHeight: number): ProvidedStrip
}

/**
 * A provided strip, ready to render.
 */
export interface ProvidedStrip {
    /**
     * Our final width. Can be 1 to maxWidth provided.
     */
    readonly width: number

    /**
     * Our final height. Can be 1 to maxHeight provided.
     */
    readonly height: number

    /**
     * Grow to fill space. True or undefined for convenience.
     */
    readonly grow?: true

    /**
     * Get a tile within the provider.
     * @param x X coord of tile, relative to bounds.
     * @param y Y coord of tiel, relative to bounds.
     * @param width The width the parent wants to render this strip at.
     * @param height The height the parent wants to render this strip at.
     * @returns The tile.
     */
    readonly getTile: (x: number, y: number, width: number, height: number) => Tile
}

/**
  Strip based on tile array. The backbone of providing raw tiles.
  @param {Tile[]} tiles The actual tiles.
  @return {StripProvider} The resulting provider.
* */
export function newTileStrip(tiles: Tile[]): StripProvider {
    return (maxWidth, maxHeight) => {
        // Adjust list to account for xSpan and ySpan.
        const realTiles: (Tile | undefined)[] = new Array(maxWidth * maxHeight)

        // To determine actual bounds at the end.
        let finalWidth = 0
        let finalHeight = 0

        let tileIndex = 0
        for (let y = 0; y < maxHeight; y++) {
            for (let x = 0; x < maxWidth; ) {
                const tile = tiles[tileIndex] ?? emptyTile

                if (realTiles[x + y * maxWidth]) {
                    x++
                    continue
                }

                realTiles[x + y * maxWidth] = tile

                if (tile !== emptyTile) {
                    finalWidth = Math.max(finalWidth, x + (tile.xSpan ?? 1))
                    finalHeight = Math.max(finalHeight, y + (tile.ySpan ?? 1))
                }

                for (let subY = 1; subY < (tile.ySpan ?? 1); subY++) {
                    realTiles[x + (y + subY) * maxWidth] = emptyTile
                }

                x++

                for (let subX = 1; subX < (tile.xSpan ?? 1); subX++, x++) {
                    realTiles[x + y * maxWidth] = emptyTile

                    for (let subY = 1; subY < (tile.ySpan ?? 1); subY++) {
                        realTiles[x + (y + subY) * maxWidth] = emptyTile
                    }
                }

                tileIndex++
            }
        }

        return {
            width: finalWidth,
            height: finalHeight,
            getTile: (x, y) => {
                // Note that we completely ignore any requested dimensions, as we've already baked the layout.
                // The various strips below need to be used to otherwise align it.

                if (x < 0 || x >= maxWidth || y < 0 || y >= maxHeight) {
                    return emptyTile
                }

                return realTiles[x + y * maxWidth] ?? emptyTile
            },
        }
    }
}

/**
  Strip that provides no content.
* */
export const emptyStrip = newTileStrip([])

export interface ContainedStripInfo {
    bounds: Rectangle
    strip: StripProvider
}

/**
  Strip containing other strips at arbitrary locations.
  Use sparingly as it involves hardcoded positions.
  @param {ContainedStripInfo[]} strips The strips and their bounds.
  @return {StripProvider} The resulting provider.
* */
export function newContainerStrip(strips: ContainedStripInfo[]): StripProvider {
    const itemsWidth = strips.map(({ bounds }) => bounds.right).reduce((prev, cur) => Math.max(prev, cur))
    const itemsHeight = strips.map(({ bounds }) => bounds.bottom).reduce((prev, cur) => Math.max(prev, cur))

    const finalStrips = strips.map(({ bounds, strip }) => ({ bounds, strip: strip(bounds.width, bounds.height) }))

    return (maxWidth, maxHeight) => {
        const finalWidth = Math.min(itemsWidth, maxWidth)
        const finalHeight = Math.min(itemsHeight, maxHeight)

        return {
            width: finalWidth,
            height: finalHeight,
            getTile(x, y) {
                const matchedChild = finalStrips.find(({ bounds }) => bounds.contains(x, y))

                if (matchedChild !== undefined) {
                    return matchedChild.strip.getTile(
                        x - matchedChild.bounds.x,
                        y - matchedChild.bounds.y,
                        matchedChild.bounds.width,
                        matchedChild.bounds.height
                    )
                }
                return emptyTile
            },
        }
    }
}

/**
  Create a list that fills the bounds, with a "More" button at the end,
  there's no more space.
  @param {Tile[]} items The tiles to show that will be rotated through.
  @param {number} page The current page to display.
  @param {() => void} incrementPage The callback from pressing More.
  @return {StripProvider} The resulting provider.
* */
export function newListStrip(items: Tile[], page: number, incrementPage: () => void): StripProvider {
    return (maxWidth) => {
        // So layouts can reliably assume that a list takes up 1 row.
        if (items.length === 0) {
            return {
                ...emptyStrip(1, 1),
                width: 1,
                height: 1,
            }
        }

        if (items.length <= maxWidth) {
            // We actually don't need the More button!
            return newTileStrip(items)(items.length, 1)
        }

        // Show the current page, and the More button
        const pageSize = maxWidth - 1
        const numPages = Math.ceil(items.length / pageSize)

        // Page number is fine with looping
        const realPage = page % numPages
        const moreButton = severeup(newButton(incrementPage, 'MORE', 'pi pi-arrow-right'), Severity.Info)

        // Note, the last page may be less than a page in length.
        const pageContent = items.slice(realPage * pageSize, (realPage + 1) * pageSize)

        return newTileStrip(pageContent.concat(Array(pageSize - pageContent.length).fill(emptyTile)).concat([moreButton]))(maxWidth, 1)
    }
}

/**
  Form a vertical strip going top-down.
  @param {StripProvider[]} strips The strips within.
  @return {StripProvider} The resulting provider.
* */
export function newDownwardStrip(strips: StripProvider[]): StripProvider {
    return (maxWidth, maxHeight) => {
        // Render all items, which will give us their heights implicitly.
        let remainingHeight = maxHeight
        // Number of strips that grow.
        let numberGrows = 0

        const finalStrips = strips
            .map((strip) => {
                if (remainingHeight <= 0) return null

                const ps = strip(maxWidth, remainingHeight)
                remainingHeight -= ps.height
                if(ps.grow) {
                    numberGrows++
                }
                return ps
            })
            .filter((ps) => ps !== null) as ProvidedStrip[]

        const finalWidth = Math.min(
            maxWidth,
            finalStrips.map(({ width }) => width).reduce((old, width) => Math.max(old, width))
        )

        const finalHeight = Math.min(maxHeight, maxHeight - remainingHeight)

        return {
            width: finalWidth,
            height: finalHeight,
            getTile(x, y, width, height) {
                // Amount to add to each grow item's height.
                const growAmount = numberGrows === 0 ? 0 : Math.floor((height - finalHeight) / numberGrows)

                const strip = finalStrips.find((ps) => {
                    const stripHeight = ps.height + (ps.grow ? growAmount : 0)

                    if (y < stripHeight) {
                        return true
                    }

                    y -= stripHeight
                    return false
                })

                if (strip === undefined) {
                    return emptyTile
                }

                return strip.getTile(x, y, width, strip.height + (strip.grow ? growAmount : 0))
            },
        }
    }
}

/**
  Form a vertical strip going bottom-up.
  @param {StripProvider[]} strips The strips within.
  @return {StripProvider} The resulting provider.
* */
export function newUpwardStrip(strips: StripProvider[]): StripProvider {
    return (maxWidth, maxHeight) => {
        // Render all items, which will give us their heights implicitly.
        let remainingHeight = maxHeight
        // Number of strips that grow.
        let numberGrows = 0

        const finalStrips = strips
            .map((strip) => {
                if (remainingHeight <= 0) return null

                const ps = strip(maxWidth, remainingHeight)
                remainingHeight -= ps.height
                if(ps.grow) {
                    numberGrows++
                }
                return ps
            })
            .filter((ps) => ps !== null) as ProvidedStrip[]

        const finalWidth = Math.min(
            maxWidth,
            finalStrips.map(({ width }) => width).reduce((old, width) => Math.max(old, width))
        )

        const finalHeight = Math.min(maxHeight, maxHeight - remainingHeight)

        return {
            width: finalWidth,
            height: finalHeight,
            getTile(x, y, width, height) {
                // Search bottom to top.
                y = height - y - 1

                // Amount to add to each grow item's height.
                const growAmount = numberGrows === 0 ? 0 : Math.floor((height - finalHeight) / numberGrows)

                const strip = finalStrips.find((ps) => {
                    const stripHeight = ps.height + (ps.grow ? growAmount : 0)

                    if (y < stripHeight) {
                        return true
                    }

                    y -= stripHeight
                    return false
                })

                if (strip === undefined) {
                    return emptyTile
                }

                return strip.getTile(x, strip.height - y - 1, width, strip.height + (strip.grow ? growAmount : 0))
            },
        }
    }
}

/**
  Form a horizontal strip going left-to-right.
  @param {StripProvider[]} strips The strips within.
  @return {StripProvider} The resulting provider.
* */
export function newRightwardStrip(strips: StripProvider[]): StripProvider {
    return (maxWidth, maxHeight) => {
        // Render all items, which will give us their heights implicitly.
        let remainingWidth = maxWidth
        // Number of strips that grow.
        let numberGrows = 0

        const finalStrips = strips
            .map((strip) => {
                if (remainingWidth <= 0) return null

                const ps = strip(remainingWidth, maxHeight)
                remainingWidth -= ps.width
                if(ps.grow) {
                    numberGrows++
                }
                return ps
            })
            .filter((ps) => ps !== null) as ProvidedStrip[]

        const finalWidth = Math.min(maxWidth, maxWidth - remainingWidth)

        const finalHeight = Math.min(
            maxHeight,
            finalStrips.map(({ height }) => height).reduce((old, height) => Math.max(old, height))
        )

        return {
            width: finalWidth,
            height: finalHeight,
            getTile(x, y, width, height) {
                // Amount to add to each grow item's width.
                const growAmount = numberGrows === 0 ? 0 : Math.floor((width - finalWidth) / numberGrows)

                const strip = finalStrips.find((ps) => {
                    const stripWidth = ps.width + (ps.grow ? growAmount : 0)

                    if (x < stripWidth) {
                        return true
                    }

                    x -= stripWidth
                    return false
                })

                if (strip === undefined) {
                    return emptyTile
                }

                return strip.getTile(x, y, strip.width + (strip.grow ? growAmount : 0), height)
            },
        }
    }
}

/**
  Form a vertical strip going right-to-left.
  @param {StripProvider[]} strips The strips within.
  @return {StripProvider} The resulting provider.
* */
export function newLeftwardStrip(strips: StripProvider[]): StripProvider {
    return (maxWidth, maxHeight) => {
        // Render all items, which will give us their heights implicitly.
        let remainingWidth = maxWidth
        // Number of strips that grow.
        let numberGrows = 0

        const finalStrips = strips
            .map((strip) => {
                if (remainingWidth <= 0) return null

                const ps = strip(remainingWidth, maxHeight)
                remainingWidth -= ps.width
                if(ps.grow) {
                    numberGrows++
                }
                return ps
            })
            .filter((ps) => ps !== null) as ProvidedStrip[]

        const finalWidth = Math.min(maxWidth, maxWidth - remainingWidth)

        const finalHeight = Math.min(
            maxHeight,
            finalStrips.map(({ height }) => height).reduce((old, height) => Math.max(old, height))
        )

        return {
            width: finalWidth,
            height: finalHeight,
            getTile(x, y, width, height) {
                // Search right to left.
                x = width - x - 1

                // Amount to add to each grow item's width.
                const growAmount = numberGrows === 0 ? 0 : Math.floor((width - finalWidth) / numberGrows)

                const strip = finalStrips.find((ps) => {
                    const stripWidth = ps.width + (ps.grow ? growAmount : 0)

                    if (x < stripWidth) {
                        return true
                    }

                    x -= stripWidth
                    return false
                })

                if (strip === undefined) {
                    return emptyTile
                }

                return strip.getTile(strip.width - x - 1, y, strip.width + (strip.grow ? growAmount : 0), height)
            },
        }
    }
}

export function constrainWidth(width: number, provider: StripProvider): StripProvider {
    return (maxWidth, maxHeight) => provider(Math.min(width, maxWidth), maxHeight)
}

export function constrainHeight(height: number, provider: StripProvider): StripProvider {
    return (maxWidth, maxHeight) => provider(maxWidth, Math.min(height, maxHeight))
}

export function grow(provider: StripProvider): StripProvider {
    return (maxWidth, maxHeight) => ({ ...provider(maxWidth, maxHeight), grow: true })
}
