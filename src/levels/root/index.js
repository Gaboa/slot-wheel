import { Subject } from "rxjs"
import { Container } from "../../utils/container"
import { Screen } from '../../components'
import { Darkness } from "../preload/helpers"

class Root extends Container {

    constructor({
        game,
        config
    }) {
        super({ container: game.stage, x: 0.5, y: 0.5 })
        this.game = game

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

        this.darkness = new Darkness({
            container: this,
            autoHide: true
        })

        this.enableStreams()
        this.balance()

    }

    enableStreams() {
        this.subs = []
        this.$ = new Subject()

        this.screen.$
            .filter(e => e.from === 'SCREEN')
            .filter(e => e.state === 'START')
            .subscribe(e => this.game.request.sendRoll({
                value: this.game.data.balance.value.current,
                level: this.game.data.balance.level.current
            }))

        this.game.data.screen$
            .filter(e => Array.isArray(e))
            .take(1)
            .subscribe(s => this.screen.setStartScreen(s))

        this.game.data.screen$
            .filter(e => Array.isArray(e))
            .skip(1)
            .subscribe(s => this.screen.setEndScreen(s))
    }

    balance() {
        // Value
        this.game.data.balance.value.index$
            .subscribe(i => this.game.data.balance.value.current = this.game.data.balance.value.arr[i])

        // Up and Bottom stoppers
        this.game.data.balance.value.index$
            .filter(i => i > this.game.data.balance.value.arr.length - 1)
            .subscribe(i => this.game.data.balance.value.index = this.game.data.balance.value.arr.length - 1)

        this.game.data.balance.value.index$
            .filter(i => i < 0)
            .subscribe(i => this.game.data.balance.value.index = 0)

        // Min + Max logic
        this.game.data.balance.value.index$
            .subscribe(i => {
                if (i === this.game.data.balance.value.arr.length - 1) {
                    this.game.data.balance.value.max = true
                    this.game.data.balance.value.min = false
                } else if (i === 0) {
                    this.game.data.balance.value.max = false
                    this.game.data.balance.value.min = true
                } else {
                    this.game.data.balance.value.max = false
                    this.game.data.balance.value.min = false
                }
            })

        // Level
        this.game.data.balance.level.index$
            .subscribe(i => this.game.data.balance.level.current = this.game.data.balance.level.arr[i])
    
        // Up and Bottom stoppers
        this.game.data.balance.level.index$
            .filter(i => i > this.game.data.balance.level.arr.length - 1)
            .subscribe(i => this.game.data.balance.level.index = this.game.data.balance.level.arr.length - 1)
        
        this.game.data.balance.level.index$
            .filter(i => i < 0)
            .subscribe(i => this.game.data.balance.level.index = 0)

        // Min + Max logic
        this.game.data.balance.level.index$
            .subscribe(i => {
                if (i === this.game.data.balance.level.arr.length - 1) {
                    this.game.data.balance.level.max = true
                    this.game.data.balance.level.min = false                    
                } else if (i === 0) {
                    this.game.data.balance.level.max = false
                    this.game.data.balance.level.min = true
                } else {
                    this.game.data.balance.level.max = false
                    this.game.data.balance.level.min = false
                }
            })

    }

    disableStreams() {
        this.subs.forEach(sub => sub.unsubscribe())
        this.$.complete()
    }

}

export { Root }