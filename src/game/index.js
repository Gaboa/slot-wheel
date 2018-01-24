import defaultsDeep    from 'lodash.defaultsdeep'
import { Application } from 'pixi.js'
import { TweenMax }    from 'gsap'

import { DeviceManager }  from './device'
import { RequestManager } from './request'
import { ParserManager }  from './parser'
import { AudioManager }   from './audio'
import { StateManager }   from './state'
import { DataManager }    from './data'

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
        this.ParserManager  = parser.Manager  || ParserManager
        this.AudioManager   = audio.Manager   || AudioManager

        this.audio   = new AudioManager(defaultsDeep({}, audio))
        this.device  = new DeviceManager(defaultsDeep({ view: this.view, renderer: this.renderer }, device))
        this.request = new RequestManager(defaultsDeep({}, request))
        this.state   = new StateManager(defaultsDeep({}, state))
        this.data    = new DataManager(defaultsDeep({}, data))
        this.parser  = new ParserManager(defaultsDeep({ game: this }, parser))

        this.getSearchParams()
    }

    getSearchParams() {
        this.searchString = window.location.href.split('?').slice(1).join()
        this.search = new URLSearchParams(this.searchString)

        this.state.lang = this.search.get('lang') || null
        this.state.home = this.search.get('homeURL') || this.search.get('home') || null
        this.state.settings.isLowQuality = JSON.parse(this.search.get('low'))
    }

    start(fps) {
        this.fps = fps

        TweenMax.ticker.fps(fps)
        TweenMax.ticker.addEventListener('tick', this.animate, this)
    }
    
    animate(time) {
        this.ticker.update(time)
    }
    
    pause() {
        // TODO: Check working of sleep method
        TweenMax.ticker.sleep()
    }
    
    resume() {
        TweenMax.ticker.wake()
    }

}

export { Game }
export { DeviceManager }  from './device'
export { StateManager }   from './state'
export { DataManager }    from './data'
export { RequestManager } from './request'
export { AudioManager }   from './audio'
export { ParserManager }  from './parser'