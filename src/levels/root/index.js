import defaultsDeep from 'lodash.defaultsdeep'
import { Subject, Observable } from "rxjs"
import { Container, Sprite, Button, BalanceText } from "../../utils"
import { Screen, Footer } from '../../components'
import { Darkness } from "../preload/helpers"

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

        setTimeout(() => this.enable(), 0)
    }
    
    enable() {
        this.balance = new BalanceController({ game: this.game })
        this.root = new RootController({ game: this.game })
        this.enableStreams()
    }

    enableStreams() {
        this.subs = []
        this.$ = new Subject()

        // Roll Controller
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
            .subscribe(e => this.balance.start())

        this.machine.screen.$
            .filter(e => e.from === 'SCREEN')
            .filter(e => e.state === 'END')
            .subscribe(e => this.balance.end())

        this.data.screen$
            .filter(e => Array.isArray(e))
            .take(1)
            .subscribe(s => this.machine.screen.setStartScreen(s))

        this.data.screen$
            .filter(e => Array.isArray(e))
            .skip(1)
            .subscribe(s => this.machine.screen.setEndScreen(s))

    }

    disableStreams() {
        this.subs.forEach(sub => sub.unsubscribe())
        this.$.complete()
    }

}

class FRController {

    enable() {

    }

    disable() {

    }

}

class FSController {

    enable() {

    }

    disable() {

    }

}

const defaultRootConfig = {}

class RootController {

    constructor({
        game,
        config
    }) {
        this.game = game
        this.level = game.level
        this.data = game.data
        this.state = game.state
        this.balance = this.data.balance
        this.footer = this.level.footer
        this.machine = this.level.machine
        this.config = defaultsDeep(config, defaultRootConfig)

        this.enable()
    }

    enable() {
        this.enableButtons()
        this.enableBalance()
    }

    disable() {

    }

    enableButtons() {
        if (GAME_DEVICE === 'desktop')
            this.enableDesktopButtons()
        if (GAME_DEVICE === 'mobile')
            this.enableMobileButtons()
    }

    enableMobileButtons() {
        // Settings
        // Auto
        // Spin
        // Bet
        // Sound
        // Home
        // Time
        this.game.ticker.add(this.footer.time.update.bind(this.footer.time))
    }

    enableDesktopButtons() {
        // Spin
        this.machine.panel.buttons.spin.down$
            .subscribe(e => this.machine.screen.roll())
        
        // Auto
        this.machine.panel.buttons.max.down$
            .subscribe(e => e)

        // Max
        this.machine.panel.buttons.max.down$
            .subscribe(e => this.balance.value.index = this.balance.value.arr.length - 1)

        // Level - Plus / Minus
        this.machine.panel.buttons.level.minus.down$
            .subscribe(e => this.balance.level.index--)
        this.machine.panel.buttons.level.plus.down$
            .subscribe(e => this.balance.level.index++)

        // Value - Plus / Minus
        this.machine.panel.buttons.value.minus.down$
            .subscribe(e => this.balance.value.index--)
        this.machine.panel.buttons.value.plus.down$
            .subscribe(e => this.balance.value.index++)
        
        // Min / Max stoppers for balance buttons
        this.enableBalanceStoppers()
        // Footer
        this.enableFooterButtons()
    }

    enableFooterButtons() {
        // Home
        this.footer.buttons.home.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => e)

        // Settings
        this.footer.buttons.settings.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => e)

        // Info
        this.footer.buttons.info.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => e)

        // Sound
        this.footer.buttons.sound.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => this.state.settings.isSound = !this.state.settings.isSound)
        this.state.settings.isSound$
            .subscribe(e => this.footer.buttons.sound.to(e))

        // Fast
        this.state.settings.isFast$
            .subscribe(e => {
                this.footer.buttons.fast.to(e)
                this.machine.screen.setRollSpeed(this.machine.screen.config.roll[e ? 'fast' : 'normal'])
            })
        this.footer.buttons.fast.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => this.state.settings.isFast = !this.state.settings.isFast)

        // Fullscreen
        this.state.settings.isFullscreen$
            .subscribe(e => {
                this.footer.buttons.fullscreen.to(e)
                this.game.device[`${e ? 'enter' : 'cancel'}Fullscreen`]()
            })
        this.footer.buttons.fullscreen.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => this.state.settings.isFullscreen = !this.state.settings.isFullscreen)
        
        // Time
        this.game.ticker.add(this.footer.time.update.bind(this.footer.time))
    }

    enableBalance() {
        if (GAME_DEVICE === 'desktop')
            this.enableDesktopBalance()
        if (GAME_DEVICE === 'mobile')
            this.enableMobileBalance()
    }

    enableMobileBalance() {
    
    }

    enableDesktopBalance() {
        // Footer Balance
        this.data.balance.currency$
            .subscribe(e => this.footer.balance.setCurrency(e))
        this.data.balance.cash.sum$
            .subscribe(e => this.footer.balance.bottom.left.set(e))
        this.data.balance.cash.bet$
            .subscribe(e => this.footer.balance.bottom.center.set(e))
        this.data.balance.cash.win$
            .subscribe(e => this.footer.balance.bottom.right.set(e))

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
    }

    enableBalanceStoppers() {
        // Balance buttons min/max bindings
        this.balance.value.max$
            .subscribe(e => this.machine.panel.buttons.value.plus[e ? 'disable' : 'enable']())
        this.balance.value.min$
            .subscribe(e => this.machine.panel.buttons.value.minus[e ? 'disable' : 'enable']())
        this.balance.level.max$
            .subscribe(e => {
                this.machine.panel.buttons.level.plus[e ? 'disable' : 'enable']()
                this.machine.panel.buttons.max[e ? 'disable' : 'enable']()
            })
        this.balance.level.min$
            .subscribe(e => this.machine.panel.buttons.level.minus[e ? 'disable' : 'enable']())
    }


}

