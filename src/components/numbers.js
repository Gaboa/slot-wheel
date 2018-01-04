import defaultsDeep from 'lodash.defaultsdeep'
import { Subject, Observable } from "rxjs"
import { Container, Sprite, Spine } from "../utils"

class WinNumber extends Container {

    constructor({
        container,
        x,
        y,
        value,
        size
    }) {
        super({ container, x, y })

        this.name = value

        this.sprite = new Sprite({
            container: this,
            texture: `${value}_off`
        })

        this.spine = new Spine({
            container: this,
            name: 'splash'
        })

        if (size)
            this.hitArea = new PIXI.Circle(0, 0, size * 0.5)
    }

    enable() {
        this.interactive = true
        this.buttonMode = true

        this.over$ = Observable.fromEvent(this, 'pointerover').map(e => ({ type: 'OVER', num: this.name }))
        this.out$ = Observable.fromEvent(this, 'pointerout').map(e => ({ type: 'OUT', num: this.name }))
        this.down$ = Observable.fromEvent(this, 'pointerdown').map(e => ({ type: 'DOWN', num: this.name }))
        this.up$ = Observable.fromEvent(this, 'pointerup').map(e => ({ type: 'UP', num: this.name }))
        this.$ = Observable.merge(this.over$, this.out$, this.down$, this.up$)
    }

    disable() {
        this.interactive = false
        this.buttonMode = false
    }

    show() {
        this.sprite.changeTexture(`${this.name}_on`)
        this.spine.state.setAnimation(0, 'animation', false)
    }

    hide() {
        this.sprite.changeTexture(`${this.name}_off`)
    }

}

const defaultNumbersConfig = {
    left: {
        x: -0.337,
        y: 0,
        pattern: [4, 2, 6, 9, 10, 1, 8, 7, 3, 5],
        delta: 0.065,
        positions: [],
        size: 30,
        WinNumber
    },
    right: {
        x: 0.338,
        y: 0,
        pattern: [4, 2, 6, 9, 10, 1, 8, 7, 3, 5],
        delta: 0.065,
        positions: [],
        size: 30,
        WinNumber
    }
}

class Numbers extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })
        this.name = 'numbers'

        this.config = defaultsDeep(config, defaultNumbersConfig)

        for (const side in this.config)
            this.createSide(side)

        this.enable()
    }

    createSide(side) {
        this.items = this.items || []         
        this[side] = new Container({
            container: this,
            x: this.config[side].x,
            y: this.config[side].y
        })
        this[side].name = side
        this[side].items = []
        this.config[side].pattern.forEach((el, i, arr) => {
            let position = this.config[side].positions[i] || this.config[side].delta * (i - (arr.length - 1) / 2)

            this[side].items.push(
                new this.config[side].WinNumber({
                    container: this[side],
                    y: position,
                    value: el,
                    size: this.config[side].size
                })
            )

        })
        this.items = [...this.items, this[side].items]
    }

    show(num) {
        for (const side in this.config)
            this[side].items
                .filter(item => item.name == num)
                .forEach(item => item.show())
    }

    hide(num) {
        for (const side in this.config)
            this[side].items
                .filter(item => item.name == num)
                .forEach(item => item.hide())
    }

    hideAll() {
        for (const side in this.config)
            this[side].items
                .forEach(item => item.hide())
    }

    enable() {
        this.$ = new Subject()

        for (const side in this.config)
            this[side].items.forEach(num => num.enable())

        for (const side in this.config)
            this[side].items
                .forEach(num => num.$
                    .map(e => Object.assign({ side }, e))
                    .subscribe(e => this.$.next(e)))
    }

    disable() {
        this.$.complete()
        for (const side in this.config)
            this[side].items.forEach(num => num.disable())
    }

}

export { Numbers, WinNumber, defaultNumbersConfig }