import defaultsDeep from 'lodash.defaultsdeep'
import { ReactiveObject } from '../utils'

// TODO: Add state checks for invalid state modes
// TODO: Add methods to validate new state value

const defaultState = {
    
    isIdle: true,
    isRolling: false,
    isAutoplay: false,
    isFR: false,
    isMenu: false,
    isTransition: false,
    isInfoOpened: false,
    isSettingsOpened: false,

    mode: 'root',
    next: 'root',

    // Main buttons mode in desktop 
    button: 'spin',
    error: null,

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
        stopIfCashLess: true,
        stopIfCashGreater: true,
        volume: 50
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