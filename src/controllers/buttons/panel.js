import defaultsDeep from 'lodash.defaultsdeep'
import { Observable } from 'rxjs/Observable'

const defaultConfig = {
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
    max: true
}

class PanelButtonsController {

    constructor({
        game,
        config,
        autoEnable = true
    }) {
        this.config = defaultsDeep(config, defaultConfig)

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

export { PanelButtonsController }