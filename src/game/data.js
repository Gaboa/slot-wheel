import defaultsDeep from 'lodash.defaultsdeep'
import { ReactiveObject } from '../utils'

// TODO: Add methods for validation new data value

const defaultData = {

    sid: null,
    mode: '',
    next: '',
    lines: null,
    symbols: null,
    screen: null,

    win: {
        lines: [],
        line: null
    },

    autoplay: {
        start: null,
        count: null,
        increase: null,
        decrease: null
    },

    fs: {
        count: {
            current: null,
            win: null
        },
        win: {
            coin: null,
            cash: null
        },
        bonus: {
            coin: null,
            cash: null
        },
        multi: null,
        level: null
    },

    fr: {
        count: null,
        win: {
            coin: null,
            cash: null
        }
    },

    balance: {
        currency: '$',
        level: {
            current: 1,
            index: 0,
            arr: null,
            min: true,
            max: false
        },
        value: {
            current: 1,
            index: 0,
            arr: null,
            min: true,
            max: false
        },
        coin: {
            sum: null,
            bet: null,
            win: null
        },
        cash: {
            sum: null,
            bet: null,
            win: null,
        }
    }
}

class DataManager {

    constructor(data) {
        new ReactiveObject({
            context: this,
            object: defaultsDeep(data, defaultData)
        })
    }

}

export { DataManager }