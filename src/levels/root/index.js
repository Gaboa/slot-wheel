import defaultsDeep from 'lodash.defaultsdeep'
import { Subject, Observable } from "rxjs"
import { Container, Sprite } from "../../utils"
import { Machine, Footer } from '../../components'
import { Darkness } from "../preload/helpers"
import { BalanceController } from './balance'

// TODO: Create balance bindings for different modes ( FS FR Bonus )
// TODO: Add Spine helper class
// TODO: Check index switching bug in Screen

class Root extends Container {

    constructor({
        game,
        config
    }) {
        super({ container: game.stage, x: 0.5, y: 0.5 })
        
        this.game  = game
        this.data  = game.data
        this.state = game.state

        this.bg = new Sprite({
            container: this,
            texture: 'preload_bg',
            name: 'bg'
        })

        this.machine = new Machine({
            container: this,
            y: -0.05
        })

        this.footer = new Footer({
            container: this
        })

        this.darkness = new Darkness({
            container: this,
            autoHide:  true
        })

        setTimeout(() => this.enable(), 0)
    }
    
    enable() {
        this.balance = new BalanceController({ game: this.game })
        this.root    = new RootController({ game: this.game })
    }

    disable() {
        this.balance.disable()
        this.root.disable()
    }

}

const defaultRootConfig = {
    footer: {
        home: true,
        settings: true,
        info: true,
        sound: true,
        fast: true,
        fullscreen: true
    },
    panel: {
        level: {
            minus: true,
            plus: true,
            min: true,
            max: true
        },
        value: {
            minus: true,
            plus: true,
            min: true,
            max: true
        },
        auto: true,
        spin: true,
        max: true
    },
    balance: {
        currency: true,
        cash: {
            sum: true,
            bet: true,
            win: true
        },
        coin: {
            sum: true,
            bet: true,
            win: true
        },
        level: true,
        value: true,
        lines: true
    },
    logic: {
        screen: {
            start: true,
            end: true,
            data: true
        },
        idle: true,
        rolling: true,
        lines: true,
        table: true
    }
}

class RootController {

    constructor({
        game,
        config
    }) {
        this.config = defaultsDeep(config, defaultRootConfig)

        this.game  = game
        this.level = game.level
        this.data  = game.data
        this.state = game.state
        this.balance = this.data.balance
        this.footer  = this.level.footer
        this.machine = this.level.machine

        this.enable()
    }

    enable() {
        this.enableButtons()
        this.enableBalance()
        this.enableLogic()
    }

    disable() {
        this.disableButtons()
        this.disableBalance()
        this.disableLogic()        
    }

    enableButtons() {
        this.buttonsSubs = []

        // Spin
        if (this.config.panel.spin)
        this.buttonsSubs.push(
        this.spinSub = this.machine.panel.buttons.spin.down$
            .subscribe(e => this.machine.screen.roll()))
        
        // Auto
        if (this.config.panel.auto)
        this.buttonsSubs.push(
        this.autoSub = this.machine.panel.buttons.auto.down$
            .subscribe(e => e))

        // Max
        if (this.config.panel.max)        
        this.buttonsSubs.push(
        this.maxSub = this.machine.panel.buttons.max.down$
            .subscribe(e => this.balance.level.index = this.balance.level.arr.length - 1))
        
        // Level - Plus / Minus
        if (this.config.panel.level.minus)        
        this.buttonsSubs.push(
        this.levelMinusSub = this.machine.panel.buttons.level.minus.down$
            .subscribe(e => this.balance.level.index--))
        
        if (this.config.panel.level.plus)                
        this.buttonsSubs.push(
        this.levelPlusSub = this.machine.panel.buttons.level.plus.down$
            .subscribe(e => this.balance.level.index++))

        // Value - Plus / Minus
        if (this.config.panel.value.minus)                
        this.buttonsSubs.push(
        this.valueMinusSub = this.machine.panel.buttons.value.minus.down$
            .subscribe(e => this.balance.value.index--))
        
        if (this.config.panel.value.plus)                
        this.buttonsSubs.push(
        this.valuePlusSub = this.machine.panel.buttons.value.plus.down$
            .subscribe(e => this.balance.value.index++))
        
        // Min / Max stoppers for balance buttons
        if (this.config.panel.value.max)                        
        this.buttonsSubs.push(
        this.valueMaxSub = this.balance.value.max$
            .subscribe(e => this.machine.panel.buttons.value.plus.max(e)))
        
        if (this.config.panel.value.min)                                
        this.buttonsSubs.push(
        this.valueMinSub = this.balance.value.min$
            .subscribe(e => this.machine.panel.buttons.value.minus.min(e)))
        
        if (this.config.panel.level.max)                                
        this.buttonsSubs.push(
        this.levelMaxSub = this.balance.level.max$
            .subscribe(e => {
                this.machine.panel.buttons.level.plus.max(e)
                this.machine.panel.buttons.max.max(e)
            }))
        
        if (this.config.panel.level.min)                                        
        this.buttonsSubs.push(
        this.levelMinSub = this.balance.level.min$
            .subscribe(e => this.machine.panel.buttons.level.minus.min(e)))
        
        // Footer
        this.enableFooterButtons()
    }

