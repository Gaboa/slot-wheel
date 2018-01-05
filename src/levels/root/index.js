import defaultsDeep from 'lodash.defaultsdeep'
import { Subject, Observable } from "rxjs"
import { Container, Sprite } from "../../utils"
import { Machine, Footer } from '../../components'
import { Darkness } from "../preload/helpers"
import { BalanceController } from './balance'

// TODO: Create balance bindings for different modes ( FS FR Bonus )
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
            y: -0.05,
            config: {
                lines:   game.data.lines,
                symbols: game.data.symbols
            }
        })

        this.footer = new Footer({
            container: this
        })
        this.footer.bg.top.visible = false
        this.footer.balance.top.visible = false

        this.darkness = new Darkness({
            container: this,
            autoHide:  true
        })

        setTimeout(() => this.enable(), 0)
    }
    
    enable() {
        this.balance = new BalanceController({ game: this.game })
        this.balance.root = new RootBalanceController({ game: this.game })
        this.buttons = new ButtonsController({ game: this.game })
        this.ctrl    = new RootController({ game: this.game })
        this.win     = new RootWinController({ game: this.game })
        this.auto    = new AutoplayController({ game: this.game })
    }

    disable() {
        this.balance.disable()
        this.ctrl.disable()
    }

}

const defaultRootConfig = {
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
        config,
        autoEnable = true
    }) {
        this.config = defaultsDeep(config, defaultRootConfig)

        this.game  = game
        this.level = game.root
        this.data  = game.data
        this.state = game.state
        this.balance = this.data.balance
        this.footer  = this.level.footer
        this.machine = this.level.machine

        if (autoEnable) this.enable()        
    }

    enable() {
        this.enableLogic()
    }

    disable() {
        this.disableLogic()        
    }

    enableLogic() {
        this.logicSubs = []

        // Roll Start and End
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


        // Set Start and End Screens
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
        

        // Changing buttons states with isIdle state
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


        // Changing isIdle and isTransition State
        if (this.config.logic.rolling)
        this.logicSubs.push(
        this.rollingTrueSub = this.state.isRolling$
            .filter(e => e) // Start of roll
            .subscribe(e => this.state.isIdle = false))
        
        if (this.config.logic.rolling)
        this.logicSubs.push(
        this.rollingFalseSub = this.state.isRolling$
            .filter(e => !e) // End of roll
            .filter(e => !this.state.autoplay) // Not Autoplay
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
            .subscribe(e => this.machine.lines.show(e.num)))

        if (this.config.logic.lines)
        this.logicSubs.push(
        this.linesOutSub = this.machine.numbers.$
            .filter(e => e.type === 'OUT')
            .subscribe(e => this.machine.lines.hide(e.num)))
        

        
        
    }

    disableLogic() {
        this.logicSubs.forEach(s => s.unsubscribe())
    }

}

const defaultButtonsConfig = {
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
        item: true,
        spin: true,
        anim: true,
        stop: true,
        max:  true
    },
}

class ButtonsController {

    constructor({
        game,
        config,
        autoEnable = true
    }) {
        this.config = defaultsDeep(config, defaultButtonsConfig)
        this.game  = game

        if (autoEnable) this.enable()        
    }

    enable() {
        this.panel  = new PanelButtonsController({
            game: this.game,
            config: this.config.panel
        }) 
        this.footer = new FooterButtonsController({
            game: this.game,
            config: this.config.footer
        })
    }

    disable() {
        this.panel.disable()
        this.footer.disable()
    }

}

class FooterButtonsController {
    
    constructor({
        game,
        config,
        autoEnable = true
    }) {
        this.config = defaultsDeep(config, defaultButtonsConfig.footer)

        this.game = game
        this.buttons  = game.root.footer.buttons
        this.screen   = game.root.machine.screen
        this.settings = game.state.settings

        if (autoEnable) this.enable()        
    }

