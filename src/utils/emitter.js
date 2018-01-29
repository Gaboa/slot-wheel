import {Container} from './container'
import {Sprite} from './sprite'
import * as ParticleEmitter from 'pixi-particles'
import defaultsDeep from 'lodash.defaultsdeep'

export class Emitter{
    constructor(config){
        this.emitterContainer = new Container(config)
        this.textures = config.textures
        this.config =  defaultsDeep({spawnRect:{x: -GAME_WIDTH * 0.5, y: -GAME_HEIGHT  * 0.6, w: GAME_WIDTH, h:0}}, config.data)
        this.emitter = new ParticleEmitter.Emitter(
            this.emitterContainer,
            this.textures,
            this.config
        )

        this.emitter.autoUpdate = false
        this.currentTime = Date.now()
        TweenMax.ticker.addEventListener('tick', this.update, this)

    }
    update(){
        let now = Date.now()

        if(this.emitter){
            this.emitter.update((now - this.currentTime) * 0.001)
            this.currentTime = now
        }
    }

    destroy(){
        this.emitter.destroy()
        //this.emitter = null
    }
}