import defaultsDeep from 'lodash.defaultsdeep'
import { Subject, Observable } from "rxjs"
import { Container, Sprite, Button } from "../../utils"
import { Screen, Footer } from '../../components'
import { Darkness } from "../preload/helpers"
import { BalanceText } from '../../utils/balance-text';

// TODO: Add level and value to subs
// TODO: Create balance bindings for different modes
// TODO: Add Spine helper class
// TODO: Add Lines to Machine
// TODO: Add Numbers to Machine
// TODO: Add Win to Machine

const defaultConfig = {
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

class Buttons extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })
        
        this.config = defaultsDeep(config, defaultConfig)

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

const defaultBalConfig = {
    style: {},
    bet: {
        x: -0.255,
        y: 0,
        text: 0,
        fixed: 0
    },
    line: {
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

class Balance extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })

        this.config = defaultsDeep(config, defaultBalConfig)

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
                    time:   0.5
                },

                roll: {
                    normal: 1,
                    fast:   1.5
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

        this.panel = new Panel({ container: this, y: 0.35 })

    }

}

class Root extends Container {

    constructor({
        game,
        config
    }) {
        super({ container: game.stage, x: 0.5, y: 0.5 })
        
        this.game = game
        this.data = game.data
        this.state = game.state

        this.bg = new Sprite({
            container: this,
            texture: 'preload_bg',
            name: 'bg'
        })

        this.machine = new Machine({
            container: this,
            y: -0.05
        })

        this.footer = new Footer({
            container: this
        })

        this.darkness = new Darkness({
            container: this,
            autoHide: true
        })

        this.balanceCtrl = new BalanceController(game)

        this.enableStreams()
        this.enableBalanceStreams()

    }

    enableStreams() {
        this.subs = []
        this.$ = new Subject()

        this.machine.screen.$
            .filter(e => e.from === 'SCREEN')
            .filter(e => e.state === 'START')
            .subscribe(e => this.game.request.sendRoll({
                value: this.data.balance.value.current,
                level: this.data.balance.level.current
            }))

        this.machine.screen.$
            .filter(e => e.from === 'SCREEN')
            .filter(e => e.state === 'START')
            .subscribe(e => this.balanceCtrl.start())

        this.machine.screen.$
            .filter(e => e.from === 'SCREEN')
            .filter(e => e.state === 'END')
            .subscribe(e => this.balanceCtrl.end())

        this.data.screen$
            .filter(e => Array.isArray(e))
            .take(1)
            .subscribe(s => this.machine.screen.setStartScreen(s))

        this.data.screen$
            .filter(e => Array.isArray(e))
            .skip(1)
            .subscribe(s => this.machine.screen.setEndScreen(s))

        // Footer
        this.game.ticker.add(this.footer.time.update.bind(this.footer.time))

        // Fullscreen button
        this.footer.buttons.fullscreen.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => this.state.settings.isFullscreen = !this.state.settings.isFullscreen)

        this.state.settings.isFullscreen$
            .subscribe(e => {
                this.footer.buttons.fullscreen.to(e)
                e ? this.game.device.enterFullscreen() : this.game.device.cancelFullscreen()
            })