    enable() {
        this.subs = []

        // Home
        // TODO: Add handling homeUrl
        if (this.config.home)
        this.subs.push(
        this.homeSub = this.buttons.home.down$
            .subscribe(e => this.game.request.sendLogout()))

        // TODO: Some Settings bindings
        if (this.config.settings)
        this.subs.push(
        this.settingsSub = this.buttons.settings.down$
            .subscribe(e => e))

        // TODO: Some Info bindings
        if (this.config.info)
        this.subs.push(
        this.infoSub = this.buttons.info.down$
            .subscribe(e => e))

        // Sound
        if (this.config.sound)
        this.subs.push(
        this.soundSub = this.buttons.sound.down$
            .subscribe(e => this.settings.isSound = !this.settings.isSound))
        
        if (this.config.sound)        
        this.subs.push(
        this.soundStateSub = this.settings.isSound$
            .subscribe(e => this.buttons.sound.to(e)))

        // Fast
        if (this.config.fast)
        this.subs.push(
        this.fastSub = this.buttons.fast.down$
            .subscribe(e => this.settings.isFast = !this.settings.isFast))
        
        if (this.config.fast)
        this.subs.push(
        this.fastStateSub = this.settings.isFast$
            .subscribe(e => {
                this.buttons.fast.to(e)
                // ??? Where must be this part of logic
                this.screen.setRollSpeed(this.screen.config.roll[e ? 'fast' : 'normal'])
            }))                        

        // Fullscreen
        if (this.config.fullscreen)
        this.subs.push(
        this.fullscreenSub = this.buttons.fullscreen.down$
            .subscribe(e => this.settings.isFullscreen = !this.settings.isFullscreen))

        if (this.config.fullscreen)
        this.subs.push(
        this.fullscreenStateSub = this.settings.isFullscreen$
            .subscribe(e => {
                this.buttons.fullscreen.to(e)
                // ??? Where must be this part of logic
                this.game.device[`${e ? 'enter' : 'cancel'}Fullscreen`]()
            }))

    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

}

class PanelButtonsController {

    constructor({
        game,
        config,
        autoEnable = true
    }) {
        this.config = defaultsDeep(config, defaultButtonsConfig.panel)

        this.game = game
        this.level = game.root
        this.data  = game.data
        this.state = game.state
        this.balance = this.data.balance
        this.machine = this.level.machine
        this.buttons = this.machine.panel.buttons

        if (autoEnable) this.enable()
    }

    enable() {
        this.subs = []

        // Spin
        if (this.config.spin)
        this.subs.push(
        this.spinSub = this.buttons.spin.down$
            .merge(Observable.fromEvent(document, 'keyup')
                .filter(e => this.buttons.spin.enabled)
                .map(e => String(e.code).toUpperCase())
                .filter(code => code === 'SPACE'))
            .subscribe(e => this.machine.screen.roll()))
        
        // Anim of center button
        if (this.config.anim)
        this.subs.push(
        this.animStartSub = this.buttons.anim.$
            .filter(e => e.type === 'START')
            .subscribe(e => this.buttons.changeButtonTo('anim')))

        if (this.config.anim)
        this.subs.push(
        this.animCompleteSub = this.buttons.anim.$
            .filter(e => e.type === 'COMPLETE')
            .map(e => e.anim.split('_')[1])
            .subscribe(state => this.buttons.changeButtonTo(state)))

        if (this.config.anim)
        this.subs.push(
        this.animStateSub = this.state.button$
            .subscribe(e => this.buttons.changeTo(e)))

        // Auto Button
        if (this.config.auto)
        this.subs.push(
        this.autoSub = this.buttons.auto.down$
            .throttleTime(1500)
            .subscribe(e => this.state.button = (this.state.button === 'spin')
                ? this.state.button = 'auto'
                : this.state.button = 'spin' ))

        // AutoItem in AutoPanel
        if (this.config.item)
        this.subs.push(
        this.autoItemSub = this.buttons.panel.$
            .throttleTime(1500)
            .map(e => e.value)
            .subscribe(value => {
                this.state.button = 'stop'
                this.state.autoplay = value
            }))

        // Stop Button
        if (this.config.stop)
        this.subs.push(
        this.stopSub = this.buttons.stop.down$
            .subscribe(e => {
                this.state.button = 'spin'
                this.state.autoplay = null
            }))

        // Max
        if (this.config.max)        
        this.subs.push(
        this.maxSub = this.buttons.max.down$
            .subscribe(e => this.balance.level.index = this.balance.level.arr.length - 1))
        
        // Level - Plus / Minus
        if (this.config.level.minus)        
        this.subs.push(
        this.levelMinusSub = this.buttons.level.minus.down$
            .merge(Observable.fromEvent(document, 'keyup')
                .filter(e => this.buttons.level.minus.enabled)
                .map(e => String(e.code).toUpperCase())
                .filter(code => code === 'ARROWDOWN'))
            .subscribe(e => this.balance.level.index--))
        
        if (this.config.level.plus)                
        this.subs.push(
        this.levelPlusSub = this.buttons.level.plus.down$
            .merge(Observable.fromEvent(document, 'keyup')
                .filter(e => this.buttons.level.plus.enabled)
                .map(e => String(e.code).toUpperCase())
                .filter(code => code === 'ARROWUP'))
            .subscribe(e => this.balance.level.index++))

        // Value - Plus / Minus
        if (this.config.value.minus)                
        this.subs.push(
        this.valueMinusSub = this.buttons.value.minus.down$
            .merge(Observable.fromEvent(document, 'keyup')
                .filter(e => this.buttons.value.minus.enabled)
                .map(e => String(e.code).toUpperCase())
                .filter(code => code === 'ARROWLEFT'))
            .subscribe(e => this.balance.value.index--))
        
        if (this.config.value.plus)                
        this.subs.push(
        this.valuePlusSub = this.buttons.value.plus.down$
            .merge(Observable.fromEvent(document, 'keyup')
                .filter(e => this.buttons.value.plus.enabled)
                .map(e => String(e.code).toUpperCase())
                .filter(code => code === 'ARROWRIGHT'))
            .subscribe(e => this.balance.value.index++))
        
        // Min / Max stoppers for value buttons
        if (this.config.value.max)                        
        this.subs.push(
        this.valueMaxSub = this.balance.value.max$
            .subscribe(e => this.buttons.value.plus.max(e)))
        
        if (this.config.value.min)                                
        this.subs.push(
        this.valueMinSub = this.balance.value.min$
            .subscribe(e => this.buttons.value.minus.min(e)))
        
        // Min / Max stoppers for level buttons
        if (this.config.level.max)                                
        this.subs.push(
        this.levelMaxSub = this.balance.level.max$
            .subscribe(e => {
                this.buttons.level.plus.max(e)
                this.buttons.max.max(e)
            }))
        
        if (this.config.level.min)                                        
        this.subs.push(
        this.levelMinSub = this.balance.level.min$
            .subscribe(e => this.buttons.level.minus.min(e)))
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())        
    }

}

