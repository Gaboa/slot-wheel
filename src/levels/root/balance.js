import defaultsDeep from 'lodash.defaultsdeep'

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

        this.enable()
    }

    enable() {
        this.enableLevel()
        this.enableValue()
        this.enableLevelValueBindings()
    }

    disable() {
        this.disableLevel()
        this.disableValue()
        this.disableLevelValueBindings()
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

export { BalanceController }