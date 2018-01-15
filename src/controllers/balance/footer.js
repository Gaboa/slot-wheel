import defaultsDeep from 'lodash.defaultsdeep'

const defaultConfig = {
    currency: true,
    coin: {
        sum: true,
        bet: true
    },
    cash: {
        sum: true,
        bet: true,
        win: true
    }
}

class FooterBalanceController {

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
        this.footer  = this.level.footer
        this.top     = this.footer.balance.top
        this.bottom  = this.footer.balance.bottom

        if (autoEnable) this.enable()
    }

    enable() {
        this.subs = []

        // Currency
        if (this.config.currency)
        this.subs.push(
        this.currencySub = this.balance.currency$
            .subscribe(e => this.footer.balance.setCurrency(e)))

        // Top
        // Coin Sum
        if (this.config.coin.sum)
        this.subs.push(
        this.coinSumStartSub = this.balance.coin.sum$
            .filter(e => !this.state.isRolling)
            .subscribe(e => this.top.left.set(e)))

        // Coin Sum at the Roll End
        if (this.config.coin.sum)
        this.subs.push(
        this.coinSumEndSub = this.balance.coin.sum$
            .filter(e => this.state.isRolling)
            .sample(this.state.isRolling$)
            .subscribe(e => this.top.left.set(e)))

        // Coin Bet
        if (this.config.coin.bet)
        this.subs.push(
        this.coinBetSub = this.balance.coin.bet$
            .subscribe(e => this.top.right.set(e)))

        // Bottom
        // Cash Sum
        if (this.config.cash.sum)
        this.subs.push(
        this.cashSumStartSub = this.balance.cash.sum$
            .filter(e => !this.state.isRolling)
            .subscribe(e => this.bottom.left.set(e)))

        // Cash Sum at the Roll End
        if (this.config.cash.sum)
        this.subs.push(
        this.cashSumEndSub = this.balance.cash.sum$
            .filter(e => this.state.isRolling)
            .sample(this.state.isRolling$)
            .subscribe(e => this.bottom.left.set(e)))

        // Cash Bet
        if (this.config.cash.bet)
        this.subs.push(
        this.cashBetSub = this.balance.cash.bet$
            .subscribe(e => this.bottom.center.set(e)))

        // Cash Win
        if (this.config.cash.win)
        this.subs.push(
        this.cashWinStartSub = this.balance.cash.win$
            .filter(e => !this.state.isRolling)
            .subscribe(e => this.bottom.right.set(e)))
        
        // Cash Win at the Roll End
        if (this.config.cash.win)
        this.subs.push(
        this.cashWinEndSub = this.balance.cash.win$
            .filter(e => this.state.isRolling)
            .sample(this.state.isRolling$)
            .subscribe(e => this.bottom.right.set(e)))

    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

}

export { FooterBalanceController }