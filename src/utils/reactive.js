import { BehaviorSubject } from 'rxjs'

// TODO: Add some methods to work with arrays

class ReactiveProperty {
    constructor({
        context,
        prop,
        value
    }) {
        Object.defineProperty(context, `_${prop}`, {
            value,
            enumerable: false,
            writable: true
        })
        Object.defineProperty(context, prop, {
            set(v) {
                context[`_${prop}`] = v
                context[`${prop}$`].next(v)
            },
            get() {
                return context[`_${prop}`]
            },
            enumerable: true
        })
        Object.defineProperty(context, `${prop}$`, {
            value: new BehaviorSubject()
        })
        context[`${prop}$`].next(value)
    }
}

class ReactiveObject {
    constructor({
        context,
        object
    }) {
        for (const prop in object) {
            if (object.hasOwnProperty(prop)) {
                const value = object[prop]
                if (typeof value === 'object' && value !== null && !Array.isArray(value))
                    new ReactiveObject({ context: context[prop] = {}, object: value })
                else
                    new ReactiveProperty({ context, prop, value })
            }
        }
    }
}

export { ReactiveObject, ReactiveProperty }