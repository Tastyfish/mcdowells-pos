import { MenuItem, ChoiceItem } from '@/api/menu'

// Default offset. Also used for stand-alone drinks and sides to counter the built-in discount.
const COMBO_BASE_MOD = 1.08

export const menu: MenuItem[] = [
    {
        id: 'bigmac',
        displayName: 'Big Mac',
        choiceSlots: {
            grill: null,
            side: 'fries',
            drink: null,
        },
        allowedSizes: 'all',
        price: 3.99,
    },
    {
        id: '2cheeseburgers',
        displayName: '2 Cheeseburgers',
        choiceSlots: {
            grill: null,
            side: 'fries',
            drink: null,
        },
        allowedSizes: 'all',
        price: 2.0,
    },
    {
        id: 'quarterpounder',
        displayName: '¼ Pounder w/ Cheese',
        choiceSlots: {
            grill: null,
            side: 'fries',
            drink: null,
        },
        allowedSizes: 'all',
        price: 3.79,
    },
    {
        id: 'DBLquarterpounder',
        displayName: 'Double ¼ Pounder w/ Cheese',
        choiceSlots: {
            grill: null,
            side: 'fries',
            drink: null,
        },
        allowedSizes: 'all',
        price: 4.79,
    },
    {
        id: 'BCNclubhouseburger',
        displayName: 'Bacon Clubhouse Burger',
        choiceSlots: {
            grill: null,
            side: 'fries',
            drink: null,
        },
        allowedSizes: 'all',
        price: 4.49,
    },
    {
        id: 'nuggets10',
        displayName: '10pc Nuggets',
        choiceSlots: {
            sauce: null,
            side: 'fries',
            drink: null,
        },
        allowedSizes: 'all',
        price: 4.19, // sauce discounted.
    },

    {
        id: 'drink',
        displayName: 'Drink',
        choiceSlots: { drink: null },
        allowedSizes: 'allNoHM',
        price: COMBO_BASE_MOD,
    },
    {
        id: 'side',
        displayName: 'Side',
        choiceSlots: { side: null },
        allowedSizes: 'allNoHM',
        price: COMBO_BASE_MOD,
    },
    {
        id: 'sauce',
        displayName: 'Condiment',
        simpleDisplayName: true,
        choiceSlots: { sauce: null },
        price: 0.0, // Since this doesn't have sizes, we don't have to do weird incantations.
    },

    {
        id: 'gift05',
        displayName: '$5 Gift Card',
        simpleDisplayName: true,
        choiceSlots: {},
        price: 5.0,
    },
    {
        id: 'gift10',
        displayName: '$10 Gift Card',
        simpleDisplayName: true,
        choiceSlots: {},
        price: 10.0,
    },
    {
        id: 'gift25',
        displayName: '$25 Gift Card',
        simpleDisplayName: true,
        choiceSlots: {},
        price: 25.0,
    },
    {
        id: 'giftV',
        displayName: '??? Gift Card',
        simpleDisplayName: true,
        choiceSlots: {},
        price: 1.0,
    },
    {
        id: 'discountV', // Label and price is filled in by a numpad callback.
        displayName: '** ??? Discount **',
        simpleDisplayName: true,
        choiceSlots: {},
        price: -1.0,
    },
]

export const choices: ChoiceItem[] = [
    {
        id: 'coke',
        displayName: 'Coca-Cola',
        slot: 'drink',
    },
    {
        id: 'dietcoke',
        displayName: 'Diet Coke',
        slot: 'drink',
    },
    {
        id: 'sprite',
        displayName: 'Sprite',
        slot: 'drink',
    },
    {
        id: 'fantaorange',
        displayName: 'Fanta Orange',
        slot: 'drink',
    },
    {
        id: 'icedtea',
        displayName: 'Iced Tea',
        slot: 'drink',
    },
    {
        id: 'sweettea',
        displayName: 'Sweet Tea',
        slot: 'drink',
    },
    {
        id: 'coffee',
        displayName: 'Coffee',
        slot: 'drink',
    },

    {
        id: 'fries',
        displayName: 'Fries',
        slot: 'side',
    },
    {
        id: 'apples',
        displayName: 'Apple Slices',
        slot: 'side',
        price: 1.0,
    },

    {
        id: 'no_sauce',
        displayName: 'No Sauce',
        simpleDisplayName: true,
        slot: 'sauce',
        price: 0.0,
    },
    {
        id: 'ketchup',
        displayName: 'Ketchup',
        simpleDisplayName: true,
        slot: 'sauce',
    },
    {
        id: 'honey_mustard',
        displayName: 'Honey Mustard',
        simpleDisplayName: true,
        slot: 'sauce',
    },
    {
        id: 'bbq',
        displayName: 'BBQ Sauce',
        simpleDisplayName: true,
        slot: 'sauce',
    },
]

export function getMenuItem(id: string): MenuItem | undefined {
    return menu.find((item) => item.id === id)
}

export function getChoiceItem(id: string): ChoiceItem | undefined {
    return choices.find((item) => item.id === id)
}

export function getChoicesBySlot(slotID: string): ChoiceItem[] {
    return choices.filter((item) => item.slot === slotID)
}
