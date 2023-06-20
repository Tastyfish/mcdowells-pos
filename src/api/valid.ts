const primitiveMap = {
    string: '',
    number: 0,
    boolean: false,
    null: null,
}

type PrimitiveNames = keyof typeof primitiveMap

function matchesType<T extends PrimitiveNames>(value: unknown, propType: T) {
    return propType === 'null' ? value == null : typeof value === propType
}

export function validateRequired<OT extends { [prop in KT]?: (typeof primitiveMap)[PT] }, KT extends keyof OT, PT extends PrimitiveNames>(
    objectLabel: string,
    object: OT,
    propKey: KT,
    propType: PT
): object is { [prop in KT]: (typeof primitiveMap)[PT] } & OT {
    if (!(propKey in object) || !matchesType(object[propKey], propType)) {
        console.error(`${objectLabel} missing or malformed required ${String(propKey)} in`, object)
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
    if (propKey in object && !matchesType(object[propKey], propType)) {
        console.error(`Malformed optional ${String(propKey)} in ${objectLabel}:`, object[propKey], 'in', object)
        return false
    }

    return true
}

export function validateRequiredArray<OT extends { [prop in KT]?: (typeof primitiveMap)[PT][] }, KT extends keyof OT, PT extends PrimitiveNames>(
    objectLabel: string,
    object: OT,
    propKey: KT,
    propType: PT
): object is { [prop in KT]: (typeof primitiveMap)[PT][] } & OT {
    if (
        !(propKey in object) ||
        typeof object[propKey] !== 'object' ||
        !((object[propKey] as object) instanceof Array) ||
        object[propKey]?.some((value) => !matchesType(value, propType))
    ) {
        console.error(`${objectLabel} missing or malformed required array ${String(propKey)} in`, object)
        return false
    }

    return true
}

export function validateOptionalArray<OT extends { [prop in KT]?: (typeof primitiveMap)[PT][] }, KT extends keyof OT, PT extends PrimitiveNames>(
    objectLabel: string,
    object: OT,
    propKey: KT,
    propType: PT
): object is { [prop in KT]: (typeof primitiveMap)[PT][] } & OT {
    if (
        propKey in object &&
        (typeof object[propKey] !== 'object' ||
            !((object[propKey] as object) instanceof Array) ||
            object[propKey]?.some((value) => !matchesType(value, propType)))
    ) {
        console.error(`Malformed optional array ${String(propKey)} in ${objectLabel}:`, object[propKey], 'in', object)
        return false
    }

    return true
}

export function validateRequiredDictionary<
    OT extends { [prop in KT]?: Record<string, (typeof primitiveMap)[PT]> },
    KT extends keyof OT,
    PT extends PrimitiveNames
>(objectLabel: string, object: OT, propKey: KT, propTypes: PT[]): object is { [prop in KT]: Record<string, (typeof primitiveMap)[PT]> } & OT {
    if (
        !(propKey in object) ||
        typeof object[propKey] !== 'object' ||
        Object.values(object[propKey] as {}).some((value) => !propTypes.some((type) => matchesType(value, type)))
    ) {
        console.error(`${objectLabel} missing or malformed required dictionary ${String(propKey)} in`, object)
        return false
    }

    return true
}

export function validateOptionalDictionary<
    OT extends { [prop in KT]?: Record<string, (typeof primitiveMap)[PT]> },
    KT extends keyof OT,
    PT extends PrimitiveNames
>(objectLabel: string, object: OT, propKey: KT, propTypes: PT[]): object is { [prop in KT]: Record<string, (typeof primitiveMap)[PT]> } & OT {
    if (
        propKey in object &&
        (typeof object[propKey] !== 'object' ||
            Object.values(object[propKey] as {}).some((value) => !propTypes.some((type) => matchesType(value, type))))
    ) {
        console.error(`Malformed optional dictionary ${String(propKey)} in ${objectLabel}:`, object[propKey], 'in', object)
        return false
    }

    return true
}
