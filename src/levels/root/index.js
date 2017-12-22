import { Subject, Observable } from "rxjs"
import { Container, Sprite } from "../../utils"
import { Screen, Footer } from '../../components'
import { Darkness } from "../preload/helpers"

// TODO: Add level and value to subs
// TODO: Create balance bindings for different modes

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

        this.screen.$
            .filter(e => e.from === 'SCREEN')
            .filter(e => e.state === 'START')
            .subscribe(e => this.game.request.sendRoll({
                value: this.data.balance.value.current,
                level: this.data.balance.level.current
            }))

        this.screen.$
            .filter(e => e.from === 'SCREEN')
            .filter(e => e.state === 'START')
            .subscribe(e => this.balanceCtrl.start())

        this.screen.$
            .filter(e => e.from === 'SCREEN')
            .filter(e => e.state === 'END')
            .subscribe(e => this.balanceCtrl.end())

        this.data.screen$
            .filter(e => Array.isArray(e))
            .take(1)
            .subscribe(s => this.screen.setStartScreen(s))

        this.data.screen$
            .filter(e => Array.isArray(e))
            .skip(1)
            .subscribe(s => this.screen.setEndScreen(s))

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