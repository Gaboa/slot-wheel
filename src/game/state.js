import defaultsDeep from 'lodash.defaultsdeep'
import { ReactiveObject } from '../utils'

// TODO: Add state checks for invalid state modes
// TODO: Add methods to validate new state value

const defaultState = {
    
    isIdle: true,
    isRolling: false,
    isAutoplay: false,
    isFR: false,
    isTransition: false,
    
    menu: null,
    mode: 'root',
    next: 'root',

    // Main buttons mode in desktop 
    button: 'spin',
    error: null,
    lang: null,
    home: null,

    settings: {
        isFullscreen: false,
        isFast: false,
        isRightSide: true,
        isLowQuality: false,
        isSound: true,
        isMusic: true,
        isEffects: true,
        activeMode: 'fullhd',
        bonusStopsAutoPlay: true,
        stopIfCashLess: false,
        stopIfCashGreater: false,
        volume: 30
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