const defaultRootBalanceConfig = {
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
}

class RootBalanceController {

    constructor({
        game,
        config,
        autoEnable = true
    }) {
        this.config = defaultsDeep(config, defaultRootBalanceConfig)
        this.game = game
        this.level = game.root
        this.data  = game.data
        this.state = game.state
        this.balance = this.data.balance
        this.footer  = this.level.footer
        this.machine = this.level.machine
        this.footerBal  = this.footer.balance.bottom
        this.machineBal = this.machine.panel.balance

        if (autoEnable) this.enable()
    }

    enable() {
        this.subs = []

        // Footer Balance
        // Currency
        if (this.config.currency)
        this.subs.push(
        this.currencySub = this.balance.currency$
            .subscribe(e => this.footer.balance.setCurrency(e)))
        
        // Cash Sum
        if (this.config.cash.sum)
        this.subs.push(
        this.cashSumStartSub = this.balance.cash.sum$
            .filter(e => !this.state.isRolling)
            .subscribe(e => this.footerBal.left.set(e)))

        // Cash Sum at the Roll End
        if (this.config.cash.sum)
        this.subs.push(
        this.cashSumEndSub = this.balance.cash.sum$
            .filter(e => this.state.isRolling)
            .sample(this.state.isRolling$)
            .subscribe(e => this.footerBal.left.set(e)))
        
        // Cash Bet
        if (this.config.cash.bet)
        this.subs.push(
        this.cashBetSub = this.balance.cash.bet$
            .subscribe(e => this.footerBal.center.set(e)))
        
        // Cash Win
        if (this.config.cash.win)
        this.subs.push(
        this.cashWinStartSub = this.balance.cash.win$
            .filter(e => !this.state.isRolling)
            .subscribe(e => this.footerBal.right.set(e)))
        
        // Cash Win at the Roll End
        if (this.config.cash.win)
        this.subs.push(
        this.cashWinEndSub = this.balance.cash.win$
            .filter(e => this.state.isRolling)
            .sample(this.state.isRolling$)
            .subscribe(e => this.footerBal.right.set(e)))

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

    disable() {
        this.subs.forEach(s => s.unsubscribe()) 
    }

}

const defaultRootWinConfig = {
    table: {
        show: true,
        hide: true
    },
    lines: {
        show: true,
        hide: true
    },
    numbers: {
        show: true,
        hide: true
    },
    els: {
        show: true,
        hide: true,
        alpha: true
    },
    oneAfterAnother: {
        delay: 4000,
        interval: 3000
    }
}

class RootWinController {

