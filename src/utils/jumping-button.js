import { Sprite } from './sprite'
import { TweenMax } from 'gsap'
import { Observable } from 'rxjs/Observable'

class JumpingButton extends Sprite {

    constructor({
        container,
        texture,
        name,
        x,
        y,
        tweenY,
        startScale = 0.85,
        endScale = 1.15
    }) {
        super({ container, texture, name, x, y })

        this.startScale = startScale
        this.endScale = endScale
        this.tweenY = tweenY

        this.tween = TweenMax.fromTo(this.scale, 1, {
            x: this.startScale,
            y: this.startScale
        }, {
            x: this.endScale,
            y: this.endScale,
            repeat: -1,
            yoyo: true
        })

        this.interactive = true
        this.buttonMode = true

        this.$ = Observable.fromEvent(this, 'pointerdown')
    }

    show() {
        TweenMax.to(this, 0.4, { y: this.tweenY * GAME_HEIGHT, ease: Elastic.easeOut })
    }

}

export { JumpingButton }