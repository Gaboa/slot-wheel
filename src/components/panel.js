import defaultsDeep from 'lodash.defaultsdeep'
import { Subject } from 'rxjs'
import { Container, Spine, Button, Sprite, BalanceText } from "../utils"

const defaultButtonsConfig = {
    level: {
        x: -0.133,
        y: 0,
        delta: 0.075,
    },
    value: {
        x: 0.132,
        y: 0,
        delta: 0.075,
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
        y: -0.002
    },
    max: {
        x: 0.065,
        y: -0.005
    },
    count: {
        text: {
            x: -0.061,
            y: -0.004
        },
        bg: {
            x: -0.065,
            y: -0.005
        }
    }
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

const defaultAutoPanelConfig = {
    left: {
        pattern: [{ value: 10, y: -33 }, { value: 25, y: -1 }, { value: 50, y: 32 }],
        deltaX: -41
    },
    right: {
        pattern: [{ value: 100, y: -33 }, { value: 250, y: -1 }, { value: 500, y: 32 }],
        deltaX: 38
    }
}

class Panel extends Container {

    constructor({
        container,
        x,
        y,
        config = {}
    }) {
        super({ container, x, y })
        this.name = 'panel'
        this.config = config

        // this.panel = new Spine({
        //     container: this,
        //     name: 'panel',
        //     anim: { track: 0, name: 'idle', repeat: true }
        // })

        this.labels = new Sprite({
            container: this,
            texture: 'panel_root',
            name: 'labels'
        })

        this.buttons = new Buttons({
            container: this,
            y: 0.005,
            config: this.config.buttons
        })
        this.buttons.anim.visible = false

        this.balance = new Balance({
            container: this,
            y: 0.02,
            config: this.config.balance
        })
    }

}

class AutoPanel extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })

        this.config = defaultsDeep(config, defaultAutoPanelConfig)

        this.bg = new Sprite({
            container: this,
            texture: 'auto_panel'
        })

        this.items = []
        for (let side in this.config)
            this.createButtonsRow(this.config[side])

        this.enable()
    }

    enable() {
        this.subs = []
        this.$ = new Subject()

        this.items.forEach(item => this.subs.push(item.up$.subscribe(e   => this.$.next(Object.assign({ value: item.name }, e)))))
        this.items.forEach(item => this.subs.push(item.over$.subscribe(e => item.alpha = 1)))
        this.items.forEach(item => this.subs.push(item.out$.subscribe(e  => item.alpha = 0.01)))
    }

    disable() {
        this.$.complete()
        this.subs.forEach(s => s.unsubscribe())
    }

    createButtonsRow(config) {
        config.pattern.forEach(obj => {
            this.items.push(
                this[`auto_${obj.value}`] = new Button({
                    container: this,
                    x: config.deltaX,
                    y: obj.y,
                    texture: `auto_${obj.value}`,
                    name: obj.value,
                    alpha: 0.01,
                    isHover: false,
                    isTap: false
                }))
        })
    }

}

class AutoCounter extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })
        this.name = 'counter'
        this.visible = false

        this.config = config

        this.bg = new Sprite(Object.assign({
            container: this,
            texture: 'auto_count'
        }, this.config.bg))

        this.text = new BalanceText(Object.assign({
            container: this,
            text: 0,
            fixed: 0,
            suffix: ''
        }, this.config.text))
    }

    set(value) {
        this.text.set(value)
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
        this.name = 'buttons'

        this.config = defaultsDeep(config, defaultButtonsConfig)

        this.items = []
        this.createBalanceControl('level')
        this.createBalanceControl('value')

        this.anim = new Spine(Object.assign({
            container: this,
            name: 'spin'
        }, this.config.spin))
        this.panel = new AutoPanel(Object.assign({
            container: this
        }, this.config.spin))
        this.createButton('auto')
        this.createButton('max')
        this.createButton('spin')
        this.createButton('stop')
        this.count = new AutoCounter({ container: this, config: this.config.count })

    }

    createButton(name) {
        this[name] = new Button(Object.assign({
            container: this,
            texture: name
        }, this.config[name]))
        this[name].name = name
        this.items.push(this[name])
    }

    changeButtonTo(state) {
        switch (state) {
            case 'auto':
                this.anim.state.current = state
                this.stop.visible = false
                this.spin.visible = false
                this.panel.visible = true
                break
            case 'spin':
                this.anim.state.current = state
                this.stop.visible = false
                this.panel.visible = false
                this.spin.visible = true
                break
            case 'stop':
                this.anim.state.current = state
                this.panel.visible = false
                this.spin.visible = false
                this.stop.visible = true
                break
            case 'anim':
                this.panel.visible = false
                this.spin.visible = false
                this.stop.visible = false
                break
            default:
        }
    }

    changeTo(state) {
        switch (state) {
            case 'auto':
                if (this.anim.state.current === 'spin')
                    this.anim.state.setAnimation(0, 'spin_auto', false)
                else this.changeButtonTo(state)
                break
            case 'spin':
                if (this.anim.state.current === 'stop')
                    this.anim.state.setAnimation(0, 'stop_spin', false)
                else if (this.anim.state.current === 'auto')
                    this.anim.state.setAnimation(0, 'auto_spin', false)
                else this.changeButtonTo(state)
                break
            case 'stop':
                if (this.anim.state.current === 'auto')
                    this.anim.state.setAnimation(0, 'auto_stop', false)
                else this.changeButtonTo(state)
                break
            default:
        }
    }

    createBalanceControl(name) {
        this[name] = {}
        this[name].plus = new Button({
            container: this,
            texture: 'plus',
            x: this.config[name].x + this.config[name].delta * 0.5,
            y: this.config[name].y
        })
        this[name].plus.name = `${name}_plus`
        this[name].minus = new Button({
            container: this,
            texture: 'minus',
            x: this.config[name].x - this.config[name].delta * 0.5,
            y: this.config[name].y
        })
        this[name].minus.name = `${name}_minus`
        this.items.push(this[name].minus, this[name].plus)
        this[name].progress = new ProgressBar({
            container: this,
            texture: 'progress',
            x: this.config[name].progress.x,
            y: this.config[name].progress.y,
            w: this.config[name].progress.w
        })
        this[name].progress.set(1)
    }

    enableAll() {
        this.items.forEach(button => button.enable())
    }

    disableAll(withStop = false) {
        if (withStop)
            this.items.forEach(button => button.disable())
        else
            this.items.filter(item => item !== this.stop).forEach(button => button.disable())
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

class ProgressBar extends Sprite {

    constructor({
        container,
        texture,
        x,
        y,
        w
    }) {
        super({ container, anchor: 0, x, y, texture })
        this.w = w
    }

    set(value) {
        this.width = value * this.w * GAME_WIDTH
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
        this.name = 'balance'

        this.config = defaultsDeep(config, defaultBalanceConfig)

        this.items = []
        for (const prop in this.config) {
            if (this.config.hasOwnProperty(prop) && prop !== 'style') {
                const field = this.config[prop]
                this[prop] = new BalanceText(Object.assign({
                    container: this,
                    style: this.config.style
                }, field))
                this[prop].name = prop
                this.items.push(this[prop])
            }
        }

    }

}

export { Panel, Balance, Buttons, AutoCounter, AutoPanel, ProgressBar }