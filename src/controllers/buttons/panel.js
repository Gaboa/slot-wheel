import defaultsDeep from 'lodash.defaultsdeep'
import { Observable } from 'rxjs/Observable'

const defaultConfig = {
    level: {
        minus: true,
        plus: true,
        min: true,
        max: true,
        keyboard: true
    },
    value: {
        minus: true,
        plus: true,
        min: true,
        max: true,
        keyboard: true
    },
    auto: {
        button: true,
        delta: 1500
    },
    item: {
        button: true,
        autoplay: true,
        delta: 1500
    },
    spin: {
        button:   true,
        keyboard: true
    },
    anim: {
        start: true,
        state: true,
        complete: true
    },
    stop: {
        button: true,
        autoplay: true
    },
    max: true,
    audio: 'click_1'
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

        // ------  Spin  ------
        // Spin button starts Screen roll
        if (this.config.spin.button)
        this.subs.push(
        this.spinSub = this.buttons.spin.up$
            .merge(!this.config.spin.keyboard 
                ? Observable.empty()
                : Observable.fromEvent(document, 'keyup')
                .filter(e => this.buttons.spin.enabled)
                .map(e => String(e.code).toUpperCase())
                .filter(code => code === 'SPACE'))
            .subscribe(e => this.machine.screen.roll()))


        // ------  Anim  ------
        // Anim button Start
        if (this.config.anim.start)
        this.subs.push(
        this.animStartSub = this.buttons.anim.$
            .filter(e => e.type === 'START')
            .subscribe(e => this.buttons.changeButtonTo('anim')))

        // Anim button Complete
        if (this.config.anim.complete)
        this.subs.push(
        this.animCompleteSub = this.buttons.anim.$
            .filter(e => e.type === 'COMPLETE')
            .map(e => e.anim.split('_')[1])
            .subscribe(state => this.buttons.changeButtonTo(state)))

        // Anim button State
        if (this.config.anim.state)
        this.subs.push(
        this.animStateSub = this.state.button$
            .subscribe(e => this.buttons.changeTo(e)))


        // ------  Auto  ------
        // Auto Button
        if (this.config.auto.button)
        this.subs.push(
        this.autoSub = this.buttons.auto.up$
            .throttleTime(this.config.auto.delta)
            .subscribe(e => (this.state.button === 'spin')
                ? this.state.button = 'auto'
                : this.state.button = 'spin' ))


        // ------  AutoItem  ------
        // AutoItem starts autoplay
        if (this.config.item.autoplay)
        this.subs.push(
        this.autoItemAutoplaySub = this.buttons.panel.$
            .throttleTime(this.config.item.delta)
            .map(e => e.value)
            .subscribe(value => {
                this.data.autoplay.count = value
                this.state.isAutoplay = true
            }))


        // ------  Stop  ------
        // Stop Button change button to Spin
        if (this.config.stop.button)
        this.subs.push(
        this.stopButtonSub = this.buttons.stop.up$
            .subscribe(e => this.state.button = 'spin' ))

        // Stop Button stops Autoplay
        if (this.config.stop.autoplay)
        this.subs.push(
        this.stopAutoplaySub = this.buttons.stop.up$
            .subscribe(e => this.state.isAutoplay = false ))

        // ------  Max  ------
        // Max Button change Level to Maximum amount
        if (this.config.max)        
        this.subs.push(
        this.maxSub = this.buttons.max.up$
            .subscribe(e => this.balance.level.index = this.balance.level.arr.length - 1))
        
        // ------  Level  ------
        // Level Minus
        if (this.config.level.minus)
        this.subs.push(
        this.levelMinusSub = this.buttons.level.minus.up$
            .merge(!this.config.level.keyboard 
                ? Observable.empty()
                : Observable.fromEvent(document, 'keyup')
                .filter(e => this.buttons.level.minus.enabled)
                .map(e => String(e.code).toUpperCase())
                .filter(code => code === 'ARROWDOWN'))
            .subscribe(e => this.balance.level.index--))
            
        // Level Plus
        if (this.config.level.plus)
        this.subs.push(
        this.levelPlusSub = this.buttons.level.plus.up$
            .merge(!this.config.level.keyboard 
                ? Observable.empty()
                : Observable.fromEvent(document, 'keyup')
                .filter(e => this.buttons.level.plus.enabled)
                .map(e => String(e.code).toUpperCase())
                .filter(code => code === 'ARROWUP'))
            .subscribe(e => this.balance.level.index++))

        // Level Max - Plus button
        if (this.config.level.max)
        this.subs.push(
        this.levelMaxSub = this.balance.level.max$
            .subscribe(e => this.buttons.level.plus.max(e)))

        // Level Max - Max button 
        if (this.config.level.max)
        this.subs.push(
        this.levelMaxMaxSub = this.balance.level.max$
            .subscribe(e => this.buttons.max.max(e)))
        
        // Level Min
        if (this.config.level.min)        
        this.subs.push(
        this.levelMinSub = this.balance.level.min$
            .subscribe(e => this.buttons.level.minus.min(e)))

        // ------  Value  ------
        // Value Minus
        if (this.config.value.minus)                
        this.subs.push(
        this.valueMinusSub = this.buttons.value.minus.up$
            .merge(!this.config.value.keyboard 
                ? Observable.empty()
                : Observable.fromEvent(document, 'keyup')
                .filter(e => this.buttons.value.minus.enabled)
                .map(e => String(e.code).toUpperCase())
                .filter(code => code === 'ARROWLEFT'))
            .subscribe(e => this.balance.value.index--))
        
        // Value Plus
        if (this.config.value.plus)                
        this.subs.push(
        this.valuePlusSub = this.buttons.value.plus.up$
            .merge(!this.config.value.keyboard
                ? Observable.empty()
                : Observable.fromEvent(document, 'keyup')
                .filter(e => this.buttons.value.plus.enabled)
                .map(e => String(e.code).toUpperCase())
                .filter(code => code === 'ARROWRIGHT'))
            .subscribe(e => this.balance.value.index++))
        
        // Value Max
        if (this.config.value.max)                        
        this.subs.push(
        this.valueMaxSub = this.balance.value.max$
            .subscribe(e => this.buttons.value.plus.max(e)))
        
        // Value Min
        if (this.config.value.min)                                
        this.subs.push(
        this.valueMinSub = this.balance.value.min$
            .subscribe(e => this.buttons.value.minus.min(e)))

        // Click sound
        if (this.config.audio)
        this.subs.push(
        this.audioSub = Observable.merge(...this.buttons.items.map(item => item.down$), this.buttons.panel.$)
            .subscribe(e => this.game.audio.play(this.config.audio)))
        
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())        
    }

}

export { PanelButtonsController }