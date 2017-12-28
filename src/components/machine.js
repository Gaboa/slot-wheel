import defaultsDeep from 'lodash.defaultsdeep'
import { Observable, Subject } from 'rxjs'
import { Container, Sprite, Button, BalanceText, Text, Graphics } from "../utils"
import { Screen } from "./screen"

// TODO: Add Lines to Machine
// TODO: Add Numbers to Machine
// TODO: Add Win to Machine

const defaultButtonsConfig = {
    level: {
        x: -0.128,
        y: 0,
        delta: 0.075
    },
    value: {
        x: 0.132,
        y: 0,
        delta: 0.075
    },
    auto: {
        x: -0.065,
        y: -0.005
    },
    spin: {
        x: 0,
        y: -0.002
    },
    stop: {
        x: 0,
        y: -0.005,
        visible: false
    },
    max: {
        x: 0.065,
        y: -0.005
    },
}

const defaultBalanceConfig = {
    style: {},
    bet: {
        x: -0.255,
        y: 0,
        text: 0,
        fixed: 0
    },
    lines: {
        x: -0.199,
        y: 0,
        text: 0,
        fixed: 0
    },
    level: {
        x: -0.127,
        y: 0,
        text: 0,
        fixed: 0
    },
    value: {
        x: 0.134,
        y: 0,
        text: 0,
        fixed: 2
    },
    sum: {
        x: 0.235,
        y: 0,
        text: 0,
        fixed: 0
    }
}

class WinNumber extends Text {

    constructor({
        container,
        x,
        y,
        text,
        size
    }) {
        super({ container, x, y, text, style: { fill: '#ffffff' } })

        if (size)
            this.hitArea = new PIXI.Circle(0, 0, size * 0.5)
    }
        
    enable() {
        this.interactive = true
        this.buttonMode = true

        this.over$ = Observable.fromEvent(this, 'pointerover').map(e => ({ type: 'OVER', num: this.text }))
        this.out$  = Observable.fromEvent(this, 'pointerout').map(e => ({ type: 'OUT', num: this.text }))
        this.down$ = Observable.fromEvent(this, 'pointerdown').map(e => ({ type: 'DOWN', num: this.text }))
        this.up$   = Observable.fromEvent(this, 'pointerup').map(e => ({ type: 'UP', num: this.text }))
        this.$ = Observable.merge(this.over$, this.out$, this.down$, this.up$)
    }

    disable() {
        this.interactive = false
        this.buttonMode = false
    }

}

const defaultNumbersConfig = {
    left: {
        x: -0.337,
        y: 0,
        pattern: [4, 2, 6, 9, 10, 1, 8, 7, 3, 5],
        delta: 0.065,
        positions: [],
        size: 0,
        WinNumber
    },
    right: {
        x: 0.338,
        y: 0,
        pattern: [4, 2, 6, 9, 10, 1, 8, 7, 3, 5],
        delta: 0.065,
        positions: [],
        size: 0,
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

        this.config = defaultsDeep(config, defaultNumbersConfig)

        for (const side in this.config)
            this.createSide(side)

        this.enable()
    }

    createSide(side) {
        this[side] = new Container({
            container: this.container,
            x: this.config[side].x,
            y: this.config[side].y
        })
        this[side].items = []
        this.config[side].pattern.forEach((el, i, arr) => {
            let position = this.config[side].positions[i] || this.config[side].delta * (i - (arr.length - 1) / 2)

            this[side].items.push(
                new this.config[side].WinNumber({
                    container: this[side],
                    y: position,
                    text: el,
                    size: this.config[side].size
                })
            )

        })
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

// TODO: Line with three types of tiles for different advanced line types

const defaultLinesConfig = {
    lines: [
        [2, 0, 0, 0, 2]
    ],
    el: {
        width:  256,
        height: 240
    },
    width: 350,

}

class Lines extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })

        this.items = []
        this.config = defaultsDeep(config, defaultLinesConfig)
        this.config.lines.forEach(line => this.createLine(line))
    }

    createLine(config) {
        const line = new Container({ container: this })

        config
            .filter((pos, i, arr) => i !== arr.length - 1)
            .forEach((pos, i) => {
                const part = PIXI.Sprite.fromImage('data:image/png;base64,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')
                part.anchor.set(0.5)
                part.tint = 0x00d5ff
                part.x = this.config.el.width * (i + 1 - config.length / 2)
                if (pos === config[i + 1]) {
                    part.rotation = 0
                    part.y = this.config.el.height * (pos - 1)
                } else {
                    part.scale.x = Math.sqrt(Math.pow(this.config.el.height, 2) + Math.pow((this.config.el.height * (config[i + 1] - pos)), 2)) / this.config.width
                    part.rotation = Math.atan(this.config.el.height * (config[i + 1] - pos) / this.config.el.width)
                    part.y = this.config.el.height * ((pos - 1) + (config[i + 1] - pos) / 2)
                }
                // else
                line.addChild(part)
            })
        // const part = new Sprite({ container: line, texture:  })
    }

}