    constructor({
        game,
        config,
        autoEnable = true
    }) {
        this.config = defaultsDeep(config, defaultRootWinConfig)
        this.game  = game
        this.level = game.root
        this.data  = game.data
        this.state = game.state
        this.balance = this.data.balance
        this.footer  = this.level.footer
        this.machine = this.level.machine

        if (autoEnable) this.enable()
    }

    enable() {
        this.subs = []

        // Show Win Table when we have win coins in the End of Roll
        if (this.config.table.show)
        this.subs.push(
        this.tableShowSub = this.balance.coin.win$
            .filter(e => e)
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(e => this.machine.table.show(e)))

        // Hide Win Table when rolling starts 
        if (this.config.table.hide)
        this.subs.push(
        this.tableHideSub = this.state.isRolling$
            .filter(e => e)
            .subscribe(e => this.machine.table.hide()))

        // Show Win Lines when we have win combinations in the End of Roll
        if (this.config.lines.show)
        this.subs.push(
            this.linesShowSub = this.data.win.lines$
            .filter(e => e)
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(lines => lines.forEach(line => this.machine.lines.show(line.number))))
            
        // Hide Win Lines when rolling starts
        if (this.config.lines.hide)
        this.subs.push(
        this.linesHideSub = this.state.isRolling$
            .filter(e => e)
            .filter(e => this.data.win.lines)
            .subscribe(e => this.data.win.lines.forEach(line => this.machine.lines.hide(line.number))))

        // Show Win Numbers when we have win combinations in the End of Roll
        if (this.config.numbers.show)
        this.subs.push(
        this.numbersShowSub = this.data.win.lines$
            .filter(e => e)
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(lines => lines.forEach(line => this.machine.numbers.show(line.number))))
            
        // Hide Win Numbers when rolling starts
        if (this.config.numbers.hide)
        this.subs.push(
        this.numbersHideSub = this.state.isRolling$
            .filter(e => e)
            .filter(e => this.data.win.lines)
            .subscribe(e => this.data.win.lines.forEach(line => this.machine.numbers.hide(line.number))))

        // Show Win Elements when we have win combinations in the End of Roll
        if (this.config.els.show)
        this.subs.push(
        this.elementsShowSub = this.data.win.lines$
            .filter(data => data && data.length)
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(data => this.machine.screen.getElementsFromLines(data).forEach(el => el.playWin())))

        // Hide Win Elements when rolling starts
        if (this.config.els.hide)
        this.subs.push(
        this.elementsHideSub = this.data.win.lines$
            .filter(data => data)
            .sample(this.state.isRolling$.filter(e => e))
            .subscribe(data => this.machine.screen.getElementsFromLines(data).forEach(el => el.playNormal())))

        // Hide Not Win Elements in alpha when we have win combinations
        if (this.config.els.alpha)
        this.subs.push(
        this.elementsAlphaShowSub = this.data.win.lines$
            .filter(data => data && data.length)
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(data => this.machine.screen.elements
                .filter(el => !this.machine.screen.getElementsFromLines(data).some(winEl => winEl === el))
                .forEach(el => el.alpha = 0.6)))

        // Return Elements alpha when rolling starts        
        if (this.config.els.alpha)
        this.subs.push(
        this.elementsAlphaHideSub = this.data.win.lines$
            .filter(data => data)
            .sample(this.state.isRolling$.filter(e => e))
            .subscribe(data => this.machine.screen.elements.forEach(el => el.alpha = 1)))

        // One after another logic
        if (this.config.oneAfterAnother)
        this.subs.push(
        this.winOneAfterAnotherSub = this.data.win.lines$
            .filter(data => data && data.length)
            .sample(this.state.isRolling$.filter(e => !e))
            .switchMap(
                () => Observable.timer(this.config.oneAfterAnother.delay, this.config.oneAfterAnother.interval)
                    .takeUntil(this.state.isRolling$.filter(e => e)),
                (data, index) => ({ data, index: (data.length > 1) ? index % data.length : 0 })
            )
            .subscribe(({ data, index }) => {
                if (data.number < 0) return null
                
                this.hideBeforeLine(data[index].number)
                this.showLine(data[index])
            }))
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe()) 
    }

