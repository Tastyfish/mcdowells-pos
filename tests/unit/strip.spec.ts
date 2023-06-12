import Rectangle from '@/api/rectangle'
import * as Tile from '@/api/tile'
import * as Strip from '@/api/strip'

const r1 = new Rectangle(1, 2, 3, 5)
const r2 = new Rectangle(7, 11, 13, 19)

const lt1: Tile.LabelTile = {
    type: Tile.TileType.Label,
    label: 'Hi',
}

const lt2: Tile.LabelTile = {
    type: Tile.TileType.Label,
    label: 'Bye',
}

const lt3: Tile.LabelTile = {
    type: Tile.TileType.Label,
    label: 'Again',
}

function empty() {
    // do nothing
}

const bt1: Tile.ButtonTile = {
    type: Tile.TileType.Button,
    label: 'OK',
    onPress: empty,
}

const as1 = Strip.newArrayStrip(r1, [lt1, lt2, lt3, bt1])
const as2 = Strip.newArrayStrip(r2, [bt1, lt3, lt2, lt1])

describe('strip.ts', () => {
    it('can create array strips', () => {
        const as = Strip.newArrayStrip(r1, [lt1, lt2, lt3, bt1])

        expect(as.bounds).toEqual(r1)
        expect(as.getTile(0, 0)).toEqual(lt1)
        expect(as.getTile(1, 0)).toEqual(lt2)
        expect(as.getTile(2, 0)).toEqual(lt3)
        expect(as.getTile(0, 1)).toEqual(bt1)
        expect(as.getTile(0, 2)).toEqual(Tile.emptyTile)
    })

    it('can handle array strip edge cases', () => {
        expect(as1.getTile(0, 2)).toEqual(Tile.emptyTile)

        expect(as1.getTile(-1, 0)).toEqual(lt1)
        expect(as1.getTile(0, -1)).toEqual(lt1)
        expect(as1.getTile(5, 0)).toEqual(lt3)
        expect(as1.getTile(0, 20)).toEqual(Tile.emptyTile)
    })

    it('can create container strips', () => {
        const cs = Strip.newContainerStrip(r1, [as1, as2])

        expect(cs.bounds).toEqual(r1)

        expect(cs.getTile(1, 2)).toEqual(lt1)
        expect(cs.getTile(2, 2)).toEqual(lt2)
        expect(cs.getTile(3, 2)).toEqual(lt3)
        expect(cs.getTile(0, 20)).toEqual(Tile.emptyTile)

        expect(cs.getTile(7, 11)).toEqual(bt1)
    })

    it('can create frame strips', () => {
        const fs = Strip.newFrameStrip(r2, as1)

        expect(fs.bounds).toEqual(r2)
        expect(fs.getTile(1, 0)).toEqual(lt2)
    })

    it('can create wide list strips', () => {
        // list wide enough to just show items
        const ls = Strip.newListStrip(r2, [lt1, lt2, lt3, bt1], 0, empty)

        expect(ls.bounds).toEqual(r2)
        expect(ls.getTile(0, 0)).toEqual(lt1)
        expect(ls.getTile(3, 0)).toEqual(bt1)
    })

    it('can create paginated list strips', () => {
        // test pages
        const ls0 = Strip.newListStrip(r1, [lt1, lt2, lt3, bt1], 0, empty)
        const ls1 = Strip.newListStrip(r1, [lt1, lt2, lt3, bt1], 1, empty)
        const ls2 = Strip.newListStrip(r1, [lt1, lt2, lt3, bt1], 2, empty)

        expect(ls0.bounds).toEqual(r1)
        expect(ls0.getTile(0, 0)).toEqual(lt1)
        expect(ls0.getTile(1, 0)).toEqual(lt2)
        expect(ls0.getTile(3, 0).type).toBe(Tile.TileType.Button)

        expect(ls1.bounds).toEqual(r1)
        expect(ls1.getTile(0, 0)).toEqual(lt3)
        expect(ls1.getTile(1, 0)).toEqual(bt1)
        expect(ls1.getTile(3, 0).type).toBe(Tile.TileType.Button)

        expect(ls2.getTile(0, 0)).toEqual(lt1)
    })

    it('can create downward strips', () => {
        const ds = Strip.newDownwardStrip(r2, [as1, as2])

        expect(ds.bounds).toEqual(r2)
        // Definitely not comprehensive,
        // but I don't feel like brute forcing blank spots.
        expect(ds.getTile(0, 0)).toEqual(lt1)
        expect(ds.getTile(0, 5)).toEqual(bt1)
    })
})
