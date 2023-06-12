/**
  A simple class for rectangle math.
* */
export default class Rectangle {
    readonly x: number

    readonly y: number

    readonly width: number

    readonly height: number

    constructor(x: number, y: number, width: number, height: number) {
        if (width < 1 || height < 1) {
            throw new RangeError('Invalid size.')
        }

        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    /**
    Right side, exlusive.
  * */
    get right(): number {
        return this.x + this.width
    }

    /**
    Bottom side, exlusive.
  * */
    get bottom(): number {
        return this.y + this.height
    }

    /**
    Checks if another rectangle intersects us.
    @param {Rectangle} other The other rectange to compare.
    @return {boolean} True if they intersect.
  * */
    intersects(other: Rectangle): boolean {
        return this.x < other.right && this.right > other.x && this.y < other.bottom && this.bottom > other.y
    }

    /**
    If contains given point
    @param {number} x X coord of the point to test.
    @param {number} y Y coord of the point to test.
    @return {boolean} True if coord is contained.
  * */
    contains(x: number, y: number): boolean {
        return this.x <= x && this.right > x && this.y <= y && this.bottom > y
    }

    equals(other: Rectangle): boolean {
        return this.x === other.x && this.y === other.y && this.width === other.width && this.height === other.height
    }
}
