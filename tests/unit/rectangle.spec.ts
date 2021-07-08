import Rectangle from '@/api/rectangle';

describe('rectangle.ts', () => {
  it('stores x, y, width, height', () => {
    const r = new Rectangle(1, 2, 3, 5);

    expect(r.x).toBe(1);
    expect(r.y).toBe(2);
    expect(r.width).toBe(3);
    expect(r.height).toBe(5);
  });

  it('calculates right and bottom', () => {
    const r = new Rectangle(1, 2, 3, 5);

    expect(r.right).toBe(4);
    expect(r.bottom).toBe(7);
  });

  it('detects true intersections', () => {
    const r = new Rectangle(3, 3, 8, 8);

    // Inside.
    expect(r.intersects(new Rectangle(4, 4, 2, 2))).toBeTruthy();

    // Outside
    expect(r.intersects(new Rectangle(1, 1, 100, 100))).toBeTruthy();

    // Intersects top-left
    expect(r.intersects(new Rectangle(1, 2, 3, 3))).toBeTruthy();

    // Intersects top-right
    expect(r.intersects(new Rectangle(9, 2, 10, 3))).toBeTruthy();

    // Intersects bottom-left
    expect(r.intersects(new Rectangle(2, 8, 3, 10))).toBeTruthy();

    // Intersects bottom-right
    expect(r.intersects(new Rectangle(9, 8, 10, 10))).toBeTruthy();
  });

  it('doesn\'t detect non-intersections', () => {
    const r = new Rectangle(3, 3, 8, 8);

    // Corners
    expect(r.intersects(new Rectangle(0, 0, 3, 3))).toBeFalsy();
    expect(r.intersects(new Rectangle(11, 0, 3, 3))).toBeFalsy();
    expect(r.intersects(new Rectangle(0, 11, 3, 3))).toBeFalsy();
    expect(r.intersects(new Rectangle(11, 11, 3, 3))).toBeFalsy();

    // Sides
    expect(r.intersects(new Rectangle(0, 0, 3, 100))).toBeFalsy();
    expect(r.intersects(new Rectangle(0, 0, 100, 3))).toBeFalsy();
    expect(r.intersects(new Rectangle(11, 0, 3, 100))).toBeFalsy();
    expect(r.intersects(new Rectangle(0, 11, 100, 3))).toBeFalsy();
  });

  it('detects true containment', () => {
    const r = new Rectangle(3, 3, 8, 8);

    expect(r.contains(3, 3)).toBeTruthy();
    expect(r.contains(10, 3)).toBeTruthy();
    expect(r.contains(3, 10)).toBeTruthy();
    expect(r.contains(10, 10)).toBeTruthy();
  });

  it('doesn\'t detect non-containment', () => {
    const r = new Rectangle(3, 3, 8, 8);

    expect(r.contains(2, 3)).toBeFalsy();
    expect(r.contains(11, 3)).toBeFalsy();
    expect(r.contains(3, 2)).toBeFalsy();
    expect(r.contains(3, 11)).toBeFalsy();
  });

  it('compares rectangles', () => {
    const r1 = new Rectangle(3, 3, 8, 8);
    const r2 = new Rectangle(1, 2, 3, 5);

    expect(r1.equals(r1)).toBeTruthy();
    expect(r1.equals(r2)).toBeFalsy();
  });
});
