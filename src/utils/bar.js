import { Sprite } from './sprite'
import { Graphics } from './graphics'
import { TweenMax } from 'gsap'

class Bar extends Sprite {

    constructor({
        container,
        texture,
        name,
        x,
        y
    }) {
        super({ container, texture, name, x, y })
        this.addMask()
    }

    addMask() {
        this.mask = new Graphics({ container: this.container, x: this.x, y: this.y })

        this.mask.beginFill(0xFFFFFF, 1)
        this.mask.drawRect(-this.width / 2, -this.height / 2, 0, this.height)
        this.mask.endFill()
    }

    progress(value) {
        this.mask.clear()
        this.mask.drawRect(-this.width / 2, -this.height / 2, this.width * value / 100, this.height)
    }

    hide() {
        this.container.removeChild(this.mask)
        TweenMax.to(this.scale, 0.3, { x: 0, y: 0 })
        TweenMax.to(this, 0.3, { alpha: 0 })
    }

}

export { Bar }