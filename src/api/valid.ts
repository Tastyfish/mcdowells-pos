export const VALID_STRING = ''
export const VALID_NUMBER = 0
export const VALID_BOOLEAN = false
export const VALID_NULL = null

function matchesArrayType(value: unknown, propTypes: any[]): boolean {
    return typeof value === 'object' && value instanceof Array && value.every((value) => propTypes.some((type) => matchesType(value, type)))
}

function matchesDictionaryType(value: unknown, propTypes: any[]): boolean {
    return typeof value !== 'object' || Object.values(value as {}).every((value) => propTypes.some((type) => matchesType(value, type)))
}

function matchesType(value: unknown, propType: any): boolean {
    return propType === null
        ? value == null
        : propType instanceof Array
        ? matchesArrayType(value, propType)
        : typeof propType === 'object'
        ? matchesDictionaryType(value, Object.values(propType))
        : typeof value === typeof propType
}

export function validateRequired<OT extends { [prop in KT]?: PT }, KT extends keyof OT, PT>(
    objectLabel: string,
    object: OT,
    propKey: KT,
    propType: PT
): object is { [prop in KT]: PT } & OT {
    if (!(propKey in object) || !matchesType(object[propKey], propType)) {
        console.error(`${objectLabel} missing or malformed required ${String(propKey)} in`, object)
        return false
    }

    return true
}

export function validateOptional<OT extends { [prop in KT]?: PT }, KT extends keyof OT, PT>(
    objectLabel: string,
    object: OT,
    propKey: KT,
    propType: PT
): object is { [prop in KT]?: PT } & OT {
    if (propKey in object && !matchesType(object[propKey], propType)) {
        console.error(`Malformed optional ${String(propKey)} in ${objectLabel}:`, object[propKey], 'in', object)
        return false
    }

    return true
}
