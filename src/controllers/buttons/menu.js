import defaultsDeep from 'lodash.defaultsdeep'
import { Observable } from 'rxjs/Observable'

const defaultConfig = {
    autoplay: true,
    close: true,
    side: true,
    bet: {
        level: {
            plus: true,
            minus: true,
            minMax: true,
            max: true
        },
        value: {
            plus: true,
            minus: true,
            minMax: true
        },
    },
    settings: {
        effects: true,
        music: true,
        fast: true,
        hand: true,
        info: true,
        quality: true,
    }
}

class MobileMenuController {

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
        this.buttons = this.level.buttons
        this.screen  = this.level.machine.screen

        this.menu     = this.level.menu
        this.bet      = this.menu.bet
        this.auto     = this.menu.auto
        this.settings = this.menu.settings

        if (autoEnable) this.enable()
    }

    enable() {
        this.subs = []

        // Autoplay menu
        // Auto Buttons
        if (this.config.autoplay)
        this.subs.push(
        this.autoItemSub = this.auto.$
            .subscribe(value => {
                this.menu.close()
                this.state.autoplay = value
            }))

        // Side binding
        if (this.config.side)
        this.subs.push(
        this.sideSub = this.state.settings.isRightSide$
            .subscribe(value => this.menu.changeSide(value)))

        // Close button
        if (this.config.close)
        this.subs.push(
        this.closeSub = Observable.merge(
            this.bet.close.down$,
            this.auto.close.down$,
            this.settings.close.down$,
            this.menu.darkness.down$
        ).subscribe(value => this.menu.close()))

        // Bet menu
        // Level Bindings
        if (this.config.bet.level)
        this.subs.push(
        this.levelSub = this.balance.level.current$
            .subscribe(e => this.bet.level.text.set(e)))                

        // Value Binding
        if (this.config.bet.value)
        this.subs.push(
        this.valueSub = this.balance.value.current$
            .subscribe(e => this.bet.value.text.set(e / 100)))                

        // Level Plus
        if (this.config.bet.level.plus)
        this.subs.push(
        this.levelPlusSub = this.bet.level.plus.down$
            .subscribe(e => this.balance.level.index++))

        // Level Minus
        if (this.config.bet.level.minus)
        this.subs.push(
        this.levelMinusSub = this.bet.level.minus.down$
            .subscribe(e => this.balance.level.index--))

        // Level Max
        if (this.config.bet.level.max)
        this.subs.push(
        this.levelMaxSub = this.bet.max.down$
            .subscribe(e => this.balance.level.index = this.balance.level.arr.length - 1))

        // Value Plus
        if (this.config.bet.value.plus)
        this.subs.push(
        this.valuePlusSub = this.bet.value.plus.down$
            .subscribe(e => this.balance.value.index++))

        // Value Minus
        if (this.config.bet.value.minus)
        this.subs.push(
        this.valueMinusSub = this.bet.value.minus.down$
            .subscribe(e => this.balance.value.index--))

        // Level Min
        if (this.config.bet.level.minMax)                        
        this.subs.push(
        this.levelMaxSub = this.balance.level.max$
            .subscribe(e => this.bet.level.plus.max(e)))
        
        // Level Max
        if (this.config.bet.level.minMax)                                
        this.subs.push(
        this.levelMinSub = this.balance.level.min$
            .subscribe(e => this.bet.level.minus.min(e)))

        // Value Min
        if (this.config.bet.value.minMax)                        
        this.subs.push(
        this.valueMaxSub = this.balance.value.max$
            .subscribe(e => this.bet.value.plus.max(e)))
        
        // Value Max
        if (this.config.bet.value.minMax)                                
        this.subs.push(
        this.valueMinSub = this.balance.value.min$
            .subscribe(e => this.bet.value.minus.min(e)))

        // Settings menu
        // Settings effects
        if (this.config.settings.effects)
        this.subs.push(
        this.effectsSub = this.settings.effects.$
            .subscribe(e => this.state.settings.isEffects = !this.state.settings.isEffects))

        if (this.config.settings.effects)
        this.subs.push(
        this.effectsStateSub = this.state.settings.isEffects$
            .subscribe(e => this.settings.effects.to(e)))  

        // Settings music
        if (this.config.settings.music)
        this.subs.push(
        this.musicSub = this.settings.music.$
            .subscribe(e => this.state.settings.isMusic = !this.state.settings.isMusic))

        if (this.config.settings.music)
        this.subs.push(
        this.musicStateSub = this.state.settings.isMusic$
            .subscribe(e => this.settings.music.to(e)))  

        // Settings fast spin
        if (this.config.settings.fast)
        this.subs.push(
        this.fastSub = this.settings.fast.$
            .subscribe(e => this.state.settings.isFast = !this.state.settings.isFast))
        
        if (this.config.settings.fast)
        this.subs.push(
        this.fastStateSub = this.state.settings.isFast$
            .subscribe(e => {
                this.settings.fast.to(e)
                // ??? Where must be this part of logic
                this.screen.setRollSpeed(this.screen.config.roll[e ? 'fast' : 'normal'])
            }))                        

        // Settings hand mode
        if (this.config.settings.hand)
        this.subs.push(
        this.handSub = this.settings.hand.$
            .subscribe(e => this.state.settings.isRightSide = !this.state.settings.isRightSide))

        if (this.config.settings.hand)
        this.subs.push(
        this.handStateSub = this.state.settings.isRightSide$
            .subscribe(e => this.settings.hand.to(e)))  

        // Settings hand mode
        if (this.config.settings.info)
        this.subs.push(
        this.handSub = this.settings.hand.$
            .subscribe(e => e))

        // Settings fast spin
        if (this.config.settings.quality)
        this.subs.push(
        this.qualitySub = this.settings.quality.$
            .subscribe(e => this.state.settings.isLowQuality = !this.state.settings.isLowQuality))

        if (this.config.settings.quality)
        this.subs.push(
        this.qualityStateSub = this.state.settings.isLowQuality$
            .subscribe(e => this.settings.quality.to(e)))  
            
    
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

}

export { MobileMenuController }