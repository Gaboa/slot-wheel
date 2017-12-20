import defaultsDeep from 'lodash.defaultsdeep'
import { ReactiveObject } from '../utils'

// TODO: Set init config for data
// TODO: Add method to handle init data
// TODO: Add method to handle roll data
// TODO: Add method to handle save and storage data
// TODO: Add methods for validation new data value
// TODO: Add methods to add and remove data fields

const defaultData = {
    sid: null,
    screen: null,
    balance: {
        currency: '$',
        level: 1,
        value: 1,
        coin: {
            sum: null,
            bet: null,
            win: null
        },
        cash: {
            sum: null,
            bet: null,
            win: null
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