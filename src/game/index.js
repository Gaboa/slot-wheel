import defaultsDeep from 'lodash.defaultsdeep'
import { Application } from 'pixi.js'
import { TweenMax } from 'gsap'

import { DeviceManager } from './device'
import { RequestManager } from './request'
import { StateManager } from './state'
import { DataManager } from './data'

class Game extends Application {

    constructor({
        
        id,
        fps = 30,
        width,
        height,

        request = {},
        parser = {},
        device = {},
        audio = {},
        state = {},
        data = {}

    }) {
        const dev = new DeviceManager(device)
        
        super({
            width:  width  || GAME_WIDTH,
            height: height || GAME_HEIGHT,
            autoStart: false
        })
        document.querySelector(id).appendChild(this.view)
        
        this.start(fps)
        
        this.DeviceManager  = device.Manager  || DeviceManager
        this.RequestManager = request.Manager || RequestManager
        this.StateManager   = state.Manager   || StateManager
        this.DataManager    = data.Manager    || DataManager

        // Parser
        // Audio

        this.device = new DeviceManager(defaultsDeep({ view: this.view, renderer: this.renderer }, device))
        this.request = new RequestManager(defaultsDeep({}, request))
        this.state = new StateManager(defaultsDeep({}, state))
        this.data = new DataManager(defaultsDeep({}, data))
    }

    start(fps) {
        this.fps = fps || this.fps
        this.frameCount = this.frameCount || 0

        this.ticker.start()
        TweenMax.resumeAll(true)

        this.animate(performance.now())
    }

    animate(time) {
        if (++this.frameCount >= Math.ceil(60 / this.fps)) {
            this.ticker.update(time)
            this.frameCount = 0
        }
        this.rafID = requestAnimationFrame(this.animate.bind(this))
    }

    stop() {
        this.ticker.stop()
        TweenMax.pauseAll(true)
        cancelAnimationFrame(this.rafID)
    }

}

export { Game }
export { DeviceManager } from './device'
export { StateManager } from './state'
export { DataManager } from './data'
export { RequestManager } from './request'
export { AudioManager } from './audio'
export { ParserManager } from './parser'