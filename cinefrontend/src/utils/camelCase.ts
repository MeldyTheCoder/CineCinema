
export function camelize(str: string) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

export function objectToCamelCase<T extends any = any>(object: Object): T {
    if (typeof object !== 'object' || !object) {
        return object;
    }

    return Object.fromEntries(
        Object.entries(object).map(([key, value]): any => {
            if (Array.isArray(value)) {
                return [camelize(key), camelArray(value)]
            }
            if (typeof value === "object") {
                return [camelize(key), objectToCamelCase(value)]
            }

            return [camelize(key), value]
        })
    ) as T;
}

export function camelArray<T extends any[] = any[]>(array: any[]): T {
    if (!array) {
        return array;
    }
    return array.map((element) => objectToCamelCase(element)) as T;
}