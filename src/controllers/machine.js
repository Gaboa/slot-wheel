import defaultsDeep from 'lodash.defaultsdeep'

const defaultConfig = {
    screen: {
        start: {
            request: true,
            balance: true,
            state: true
        },
        end: {
            state: true
        },
        data: {
            start: true,
            end: true
        }
    },
    fast: true,
    lines: {
        show: true,
        hide: true
    }
}

class MachineController {

    constructor({
        game,
        config,
        autoEnable = true
    }) {
        this.config = defaultsDeep(config, defaultConfig)

        this.game  = game
        this.level = game.root
        this.data  = game.data
        this.state = game.state
        this.balance  = this.data.balance
        this.settings = this.state.settings
        this.machine  = this.level.machine
        this.screen   = this.machine.screen

        if (autoEnable) this.enable()        
    }

    enable() {
        this.subs = []

        // Roll Start => send Roll request
        if (this.config.screen.start.request)
        this.subs.push(
        this.screenStartRequestSub = this.machine.screen.$
            .filter(e => e.from  === 'SCREEN')
            .filter(e => e.state === 'START')
            .subscribe(e => this.game.request.sendRoll({
                    value: this.balance.value.current,
                    level: this.balance.level.current
                })))

        // Roll Start => change balance on start
        if (this.config.screen.start.balance)
        this.subs.push(
        this.screenStartBalanceSub = this.screen.$
            .filter(e => e.from  === 'SCREEN')
            .filter(e => e.state === 'START')
            .subscribe(e => {
                this.balance.coin.sum = this.balance.coin.sum - this.balance.coin.bet
                this.balance.cash.sum = (this.balance.cash.sum * 100 - this.balance.cash.bet * 100) / 100
                this.balance.cash.win = 0
            }))

        // Roll Start => change isRolling state to true
        if (this.config.screen.start.state)
        this.subs.push(
        this.screenStartStateSub = this.screen.$
            .filter(e => e.from  === 'SCREEN')
            .filter(e => e.state === 'START')
            .subscribe(e => this.state.isRolling = true ))

        // Roll End => change isRolling state to false
        if (this.config.screen.end.state)
        this.subs.push(
        this.screenEndStateSub = this.screen.$
            .filter(e => e.from  === 'SCREEN')
            .filter(e => e.state === 'END')
            .subscribe(e => this.state.isRolling = false ))

        // Set Start Screen only when came first data
        if (this.config.screen.data.start)
        this.subs.push(
        this.screenDataStartSub = this.data.screen$
            .filter(e => Array.isArray(e)).take(1)
            .subscribe(s => this.screen.setStartScreen(s)))

        // Set End Screen data comes ( but not start data )
        if (this.config.screen.data.end)
        this.subs.push(
        this.screenDataEndSub = this.data.screen$
            .filter(e => Array.isArray(e)).skip(1)
            .subscribe(s => this.screen.setEndScreen(s)))

        // Change speed with isFast setting
        if (this.config.fast)
        this.subs.push(
        this.fastSub = this.settings.isFast$
            .subscribe(e => this.screen.setRollSpeed(this.screen.config.roll[e ? 'fast' : 'normal'])))

        // Show Lines when hover on Numbers
        if (this.config.lines.show)
        this.subs.push(
        this.linesShowSub = this.machine.numbers.$
            .filter(e => e.type === 'OVER')
            .subscribe(e => this.machine.lines.show(e.num)))
            
        // Hide Lines when out of Numbers
        if (this.config.lines.hide)
        this.subs.push(
        this.linesHideSub = this.machine.numbers.$
            .filter(e => e.type === 'OUT')
            .subscribe(e => this.machine.lines.hide(e.num)))

    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

}

export { MachineController }
