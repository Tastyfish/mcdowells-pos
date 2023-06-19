const primitiveMap = {
    string: '',
    number: 0,
    boolean: false,
}

type PrimitiveNames = keyof typeof primitiveMap

export function validateRequired<OT extends { [prop in KT]?: (typeof primitiveMap)[PT] }, KT extends keyof OT, PT extends PrimitiveNames>(
    objectLabel: string,
    object: OT,
    propKey: KT,
    propType: PT
): object is { [prop in KT]: (typeof primitiveMap)[PT] } & OT {
    if (!(propKey in object) || typeof object[propKey] !== propType) {
        console.error(`${objectLabel} missing required ${String(propKey)} in`, object)
        return false
    }

    return true
}

export function validateOptional<OT extends { [prop in KT]?: (typeof primitiveMap)[PT] }, KT extends keyof OT, PT extends PrimitiveNames>(
    objectLabel: string,
    object: OT,
    propKey: KT,
    propType: PT
): object is { [prop in KT]?: (typeof primitiveMap)[PT] } & OT {
    if (propKey in object && typeof object[propKey] !== propType) {
        console.error(`Illegal optional ${String(propKey)} in ${objectLabel}:`, object[propKey], 'in', object)
        return false
    }

    return true
}
