import defaultsDeep from 'lodash.defaultsdeep'
import { ReactiveObject } from '../utils'

// TODO: Add state checks for invalid state modes
// TODO: Add methods to validate new state value

const defaultState = {
    
    isIdle: true,
    isRolling: false,
    isFR: false,
    isMenu: false,
    isTransition: false,

    mode: 'root',
    next: 'root',

    // Main buttons mode in desktop 
    button: 'spin',
    autoplay: null,

    settings: {
        isFullscreen: false,
        isFast: false,
        isSound: true,
        isMusic: true,
        isEffects: true
    }
}

class StateManager {

    constructor(state) {
        new ReactiveObject({
            context: this,
            object: defaultsDeep(state, defaultState)
        })
    }

}

export { StateManager }