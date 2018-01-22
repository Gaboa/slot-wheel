import { Sprite } from './sprite'
import { TweenMax } from 'gsap'

class Light extends Sprite {

    constructor({
        container,
        texture,
        name,
        x,
        y,
        alpha
    }) {
        super({ container, texture, name, x, y })

        this.blendMode = PIXI.BLEND_MODES.ADD
        this.alpha = alpha

        this.tween = TweenMax.to(this, 25, {
            rotation: 2 * Math.PI,
            repeat: -1,
            ease: Linear.easeNone
        })
    }

}

export { Light }