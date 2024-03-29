export enum Severity {
    Primary = 'primary',
    Secondary = 'secondary',
    Success = 'success',
    Warning = 'warning',
    Danger = 'danger',
    Help = 'help',
    Info = 'info',
}

export enum TileType {
    Empty = 'EMPTY', // nothing.
    Label = 'LABEL', // A text span
    Button = 'BUTTON', // A button with optional label and icon
    Toggle = 'TOGGLE', // A toggle button with the added state for pressed or not.
    SplitToggle = 'SPLITTOGGLE', // A toggle that cycles through unclicked, top, bottom.
}

/**
  An individual tile in the UI.
* */
export interface Tile {
    readonly type: TileType
    /** Optional style on the element. */
    readonly classes?: string[]

    /** If tile is multiple tiles wide. Default is 1. */
    readonly width?: number
    /** If tile is multiple tiles tall. Default is 1. */
    readonly height?: number

    /** Button / label severity */
    readonly severity?: Severity
}

export interface LabelTile extends Tile {
    readonly type: TileType.Label
    readonly label: string
}

interface ButtonPress {
    (tile: Tile): void
}

interface ButtonBaseTile extends Tile {
    // Both labels and icons are optional, and can be used together.
    readonly label?: string
    readonly icon?: string
    /** Price shown in a badge if Show Prices is enabled by user. */
    readonly price?: number
    readonly onPress: ButtonPress
}

export interface ButtonTile extends ButtonBaseTile {
    readonly type: TileType.Button
}

export interface ToggleTile extends ButtonBaseTile {
    readonly type: TileType.Toggle
    /** true means toggled on */
    readonly state: boolean
}

export enum SplitToggleState {
    Untoggled = 'neither',
    Top = 'top',
    Bottom = 'bottom',
}

export interface SplitToggleTile extends Tile {
    readonly type: TileType.SplitToggle
    readonly state: SplitToggleState
    readonly topLabel: string
    readonly bottomLabel: string
    readonly topPrice?: number
    readonly bottomPrice?: number
    readonly onPress: ButtonPress
}

export function newLabel(label: string): LabelTile {
    return {
        type: TileType.Label,
        label,
    }
}

export function newButton(onPress: ButtonPress, label?: string, icon?: string): ButtonTile {
    return {
        type: TileType.Button,
        label,
        icon,
        onPress,
    }
}

export function newToggle(state: boolean, onPress: ButtonPress, label?: string, icon?: string): ToggleTile {
    return {
        type: TileType.Toggle,
        label,
        icon,
        onPress,
        state,
    }
}

export function newSplitToggle(state: SplitToggleState, onPress: ButtonPress, topLabel: string, bottomLabel: string): SplitToggleTile {
    return {
        type: TileType.SplitToggle,
        topLabel,
        bottomLabel,
        onPress,
        state,
    }
}

export function isLabel(t: Tile): t is LabelTile {
    return t.type === TileType.Label
}

export function isButton(t: Tile): t is ButtonTile {
    return t.type === TileType.Button
}

export function isToggle(t: Tile): t is ToggleTile {
    return t.type === TileType.Toggle
}

export function isSplitToggle(t: Tile): t is SplitToggleTile {
    return t.type === TileType.SplitToggle
}

export const emptyTile: Tile = {
    type: TileType.Empty,
}

/**
  Change the severity of a tile
  @param {Tile} tile The tile to change the class of.
  @param {Severity} severity The classes to add.
* */
export function withSeverity(tile: Tile, severity: Severity): Tile {
    return { ...tile, severity }
}
