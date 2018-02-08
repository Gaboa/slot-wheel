import { DesktopBalanceController } from './desktop'
import { FooterBalanceController } from './footer'
import defaultsDeep from 'lodash.defaultsdeep'

const defaultConfig = {
    bet: true,
    level: true,
    value: true,
    sum: true,
    win: {
        cash: true,
        coin: true,
        total: true
    }
}

export class FSDesktopBalanceController {
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

    enable(){
        this.subs = []

        if (this.config.bet)
        this.subs.push(
        this.betSub = this.balance.coin.bet$
            .subscribe(e => this.panel.bet.set(e)))

        if (this.config.level)
        this.subs.push(
        this.levelSub = this.balance.level.current$
            .subscribe(e => this.panel.level.set(e)))

        if (this.config.value)
        this.subs.push(
        this.valueSub = this.balance.value.current$
            .subscribe(e => this.panel.value.set(e / 100)))

        if (this.config.sum)
        this.subs.push(
        this.sumSub = this.balance.coin.sum$
            .subscribe(e => this.panel.sum.set(e)))

        if (this.config.win.coin)
        this.subs.push(
        this.winCoinSub = this.data.fs.win.coin$
            .sample(this.state.isRolling$)
            .subscribe(e => this.panel.win.set(e)))

        if (this.config.win.cash)
        this.subs.push(
        this.winCashSub = this.data.fs.total.cash$
            .sample(this.state.isRolling$)
            .subscribe(e => this.level.footer.balance.bottom.right.set(e)))

        if (this.config.win.total)
        this.subs.push(
        this.winTotalSub = this.data.fs.total.coin$
            .sample(this.state.isRolling$)
            .subscribe(e => this.panel.total.set(e)))
    }

    disable(){
        this.subs.forEach(sub => sub.unsubscribe())
    }
}

const defaultMobileConfig = {
    fs: {
        win: {
            coin: true
        },
        total: {
            cash: true,
            coin: true
        }
    }
}

export class FSMobileBalanceController extends FooterBalanceController {
    constructor({
        game,
        config,
        autoEnable =  true
    }){
        super({
            game,
            config: defaultsDeep(config, defaultMobileConfig, {
                coin: {sum: { idle: false, end: false }},
                cash: {win: { idle: false, end: false }}
            }),
            autoEnable
        })
    }

    enable(){
        super.enable()

        if(this.config.fs.win.coin)
        this.subs.push(
        this.fsWinCoinSub = this.data.fs.win.coin$
            .sample(this.state.isRolling$)
            .subscribe(e => this.top.right.set(e)))

        if(this.config.fs.total.coin)
        this.subs.push(
        this.fsTotalCoinSub = this.data.fs.total.coin$
            .sample(this.state.isRolling$)
            .subscribe(e => this.top.left.set(e)))

        if(this.config.fs.total.cash)
        this.subs.push(
        this.fsTotalCashSub = this.data.fs.total.cash$
            .sample(this.state.isRolling$)
            .subscribe(e => this.bottom.right.set(e)))
    }
}