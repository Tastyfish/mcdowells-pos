/**
  A line in the customer's order
* */
export interface OrderLine {
  /** Internal name for comparison and choice matching * */
  readonly internalName: string
  /** Mutable name shown to cashier based on choices * */
  readonly displayName: () => string
  /** Unique ID of this line within order * */
  readonly id: number
}

export interface OrderChoice {
  /** Line this is for. * */
  readonly id: number,
  /**  * */
}
