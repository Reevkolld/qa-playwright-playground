export const users = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce',
  },
} as const satisfies Record<
  'standard' | 'lockedOut' | 'problem',
  { username: string; password: string }
>;

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  redTShirt: 'Test.allTheThings() T-Shirt (Red)',
} as const satisfies Record<'backpack' | 'bikeLight' | 'redTShirt', string>;

export type CheckoutDetails = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

const defaultCheckoutDetails = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '12345',
} as const satisfies CheckoutDetails;

export function checkoutDetails(overrides: Partial<CheckoutDetails> = {}): CheckoutDetails {
  return { ...defaultCheckoutDetails, ...overrides };
}