        // Sound button
        this.footer.buttons.sound.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => this.state.settings.isSound = !this.state.settings.isSound)

        this.state.settings.isSound$
            .subscribe(e => this.footer.buttons.sound.to(e))

        // Sound button
        this.footer.buttons.fast.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => this.state.settings.isFast = !this.state.settings.isFast)

        this.state.settings.isFast$
            .subscribe(e => this.footer.buttons.fast.to(e))

        // Footer Balance
        this.data.balance.currency$
            .subscribe(e => this.footer.balance.setCurrency(e))

        // Root bindings
        this.data.balance.cash.sum$
            .subscribe(e => this.footer.balance.bottom.left.set(e))
        this.data.balance.cash.bet$
            .subscribe(e => this.footer.balance.bottom.center.set(e))
        this.data.balance.cash.win$
            .subscribe(e => this.footer.balance.bottom.right.set(e))

        this.data.balance.coin.sum$
            .subscribe(e => this.footer.balance.top.left.set(e))
        this.data.balance.coin.bet$
            .subscribe(e => this.footer.balance.top.right.set(e))

        // Panel Balance bindings
        this.data.balance.level.current$
            .subscribe(e => this.machine.panel.balance.level.set(e))
        this.data.balance.value.current$
            .subscribe(e => this.machine.panel.balance.value.set(e / 100))
        this.data.balance.coin.bet$
            .subscribe(e => this.machine.panel.balance.bet.set(e))
        this.data.balance.coin.sum$
            .subscribe(e => this.machine.panel.balance.sum.set(e))
        this.data.lines$
            .subscribe(e => this.machine.panel.balance.line.set(e.length))

        // Panel buttons bindings
        this.machine.panel.buttons.level.minus.down$
            .subscribe(e => this.balanceCtrl.level({ down: true }))
        this.machine.panel.buttons.level.plus.down$
            .subscribe(e => this.balanceCtrl.level({ up: true }))
        this.machine.panel.buttons.max.down$
            .subscribe(e => this.balanceCtrl.level({ max: true }))
        this.machine.panel.buttons.value.minus.down$
            .subscribe(e => this.balanceCtrl.value({ down: true }))
        this.machine.panel.buttons.value.plus.down$
            .subscribe(e => this.balanceCtrl.value({ up: true }))

        // Balance buttons min/max bindings
        this.data.balance.value.max$
            .subscribe(e => {
                if (e) this.machine.panel.buttons.value.plus.disable()
                else this.machine.panel.buttons.value.plus.enable()
            })
        this.data.balance.value.min$
            .subscribe(e => {
                if (e) this.machine.panel.buttons.value.minus.disable()
                else this.machine.panel.buttons.value.minus.enable()
            })
        this.data.balance.level.max$
            .subscribe(e => {
                if (e) {
                    this.machine.panel.buttons.level.plus.disable()
                    this.machine.panel.buttons.max.disable()
                }
                else {
                    this.machine.panel.buttons.level.plus.enable()
                    this.machine.panel.buttons.max.enable()
                }
            })
        this.data.balance.level.min$
            .subscribe(e => {
                if (e) this.machine.panel.buttons.level.minus.disable()
                else this.machine.panel.buttons.level.minus.enable()
            })

        // Spin button binding
        this.machine.panel.buttons.spin.down$
            .subscribe(e => this.machine.screen.roll())

        // Fast spin settings binding
        this.state.settings.isFast$
            .subscribe(e => this.machine.screen.setRollSpeed(e ? this.machine.screen.config.roll.fast : this.machine.screen.config.roll.normal ))
        
    }

    enableBalanceStreams() {
        // Value
        this.data.balance.value.index$
            .subscribe(i => this.data.balance.value.current = this.data.balance.value.arr[i])

        // Up and Bottom stoppers
        this.data.balance.value.index$
            .filter(i => i > this.data.balance.value.arr.length - 1)
            .subscribe(i => this.data.balance.value.index = this.data.balance.value.arr.length - 1)

        this.data.balance.value.index$
            .filter(i => i < 0)
            .subscribe(i => this.data.balance.value.index = 0)

        // Min + Max logic
        this.data.balance.value.index$
            .subscribe(i => {
                if (i === this.data.balance.value.arr.length - 1) {
                    this.data.balance.value.max = true
                    this.data.balance.value.min = false
                } else if (i === 0) {
                    this.data.balance.value.max = false
                    this.data.balance.value.min = true
                } else {
                    this.data.balance.value.max = false
                    this.data.balance.value.min = false
                }
            })

        // Level
        this.data.balance.level.index$
            .subscribe(i => this.data.balance.level.current = this.data.balance.level.arr[i])
    
        // Up and Bottom stoppers
        this.data.balance.level.index$
            .filter(i => i > this.data.balance.level.arr.length - 1)
            .subscribe(i => this.data.balance.level.index = this.data.balance.level.arr.length - 1)
        
        this.data.balance.level.index$
            .filter(i => i < 0)
            .subscribe(i => this.data.balance.level.index = 0)

        // Min + Max logic
        this.data.balance.level.index$
            .subscribe(i => {
                if (i === this.data.balance.level.arr.length - 1) {
                    this.data.balance.level.max = true
                    this.data.balance.level.min = false                    
                } else if (i === 0) {
                    this.data.balance.level.max = false
                    this.data.balance.level.min = true
                } else {
                    this.data.balance.level.max = false
                    this.data.balance.level.min = false
                }
            })

        // Change level => change Coin Bet
        this.data.balance.level.current$
            .subscribe(level => this.data.balance.coin.bet = level * this.data.lines.length)

        // Change value => change Coin Sum
        this.data.balance.value.current$
            .subscribe(value => this.data.balance.coin.sum = Math.floor(this.data.balance.cash.sum * 100 / value))
            
        // Change level or value => change Cash Bet
        this.data.balance.value.current$
            .combineLatest(this.data.balance.level.current$)
            .subscribe(([value, level]) => this.data.balance.cash.bet = level * this.data.lines.length * value / 100)

    }

    disableStreams() {
        this.subs.forEach(sub => sub.unsubscribe())
        this.$.complete()
    }

}

class BalanceController {

    constructor(game) {
        this.game = game
        this.data = game.data
        this.state = game.state
        this.balance = this.data.balance
    }

    level({
        up = false,
        down = false,
        max = false
    }) {
        if (up && !this.balance.level.max)
            this.balance.level.index++
        if (down && !this.balance.level.min)
            this.balance.level.index--
        if (max && !this.balance.level.max)
            this.balance.level.index = this.balance.level.arr.length - 1
    }

    value({
        up = false,
        down = false,
        max = false
    }) {
        if (up && !this.balance.value.max)
            this.balance.value.index++
        if (down && !this.balance.value.min)
            this.balance.value.index--
        if (max && !this.balance.value.max)
            this.balance.value.index = this.balance.value.arr.length - 1
    }

    start() {
        this.balance.coin.sum = this.balance.coin.sum - this.balance.coin.bet
        this.balance.cash.sum = (this.balance.cash.sum * 100 - this.balance.cash.bet * 100) / 100
        this.balance.cash.win = 0
    }

    end() {
        
    }

}

export { Root }