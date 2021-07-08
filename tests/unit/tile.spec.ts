import * as Tile from '@/api/tile';

function empty() {
  // do nothing
}

describe('tile.ts', () => {
  it('identifies LabelTiles', () => {
    const bt = Tile.newLabel('Hi!');

    expect(Tile.isLabel(bt)).toBeTruthy();
    expect(Tile.isButton(bt)).toBeFalsy();
    expect(Tile.isToggle(bt)).toBeFalsy();
    expect(Tile.isSplitToggle(bt)).toBeFalsy();
  });

  it('identifies ButtonTiles', () => {
    const bt = Tile.newButton(empty, 'Hi!');

    expect(Tile.isLabel(bt)).toBeFalsy();
    expect(Tile.isButton(bt)).toBeTruthy();
    expect(Tile.isToggle(bt)).toBeFalsy();
    expect(Tile.isSplitToggle(bt)).toBeFalsy();
  });

  it('identifies ToggleTiles', () => {
    const bt = Tile.newToggle(false, empty, 'Hi!');

    expect(Tile.isLabel(bt)).toBeFalsy();
    expect(Tile.isButton(bt)).toBeFalsy();
    expect(Tile.isToggle(bt)).toBeTruthy();
    expect(Tile.isSplitToggle(bt)).toBeFalsy();
  });

  it('identifies SplitToggleTiles', () => {
    const bt = Tile.newSplitToggle(Tile.SplitToggleState.TopToggled,
      empty, 'Hi!', 'Bye!');

    expect(Tile.isLabel(bt)).toBeFalsy();
    expect(Tile.isButton(bt)).toBeFalsy();
    expect(Tile.isToggle(bt)).toBeFalsy();
    expect(Tile.isSplitToggle(bt)).toBeTruthy();
  });
});
