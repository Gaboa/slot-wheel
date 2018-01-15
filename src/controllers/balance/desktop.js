import defaultsDeep from 'lodash.defaultsdeep'
import { FooterBalanceController } from './footer'

const defaultConfig = {
    currency: true,
    cash: {
        sum: true,
        bet: true,
        win: true
    },
    coin: {
        sum: true,
        bet: true
    },
    level: true,
    value: true,
    lines: true
}

class DesktopBalanceController extends FooterBalanceController {

    constructor({
        game,
        config,
        autoEnable = true
    }) {
        super({ game, autoEnable, config: {
            coin: {
                sum: false,
                bet: false
            }
        }})
 
        this.config = defaultsDeep(config, defaultConfig)

        this.machine    = this.level.machine
        this.machineBal = this.machine.panel.balance

        if (autoEnable) this.enable()
    }

    enable() {
        super.enable()
        
        // Panel Balance
        // Lines
        if (this.config.lines)
        this.subs.push(
        this.linesSub = this.data.lines$
            .subscribe(e => this.machineBal.lines.set(e.length)))
        
        // Level
        if (this.config.level)
        this.subs.push(
        this.levelSub = this.balance.level.current$
            .subscribe(e => this.machineBal.level.set(e)))                

        // Value
        if (this.config.value)
        this.subs.push(
        this.valueSub = this.balance.value.current$
            .subscribe(e => this.machineBal.value.set(e / 100)))
        
        // Coin Bet
        if (this.config.coin.bet)
        this.subs.push(
        this.coinBetSub = this.balance.coin.bet$
            .subscribe(e => this.machineBal.bet.set(e)))
        
        // Coin Sum
        if (this.config.coin.sum)
        this.subs.push(
        this.coinSumStartSub = this.balance.coin.sum$
            .filter(e => !this.state.isRolling)
            .subscribe(e => this.machineBal.sum.set(e)))
        
        // Coin Sum at the Roll End
        if (this.config.coin.sum)
        this.subs.push(
        this.coinSumEndSub = this.balance.coin.sum$
            .filter(e => this.state.isRolling)
            .sample(this.state.isRolling$)
            .subscribe(e => this.machineBal.sum.set(e)))
    }

}

export { DesktopBalanceController }