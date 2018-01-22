import defaultsDeep from 'lodash.defaultsdeep'

// Balance Controller
const defaultConfig = {
    level: {
        current: true,
        up: true,
        bottom: true,
        min: true,
        max: true
    },
    value: {
        current: true,
        up: true,
        bottom: true,
        min: true,
        max: true
    },
    bind: {
        coin: {
            bet: true,
            sum: true
        },
        cash: {
            bet: true
        }
    }
}

class BalanceController {

    constructor({
        game,
        config,
        autoEnable = true
    }) {
        this.config = defaultsDeep(config, defaultConfig)
        
        this.game  = game
        this.data  = game.data
        this.balance = this.data.balance

        if (autoEnable) this.enable()
    }

    enable() {
        this.enableLevel()
        this.enableValue()
        this.enableBindings()
    }

    disable() {
        this.disableLevel()
        this.disableValue()
        this.disableBindings()
    }

    enableValue() {
        this.valueSubs = []

        // Current Value
        if (this.config.value.current)
        this.valueSubs.push(
        this.valueCurrentSub = this.balance.value.index$
            .subscribe(i => this.balance.value.current = this.balance.value.arr[i]))
        
        // Up stoppers
        if (this.config.value.up)
        this.valueSubs.push(
        this.valueUpStopSub = this.balance.value.index$
            .filter(i => i > this.balance.value.arr.length - 1)
            .subscribe(i => this.balance.value.index = this.balance.value.arr.length - 1))

        // Bottom stoppers
        if (this.config.value.bottom)
        this.valueSubs.push(
        this.valueBottomStopSub = this.balance.value.index$
            .filter(i => i < 0)
            .subscribe(i => this.balance.value.index = 0))

        // Min logic
        if (this.config.value.min)  
        this.valueSubs.push(
        this.valueMinSub = this.balance.value.index$
            .subscribe(i => {
                if (i === 0)
                    this.balance.value.min = true
                else
                    this.balance.value.min = false
            }))

        // Max logic
        if (this.config.value.max)  
        this.valueSubs.push(
        this.valueMaxSub = this.balance.value.index$
            .subscribe(i => {
                if (i === this.balance.value.arr.length - 1)
                    this.balance.value.max = true
                else
                    this.balance.value.max = false
            }))
    
    }

    enableLevel() {
        this.levelSubs = []

        // Current Level
        if (this.config.level.current)
        this.levelSubs.push(
        this.levelCurrentSub = this.balance.level.index$
            .subscribe(i => this.balance.level.current = this.balance.level.arr[i]))

        // Up stoppers
        if (this.config.level.up)        
        this.levelSubs.push(
        this.levelUpStopSub = this.balance.level.index$
            .filter(i => i > this.balance.level.arr.length - 1)
            .subscribe(i => this.balance.level.index = this.balance.level.arr.length - 1))

        // Bottom stoppers
        if (this.config.level.bottom)        
        this.levelSubs.push(
        this.levelBottomStopSub = this.balance.level.index$
            .filter(i => i < 0)
            .subscribe(i => this.balance.level.index = 0))

        // Min logic
        if (this.config.level.min)  
        this.levelSubs.push(
        this.levelMinSub = this.balance.level.index$
            .subscribe(i => {
                if (i === 0)
                    this.balance.level.min = true
                else
                    this.balance.level.min = false
            }))

        // Max logic
        if (this.config.level.max)  
        this.levelSubs.push(
        this.levelMaxSub = this.balance.level.index$
            .subscribe(i => {
                if (i === this.balance.level.arr.length - 1)
                    this.balance.level.max = true
                else
                    this.balance.level.max = false
            }))
        
    }

    enableBindings() {
        this.bindSubs = []

        // Change level => change Coin Bet
        if (this.config.bind.coin.bet)        
        this.bindSubs.push(
        this.coinBetSub = this.balance.level.current$
            .subscribe(level => this.balance.coin.bet = level * this.data.lines.length))
        
        // Change value => change Coin Sum
        if (this.config.bind.coin.sum)
        this.bindSubs.push(
        this.coinSumSub = this.balance.value.current$
            .subscribe(value => this.balance.coin.sum = Math.floor(this.balance.cash.sum * 100 / value)))
        
        // Change level or value => change Cash Bet
        if (this.config.bind.cash.bet)                
        this.bindSubs.push(
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

    disableBindings() {
        this.bindSubs.forEach(s => s.unsubscribe())                
    }

}

export { BalanceController }