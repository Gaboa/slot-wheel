import defaultsDeep from 'lodash.defaultsdeep'
import { ReactiveObject } from '../utils'

// TODO: Set init config for state
// TODO: Add state checks for invalid state modes
// TODO: Add methods to add and remove state fields
// TODO: Add methods to validate new state value 

const defaultState = {
    isIdle: true,
    isRolling: false,
    isFR: false,
    isAutoplay: false,
    isMenu: false,
    isTransition: false
}

class StateManager {

    constructor({
        state
    }) {
        new ReactiveObject({
            context: this,
            object: defaultsDeep(state, defaultState)
        })
    }

}

export { StateManager }