class Line extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })

        this.bg = PIXI.Sprite.fromImage('data:image/png;base64,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')
        this.fg = PIXI.Sprite.fromImage('data:image/png;base64,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')
        this.bg.anchor.set(0.5)
        this.fg.anchor.set(0.5)
        this.addChild(this.bg, this.fg)
    }

}

class Buttons extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })

        this.config = defaultsDeep(config, defaultButtonsConfig)

        this.items = []
        this.createBalanceControl('level')
        this.createBalanceControl('value')

        this.createButton('auto')
        this.createButton('max')
        this.createButton('stop')
        this.createButton('spin')

    }

    createButton(name) {
        this[name] = new Button(Object.assign({
            container: this,
            texture: name
        }, this.config[name]))
        this.items.push(this[name])
    }

    createBalanceControl(name) {
        this[name] = {}
        this[name].plus = new Button({
            container: this,
            texture: 'plus',
            x: this.config[name].x + this.config[name].delta * 0.5,
            y: this.config[name].y
        })
        this[name].minus = new Button({
            container: this,
            texture: 'minus',
            x: this.config[name].x - this.config[name].delta * 0.5,
            y: this.config[name].y
        })
        this.items.push(this[name].minus, this[name].plus)
    }

    enableAll() {
        this.items.forEach(button => button.enable())
    }

    disableAll() {
        this.items.forEach(button => button.disable())
    }

    disableBalance() {
        this.max.disable()
        this.level.minus.disable()
        this.level.plus.disable()
        this.value.minus.disable()
        this.value.plus.disable()
    }

    enableBalance() {
        this.max.enable()
        this.level.minus.enable()
        this.level.plus.enable()
        this.value.minus.enable()
        this.value.plus.enable()
    }

}

class Balance extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })

        this.config = defaultsDeep(config, defaultBalanceConfig)

        this.items = []
        for (const prop in this.config) {
            if (this.config.hasOwnProperty(prop) && prop !== 'style') {
                const field = this.config[prop]
                this[prop] = new BalanceText(Object.assign({
                    container: this,
                    style: this.config.style
                }, field))
                this.items.push(this[prop])
            }
        }

    }

}

class Panel extends Container {

    constructor({
        container,
        x,
        y
    }) {
        super({ container, x, y })

        this.panel = new PIXI.spine.Spine(PIXI.utils.resources.panel.spineData)
        this.panel.state.setAnimation(0, 'idle', true)
        this.addChild(this.panel)

        this.labels = new Sprite({
            container: this,
            texture: 'panel_root'
        })

        this.buttons = new Buttons({ container: this, y: 0.06 })
        this.balance = new Balance({ container: this, y: 0.061 })
    }

}

class Machine extends Container {

    constructor({
        container,
        x,
        y
    }) {
        super({ container, x, y })

        // Machine BG
        this.bg = new PIXI.extras.TilingSprite(
            PIXI.utils.TextureCache['tile'],
            256 * 5,
            240 * 3
        )
        this.bg.anchor.set(0.5)
        this.addChild(this.bg)

        this.lines = new Lines({ container: this })

        // Screen with elements
        this.screen = new Screen({
            container: this,
            config: {
                amount: 5,
                dir: 'down',

                loop: {
                    amount: 20,
                    time: 0.5
                },

                roll: {
                    normal: 1,
                    fast: 1.5
                },

                log: {
                    screen: false,
                    wheel: false,
                    el: false
                }
            },
            dt: 0.075
        })
        this.screen.addMask()

        // Machine frame
        this.frame = new Sprite({
            container: this,
            texture: 'frame',
            name: 'frame'
        })

        // Machine Logo
        this.logo = new PIXI.spine.Spine(PIXI.utils.resources.logo.spineData)
        this.logo.state.setAnimation(0, 'idle', true)
        this.logo.y = -0.343 * GAME_HEIGHT
        this.addChild(this.logo)

        // Panel with Buttons and Balance
        this.panel = new Panel({ container: this, y: 0.35 })

        // Win Numbers
        this.numbers = new Numbers({ container: this })

    }

}

export {
    Machine,
    Balance,
    Buttons,
    Panel
}