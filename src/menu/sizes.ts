enum Sizes {
  HappyMeal = 'HM',
  XSmall = 'XS',
  Small = 'Sm',
  Medium = 'Med',
  Large = 'Lg',
  Senior = 'Sr',
}

export const baseSizes: Sizes[] = [
  Sizes.XSmall,
  Sizes.Small,
  Sizes.Medium,
  Sizes.Large,
];

export const baseSizesAndHM: Sizes[] = [
  ...baseSizes,
  Sizes.HappyMeal,
];

export const baseSizesAndSr: Sizes[] = [
  ...baseSizes,
  Sizes.Senior,
];

export const baseSizesAndHMAndSr: Sizes[] = [
  ...baseSizes,
  Sizes.HappyMeal,
  Sizes.Senior,
];

export default Sizes;
