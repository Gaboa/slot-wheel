import { Container, Sprite } from '../utils'
import { Graphics, Text } from 'pixi.js'

const colors = [0xff00ff, 0x00ffff, 0xffff00, 0x444444, 0x0000ff]

class Element extends Container {
    constructor({
        container,
        x = 0,
        y = 0,

        width,
        height,
        index,
        anim
    }) {
        super({ container, x, y })

        this.w = width
        this.h = height
        this.anim = anim
        this.index = index
        this.color = colors[index % 5]

        this.pivot.set(this.w * 0.5, this.h * 0.5)

        this.addBG()
        this.addText()
    }

    addBG() {
        this.g = new Graphics()
        this.g.beginFill(this.color)
        this.g.drawRect(0, 0, this.w, this.h)
        this.g.endFill()
        this.g.cacheAsBitmap = true
        this.addChild(this.g)
    }

    addText() {
        this.t = new Text(this.anim, { align: 'center', fill: '#555' })
        this.t.x = this.w * 0.5
        this.t.y = this.h * 0.5
        this.t.anchor.set(0.5)
        this.addChild(this.t)
    }

    changeValue(newValue) {
        this.value  = newValue
        this.t.text = newValue
    }

    play(value) {
        this.changeValue(value)
    }
}



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
        this.anim = anim
        this.index = index
        this.anchor.set(0.5)

        if (anim)
            this.play(this.anim)
    }
    play(anim) {
        this.texture = PIXI.utils.TextureCache[`${anim.type}_${anim.el}`]
    }
}

export { Element, SpriteElement }