import { Subject } from 'rxjs/Subject';
import { Container, Sprite } from '../utils'

class SpriteElement extends Sprite {
    constructor({
        container,
        x = 0,
        y = 0,

        width,
        height,
        index,
        anim
    }) {
        super({ container, x, y, texture: 'static_j' })
        this.w = width
        this.h = height

        this.index = index
        this.anchor.set(0.5)

        if (anim)
            this.play(this.anim)
        
        this.enableStreams()
    }
    enableStreams() {
        this.$ = new Subject()
        this.subs = []
    }
    disableStreams() {
        this.subs.forEach(sub => sub.unsubscribe())
    }
    play(anim) {
        this.anim = anim
        this.texture = PIXI.utils.TextureCache[`${anim.type}_${anim.el}`]
        this.$.next({ from: 'EL', state: 'play', anim, el: this })
    }
    show() {
        this.visible = true
        this.$.next({ from: 'EL', state: 'show', el: this })
    }
    hide() {
        this.visible = false
        this.$.next({ from: 'EL', state: 'hide', el: this })
    }
}

export { SpriteElement }