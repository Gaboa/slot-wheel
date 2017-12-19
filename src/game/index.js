import defaultsDeep from 'lodash.defaultsdeep'
import { Application } from 'pixi.js'

import { DeviceManager } from './device'
export { StateManager } from './state'
export { DataManager } from './data'
export { RequestManager } from './request'
export { AudioManager } from './audio'
export { ParserManager } from './parser'

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
        const dev = new DeviceManager({ mode: 'none' })
        super({
            width:  width  || window.GAME_WIDTH,
            height: height || window.GAME_HEIGHT,
            autoStart: false
        })
        document.querySelector(id).appendChild(this.view)
        this.setFPS(fps)
        
        this.device = new DeviceManager(defaultsDeep({ id, renderer: this.renderer }, device))
    }

    setFPS(fps) {
        this.fps = fps
        this.frameCount = this.frameCount || 0
        this.animate(performance.now())
    }

    animate(time) {
        if (++this.frameCount >= Math.ceil(60 / this.fps)) {
            this.ticker.update(time)
            this.frameCount = 0
        }
        requestAnimationFrame(this.animate.bind(this))
    }

}

export { Game }