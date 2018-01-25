import defaultsDeep from 'lodash.defaultsdeep'

const defaultConfig = {
    currency: true,
    coin: {
        sum: {
            idle: true,
            end: true
        },
        bet: true
    },
    cash: {
        sum: {
            idle: true,
            end: true
        },
        bet: true,
        win: {
            idle: true,
            end: true
        }
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
        if (this.config.coin.sum.idle)
        this.subs.push(
        this.coinSumIdleSub = this.balance.coin.sum$
            .filter(e => !this.state.isRolling)
            .subscribe(e => this.top.left.set(e)))

        // Coin Sum at the Roll End
        if (this.config.coin.sum.end)
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
        if (this.config.cash.sum.idle)
        this.subs.push(
        this.cashSumIdleSub = this.balance.cash.sum$
            .filter(e => !this.state.isRolling)
            .subscribe(e => this.bottom.left.set(e)))

        // Cash Sum at the Roll End
        if (this.config.cash.sum.end)
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
        if (this.config.cash.win.idle)
        this.subs.push(
        this.cashWinIdleSub = this.balance.cash.win$
            .filter(e => !this.state.isRolling)
            .subscribe(e => this.bottom.right.set(e)))
        
        // Cash Win at the Roll End
        if (this.config.cash.win.end)
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

const defaultFRConfig = {
    changeAffixes: true,
    win: {
        cash: true,
        coin: true
    },
    count: true
}

class FRFooterBalanceController extends FooterBalanceController {
    constructor({
        game,
        frConfig,
        config = {},
        autoEnable = true
    }) {
        super({
            game,
            config: Object.assign(config, {
                coin: {
                    sum: {
                        idle: false,
                        end: false
                    }
                },
                cash: {
                    sum: {
                        idle: false,
                        end: false
                    },
                    win: {
                        idle: false,
                        end: false
                    }
                }
            }),
            autoEnable: false
        })

        this.frConfig = defaultsDeep(frConfig, defaultFRConfig)

        if (autoEnable) this.enable()
    }

    enable() {
        super.enable()

        if (this.frConfig.changeAffixes)
        this.changeAffixesToFR()

        if (this.frConfig.win.coin)
        this.subs.push(
        this.winCoinSub = this.data.fr.win.coin$
            .sample(this.state.isRolling$)
            .subscribe(e => this.top.left.set(e)))

        if (this.frConfig.win.cash)
        this.subs.push(
        this.winCashSub = this.data.fr.win.cash$
            .sample(this.state.isRolling$)
            .subscribe(e => this.bottom.right.set(e)))

        if (this.frConfig.count)
        this.subs.push(
        this.countSub = this.data.fr.count$
            .sample(this.state.isRolling$)
            .subscribe(e => this.bottom.left.set(e)))
    }

    changeAffixesToFR() {
        this.bottom.left.prefix = 'Free Rounds: '
        this.bottom.left.suffix = ''
        this.bottom.left.fixed = 0

        this.bottom.right.prefix = 'Total Win: '
    }

    changeAffixesToDefault() {
        this.bottom.left.prefix = 'Cash: '
        this.footer.balance.setCurrency(this.balance.currency)
        this.bottom.left.fixed = 2

        this.bottom.right.prefix = 'Win: '
    }

    disable() {
        super.disable()

        if (this.frConfig.changeAffixes)
        this.changeAffixesToDefault()
    }

}

export { FooterBalanceController, FRFooterBalanceController }