    hideBeforeLine(num) {
        this.machine.table.hide()
        this.machine.screen.elements.forEach(el => el.playNormal())
        this.machine.numbers.hideAllWithout(num)
        this.machine.lines.hideAllWithout(num)
    }

    showLine(line) {
        this.machine.lines.show(line.number)
        this.machine.numbers.show(line.number)
        this.machine.screen.getElementsFromLine(line).forEach(el => el.playWin())
        this.machine.screen.getLastElementFromLine(line).win.show(line.win)
    }

}

const defaultAutoplayConfig = {
    start: true,
    timer: true,
    count: true,
    end: true,
    noRoot: true
}

class AutoplayController {

    constructor({
        game,
        config,
        autoEnable = true
    }) {
        this.config = defaultsDeep(config, defaultAutoplayConfig)
        
        this.game  = game
        this.level = game.root
        this.data  = game.data
        this.state = game.state
        this.balance = this.data.balance
        this.footer  = this.level.footer
        this.machine = this.level.machine
        this.buttons = this.machine.panel.buttons

        if (autoEnable) this.enable()
    }

    enable() {
        this.subs = []
        
        // Change Autoplay Counter
        if (this.config.count)
        this.subs.push(
        this.autoCounterSub = this.state.autoplay$
            .filter(e => e) // When autoplay is positive number
            .subscribe(e => this.buttons.count.set(e))) // Change counter to new value

        // Autoplay Start triggers when state.autoplay changes from null to positive number
        if (this.config.start)
        this.subs.push(
        this.autoStartSub = this.state.autoplay$
            .distinctUntilChanged((prev, curr) => !(prev === null && curr > 0 || curr === null))
            .filter(e => e !== null) // Last autoplay value must be not a null 
            .subscribe(e => {
                this.state.button = 'stop' // Change main button to stop
                this.buttons.count.visible = true // Counter is visible now 
                this.buttons.disableAll() // All buttons ( without Stop ) are disabled

                this.machine.screen.roll() // First Autoplay roll
                this.state.autoplay-- // Decrease autoplay value
            }))
        
        // Autoplay Timer
        if (this.config.timer)
        this.subs.push(
        this.autoTimerSub = this.state.autoplay$
            .sample(this.state.isRolling$.filter(e => !e)) // At the end of roll
            .switchMap(e => this.data.win.lines.length // If we have win lines
                        ? Observable.of(e).delay(2000) // Delay 2 seconds
                        : Observable.of(e).delay(200)) // If no win lines - delay 200ms
            .filter(e => this.state.autoplay) // If autoplay is enabled now
            .subscribe(e => {
                this.machine.screen.roll() // Roll the screen
                this.state.autoplay-- // And decrease autoplay
            }))

        // Autoplay End
        if (this.config.end)
        this.subs.push(
        this.autoEndSub = this.state.autoplay$
            .filter(e => !e) // When autoplay === 0 or null ( end or stop )
            .subscribe(e => {
                this.state.button = 'spin' // Return main button to default state
                this.buttons.count.visible = false // Remove counter
                this.buttons.count.set(0) // And set counter to 0
                if (this.state.autoplay !== null) // When Autoplay is noyt null ( like 0 )
                    this.state.autoplay = null // Set to null to know that autoplay ended
            }))

        // Stoping auto when we not rolling
        if (this.config.end)
        this.subs.push(
        this.autoNoRootStopSub = this.state.autoplay$
            .filter(e => !e) // When autoplay is stopped
            .filter(e => !this.state.isRolling) // And we are not rolling now
            .subscribe(e => this.buttons.enableAll())) // Enable buttons

        // Stop auto when next is not 'root'
        if (this.config.noRoot)
        this.subs.push(
        this.autoNoRootStopSub = this.state.next$
            .filter(e => e !== 'root') // When NextMode is not Root
            .sample(this.state.isRolling$.filter(e => !e)) // At the End of Roll
            .subscribe(e => this.state.autoplay = null)) // Stop autoplay

    }

    disable() {
        this.subs.forEach(s => s.unsubscribe()) 
    }

}

export { Root }