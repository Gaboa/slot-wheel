//{type: 'start', name: 'bird', source: this}
//{type: 'stop', name: 'bird', source: this}
//{type: 'update', name: 'bird', source: this, frame: 25}
//{type: 'complete', name: 'bird', source: this}
//{type: 'loop', name: 'bird', source: this}
import { Subject } from 'rxjs'
import ToolBox from './toolBox'

class SpriteAnimation extends PIXI.extras.AnimatedSprite {
    constructor({
        container,
        name,
        frames,
        x = 0,
        y = 0,
        anchor = 0.5,
        scale = 1,
        visible = true,
        speed = 1,
        loop = false,
        autoEnable = true,
        autoPlay = true
    }) {
        super(ToolBox.getTextures(name, frames))

        this.container = container
        ToolBox.combineContainers(container, this, index)
        this.x = ToolBox.getX(x)
        this.y = ToolBox.getY(y)

        // Set params
        this.anchor.set(anchor)
        this.scale.set(scale)
        this.animationSpeed = speed
        this.loop = loop
        this.visible = visible
        this.name = name
 
        if (autoEnable)
            this.enable()

        if (autoPlay)
            this.play()

    }

    enable() {
        this.$ = new Subject()
        this.onLoop = () => this.$.next({ type: 'loop', name: this.name, source: this })
        this.onComplete = () => this.$.next({ type: 'complete', name: this.name, source: this })
        this.onFrameChange = frame => this.$.next({ type: 'update', name: this.name, source: this, frame: frame })
    }

    disable() {
        this.$.complete()
        this.onLoop = () => {}
        this.onComplete = () => {}
        this.onFrameChange = () => {}
    }

    start() {
        this.$.next({type: 'start', source: this, name: this.name})
        if (this.loop) super.play()
        else this.gotoAndPlay(0)
    }

    stop() {
        super.stop()
        this.$.next({type: 'stop', name: this.name, source: this})
    }
}

export { SpriteAnimation }