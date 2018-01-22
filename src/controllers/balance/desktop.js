import defaultsDeep from 'lodash.defaultsdeep'

const defaultConfig = {
    coin: {
        sum: {
            idle: true,
            end:  true
        },
        bet: true
    },
    level: true,
    value: true,
    lines: true
}

class DesktopBalanceController {

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
        this.balance = this.data.balance

        this.machine = this.level.machine
        this.panel   = this.machine.panel.balance

        if (autoEnable) this.enable()
    }

    enable() {
        this.subs = []

        // Lines
        if (this.config.lines)
        this.subs.push(
        this.linesSub = this.data.lines$
            .subscribe(e => this.panel.lines.set(e.length)))
        
        // Level
        if (this.config.level)
        this.subs.push(
        this.levelSub = this.balance.level.current$
            .subscribe(e => this.panel.level.set(e)))                

        // Value
        if (this.config.value)
        this.subs.push(
        this.valueSub = this.balance.value.current$
            .subscribe(e => this.panel.value.set(e / 100)))
        
        // Coin Bet
        if (this.config.coin.bet)
        this.subs.push(
        this.coinBetSub = this.balance.coin.bet$
            .subscribe(e => this.panel.bet.set(e)))
        
        // Coin Sum in Idle
        if (this.config.coin.sum.idle)
        this.subs.push(
        this.coinSumIdleSub = this.balance.coin.sum$
            .filter(e => !this.state.isRolling)
            .subscribe(e => this.panel.sum.set(e)))
        
        // Coin Sum at Roll End
        if (this.config.coin.sum.end)
        this.subs.push(
        this.coinSumEndSub = this.balance.coin.sum$
            .filter(e => this.state.isRolling)
            .sample(this.state.isRolling$)
            .subscribe(e => this.panel.sum.set(e)))
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

}

export { DesktopBalanceController }