    enableFooterButtons() {
        // Home
        // TODO: Add logic with redirect to homeUrl
        if (this.config.footer.home)
        this.buttonsSubs.push(
        this.homeSub = this.footer.buttons.home.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => this.game.request.sendLogout()))

        // Settings
        if (this.config.footer.settings)
        this.buttonsSubs.push(
        this.settingsSub = this.footer.buttons.settings.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => e))

        // Info
        if (this.config.footer.info)
        this.buttonsSubs.push(
        this.infoSub = this.footer.buttons.info.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => e))

        // Sound
        if (this.config.footer.sound)
        this.buttonsSubs.push(
        this.soundSub = this.footer.buttons.sound.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => this.state.settings.isSound = !this.state.settings.isSound))
        
        if (this.config.footer.sound)        
        this.buttonsSubs.push(
        this.soundStateSub = this.state.settings.isSound$
            .subscribe(e => this.footer.buttons.sound.to(e)))

        // Fast
        if (this.config.footer.fast)
        this.buttonsSubs.push(
        this.fastSub = this.footer.buttons.fast.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => this.state.settings.isFast = !this.state.settings.isFast))
        
        if (this.config.footer.fast)
        this.buttonsSubs.push(
        this.fastStateSub = this.state.settings.isFast$
            .subscribe(e => {
                this.footer.buttons.fast.to(e)
                this.machine.screen.setRollSpeed(this.machine.screen.config.roll[e ? 'fast' : 'normal'])
            }))                        

        // Fullscreen
        if (this.config.footer.fullscreen)
        this.buttonsSubs.push(
        this.fullscreenSub = this.footer.buttons.fullscreen.$
            .filter(e => e.type === 'DOWN')
            .subscribe(e => this.state.settings.isFullscreen = !this.state.settings.isFullscreen))

        if (this.config.footer.fullscreen)
        this.buttonsSubs.push(
        this.fullscreenStateSub = this.state.settings.isFullscreen$
            .subscribe(e => {
                this.footer.buttons.fullscreen.to(e)
                this.game.device[`${e ? 'enter' : 'cancel'}Fullscreen`]()
            }))
        
    }

    enableBalance() {
        this.balanceSubs = []

        // Footer Balance
        if (this.config.balance.currency)
        this.balanceSubs.push(
        this.currencySub = this.data.balance.currency$
            .subscribe(e => this.footer.balance.setCurrency(e)))
        
        // Cash Sum
        if (this.config.balance.cash.sum)
        this.balanceSubs.push(
        this.cashSumStartSub = this.data.balance.cash.sum$
            .filter(e => !this.state.isRolling)
            .subscribe(e => this.footer.balance.bottom.left.set(e)))
        
        if (this.config.balance.cash.sum)
        this.balanceSubs.push(
        this.cashSumEndSub = this.data.balance.cash.sum$
            .filter(e => this.state.isRolling)
            .sample(this.state.isRolling$)
            .subscribe(e => this.footer.balance.bottom.left.set(e)))
        
        // Cash Bet
        if (this.config.balance.cash.bet)
        this.balanceSubs.push(
        this.cashBetSub = this.data.balance.cash.bet$
            .subscribe(e => this.footer.balance.bottom.center.set(e)))
        
        // Cash Win
        if (this.config.balance.cash.win)
        this.balanceSubs.push(
        this.cashWinStartSub = this.data.balance.cash.win$
            .filter(e => !this.state.isRolling)
            .subscribe(e => this.footer.balance.bottom.right.set(e)))
        
        if (this.config.balance.cash.win)
        this.balanceSubs.push(
        this.cashWinEndSub = this.data.balance.cash.win$
            .filter(e => this.state.isRolling)
            .sample(this.state.isRolling$)
            .subscribe(e => this.footer.balance.bottom.right.set(e)))

        // Panel Balance bindings
        if (this.config.balance.lines)
        this.balanceSubs.push(
        this.linesSub = this.data.lines$
            .subscribe(e => this.machine.panel.balance.lines.set(e.length)))
        
        if (this.config.balance.level)
        this.balanceSubs.push(
        this.levelSub = this.data.balance.level.current$
            .subscribe(e => this.machine.panel.balance.level.set(e)))                

        if (this.config.balance.value)
        this.balanceSubs.push(
        this.valueSub = this.data.balance.value.current$
            .subscribe(e => this.machine.panel.balance.value.set(e / 100)))
        
        if (this.config.balance.coin.bet)
        this.balanceSubs.push(
        this.coinBetSub = this.data.balance.coin.bet$
            .subscribe(e => this.machine.panel.balance.bet.set(e)))
        
        // Coin Sum
        if (this.config.balance.coin.sum)
        this.balanceSubs.push(
        this.coinSumStartSub = this.data.balance.coin.sum$
            .filter(e => !this.state.isRolling)
            .subscribe(e => this.machine.panel.balance.sum.set(e)))
        
        if (this.config.balance.coin.sum)
        this.balanceSubs.push(
        this.coinSumEndSub = this.data.balance.coin.sum$
            .filter(e => this.state.isRolling)
            .sample(this.state.isRolling$)
            .subscribe(e => this.machine.panel.balance.sum.set(e)))
        
    }

    enableLogic() {
        this.logicSubs = []

        if (this.config.logic.screen.start)
        this.logicSubs.push(
        this.screenStartSub = this.machine.screen.$
            .filter(e => e.from  === 'SCREEN')
            .filter(e => e.state === 'START')
            .subscribe(e => {
                this.game.request.sendRoll({
                    value: this.data.balance.value.current,
                    level: this.data.balance.level.current
                })
                this.level.balance.start()
                this.state.isRolling = true
            }))

        if (this.config.logic.screen.end)
        this.logicSubs.push(
        this.screenEndSub = this.machine.screen.$
            .filter(e => e.from  === 'SCREEN')
            .filter(e => e.state === 'END')
            .subscribe(e => {
                this.level.balance.end()
                this.state.isRolling = false
            }))

        if (this.config.logic.screen.data)
        this.logicSubs.push(
        this.screenDataStartSub = this.data.screen$
            .filter(e => Array.isArray(e))
            .take(1)
            .subscribe(s => this.machine.screen.setStartScreen(s)))

        if (this.config.logic.screen.data)
        this.logicSubs.push(
        this.screenDataEndSub = this.data.screen$
            .filter(e => Array.isArray(e))
            .skip(1)
            .subscribe(s => this.machine.screen.setEndScreen(s)))
        
        if (this.config.logic.idle)
        this.logicSubs.push(
        this.idleTrueSub = this.state.isIdle$
            .filter(e => e)
            .subscribe(e => {
                this.machine.panel.buttons.enableAll()
                this.footer.buttons.settings.enable()
                this.footer.buttons.info.enable()
            }))

        if (this.config.logic.idle)
        this.logicSubs.push(
        this.idleFalseSub = this.state.isIdle$
            .filter(e => !e)
            .subscribe(e => {
                this.machine.panel.buttons.disableAll()
                this.footer.buttons.settings.disable()
                this.footer.buttons.info.disable()
            }))

        // Changing isIdle State
        if (this.config.logic.rolling)
        this.logicSubs.push(
        this.rollingTrueSub = this.state.isRolling$
            .filter(e => e) // Start of roll
            .subscribe(e => this.state.isIdle = false))
        
        if (this.config.logic.rolling)
        this.logicSubs.push(
        this.rollingFalseSub = this.state.isRolling$
            .filter(e => !e) // End of roll
            .filter(e => !this.state.isAutoplay) // Not Autoplay
            .filter(e => this.state.next === 'root') // Next is Root
            .subscribe(e => this.state.isIdle = true))

        if (this.config.logic.rolling)
        this.logicSubs.push(
        this.rollingTransitionSub = this.state.isRolling$
            .filter(e => !e) // End of roll
            .filter(e => this.state.next !== 'root') // Next is not Root
            .subscribe(e => this.state.isTransition = true))

        // Lines on Numbers Hover
        if (this.config.logic.lines)
        this.logicSubs.push(
        this.linesOverSub = this.machine.numbers.$
            .filter(e => e.type === 'OVER')
            .map(e => e.num)
            .subscribe(e => this.machine.lines.show(e)))

        if (this.config.logic.lines)
        this.logicSubs.push(
        this.linesOutSub = this.machine.numbers.$
            .filter(e => e.type === 'OUT')
            .map(e => e.num)
            .subscribe(e => this.machine.lines.hide(e)))
        
        // Win Table Show and Hide
        if (this.config.logic.table)
        this.logicSubs.push(
        this.tableShowSub = this.balance.coin.win$
            .filter(e => e)
            .sample(this.state.isRolling$)
            .subscribe(e => this.machine.table.show(e)))

        if (this.config.logic.table)
        this.logicSubs.push(
        this.tableShowSub = this.state.isRolling$
            .filter(e => e)
            .subscribe(e => this.machine.table.hide()))
        
    }

    disableButtons() {
        this.buttonsSubs.forEach(s => s.unsubscribe())
    }

    disableBalance() {
        this.balanceSubs.forEach(s => s.unsubscribe())
    }

    disableLogic() {
        this.logicSubs.forEach(s => s.unsubscribe())
    }

}

export { Root }