class BonusController {

}

// Balance Controller
const defaultBalanceConfig = {
    level: {
        current: true,
        up: true,
        bottom: true,
        minMax: true
    },
    value: {
        current: true,
        up: true,
        bottom: true,
        minMax: true
    },
    levelValue: {
        coinBet: true,
        coinSum: true,
        cashBet: true
    }
}

class BalanceController {

    constructor({ game, config }) {
        this.config = defaultsDeep(config, defaultBalanceConfig)
        this.game = game
        this.data = game.data
        this.state = game.state
        this.balance = this.data.balance

        this.enableStreams()
    }

    enableStreams() {
        this.enableLevel()
        this.enableValue()
        this.enableLevelValueBindings()
    }

    disableStreams() {
        this.disableLevel()
        this.disableValue()
        this.disableLevelValueBindings()
    }

    get subs() {
        return [...this.valueSubs, ...this.levelSubs, ...this.levelValueSubs]
    }

    enableValue() {
        this.valueSubs = []

        // Current Value
        if (this.config.value.current)
        this.valueSubs.push(
        this.valueCurrentSub = this.balance.value.index$
            .subscribe(i => this.balance.value.current = this.balance.value.arr[i]))
        
        // Up and Bottom stoppers
        if (this.config.value.up)
        this.valueSubs.push(
        this.valueUpStopSub = this.balance.value.index$
            .filter(i => i > this.balance.value.arr.length - 1)
            .subscribe(i => this.balance.value.index = this.balance.value.arr.length - 1))

        if (this.config.value.bottom)
        this.valueSubs.push(
        this.valueBottomStopSub = this.balance.value.index$
            .filter(i => i < 0)
            .subscribe(i => this.balance.value.index = 0))

        // Min + Max logic
        if (this.config.value.minMax)  
        this.valueSubs.push(
        this.valueMinMaxSub = this.balance.value.index$
            .subscribe(i => {
                if (i === this.balance.value.arr.length - 1) {
                    this.balance.value.max = true
                    this.balance.value.min = false
                } else if (i === 0) {
                    this.balance.value.max = false
                    this.balance.value.min = true
                } else {
                    this.balance.value.max = false
                    this.balance.value.min = false
                }
            }))
    
    }

    enableLevel() {
        this.levelSubs = []

        // Current Level
        if (this.config.level.current)
        this.levelSubs.push(
        this.levelCurrentSub = this.balance.level.index$
            .subscribe(i => this.balance.level.current = this.balance.level.arr[i]))

        // Up and Bottom stoppers
        if (this.config.level.up)        
        this.levelSubs.push(
        this.levelUpStopSub = this.balance.level.index$
            .filter(i => i > this.balance.level.arr.length - 1)
            .subscribe(i => this.balance.level.index = this.balance.level.arr.length - 1))

        if (this.config.level.bottom)        
        this.levelSubs.push(
        this.levelBottomStopSub = this.balance.level.index$
            .filter(i => i < 0)
            .subscribe(i => this.balance.level.index = 0))

        // Min + Max logic
        if (this.config.level.minMax)        
        this.levelSubs.push(
        this.levelMinMaxSub = this.balance.level.index$
            .subscribe(i => {
                if (i === this.balance.level.arr.length - 1) {
                    this.balance.level.max = true
                    this.balance.level.min = false
                } else if (i === 0) {
                    this.balance.level.max = false
                    this.balance.level.min = true
                } else {
                    this.balance.level.max = false
                    this.balance.level.min = false
                }
            }))
        
    }

    enableLevelValueBindings() {
        this.levelValueSubs = []

        // Change level => change Coin Bet
        if (this.config.levelValue.coinBet)        
        this.levelValueSubs.push(
        this.coinBetSub = this.balance.level.current$
            .subscribe(level => this.balance.coin.bet = level * this.data.lines.length))
        
        // Change value => change Coin Sum
        if (this.config.levelValue.coinSum)                
        this.levelValueSubs.push(
        this.coinSumSub = this.balance.value.current$
            .subscribe(value => this.balance.coin.sum = Math.floor(this.balance.cash.sum * 100 / value)))
        
        // Change level or value => change Cash Bet
        if (this.config.levelValue.cashBet)                
        this.levelValueSubs.push(
        this.cashBetSub = this.balance.value.current$
            .combineLatest(this.balance.level.current$)
            .subscribe(([value, level]) => this.balance.cash.bet = level * this.data.lines.length * value / 100))
        
    }

    disableLevel() {
        this.levelSubs.forEach(s => s.unsubscribe())
    }

    disableValue() {
        this.valueSubs.forEach(s => s.unsubscribe())        
    }

    disableLevelValueBindings() {
        this.levelValueSubs.forEach(s => s.unsubscribe())                
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