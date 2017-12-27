import defaultsDeep from 'lodash.defaultsdeep'
import { Container, Sprite, Button, BalanceText } from "../utils"
import { Screen } from "./screen"
import { Text, Graphics } from '../utils'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

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