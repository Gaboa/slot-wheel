import defaultsDeep from 'lodash.defaultsdeep'
import { Observable } from 'rxjs/Observable'

const defaultConfig = {
    close: true,
    item: {
        button: true,
        autoplay: true
    },
    bet: {
        level: {
            plus: true,
            minus: true,
            min: true,
            max: true,
            maxBet: true
        },
        value: {
            plus: true,
            minus: true,
            min: true,
            max: true
        },
    },
    settings: {
        effects: {
            button: true,
            state: true
        },
        music: {
            button: true,
            state: true
        },
        fast: {
            button: true,
            state: true
        },
        hand: {
            button: true,
            state: true,
            menu: true
        },
        quality: {
            button: true,
            state: true
        },
        info: true,
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

        // Close button
        if (this.config.close)
        this.subs.push(
        this.closeSub = Observable.merge(
            this.bet.close.down$,
            this.auto.close.down$,
            this.settings.close.down$,
            this.menu.darkness.down$
        ).subscribe(value => this.menu.close()))

        // ------  Autoplay  ------

        // ------  AutoItem  ------ 
        // AutoItem -> Close menu
        if (this.config.item.button)
        this.subs.push(
        this.autoItemButtonSub = this.auto.$
            .subscribe(value => this.menu.close()))

        // AutoItem -> Start Autoplay
        if (this.config.item.autoplay)
        this.subs.push(
        this.autoItemAutoplaySub = this.auto.$
            .subscribe(value => this.state.autoplay = value ))

        // ------  Set Bet  ------

        // ------  Level  ------
        // Level Bindings
        if (this.config.bet.level)
        this.subs.push(
        this.levelSub = this.balance.level.current$
            .subscribe(e => this.bet.level.text.set(e)))                

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
        if (this.config.bet.level.maxBet)
        this.subs.push(
        this.levelMaxBetSub = this.bet.max.down$
            .subscribe(e => this.balance.level.index = this.balance.level.arr.length - 1))

        // Level Min
        if (this.config.bet.level.max)                        
        this.subs.push(
        this.levelMaxSub = this.balance.level.max$
            .subscribe(e => this.bet.level.plus.max(e)))
        
        // Level Max
        if (this.config.bet.level.min)                                
        this.subs.push(
        this.levelMinSub = this.balance.level.min$
            .subscribe(e => this.bet.level.minus.min(e)))

        // ------  Value  ------
        // Value Binding
        if (this.config.bet.value)
        this.subs.push(
        this.valueSub = this.balance.value.current$
            .subscribe(e => this.bet.value.text.set(e / 100)))                

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

        // Value Min
        if (this.config.bet.value.max)                        
        this.subs.push(
        this.valueMaxSub = this.balance.value.max$
            .subscribe(e => this.bet.value.plus.max(e)))
        
        // Value Max
        if (this.config.bet.value.min)                                
        this.subs.push(
        this.valueMinSub = this.balance.value.min$
            .subscribe(e => this.bet.value.minus.min(e)))

        // ------  Settings  ------
        
        // ------  Effects  ------
        if (this.config.settings.effects.button)
        this.subs.push(
        this.effectsButtonSub = this.settings.effects.$
            .subscribe(e => this.state.settings.isEffects = !this.state.settings.isEffects))

        if (this.config.settings.effects.state)
        this.subs.push(
        this.effectsStateSub = this.state.settings.isEffects$
            .subscribe(e => this.settings.effects.to(e)))  

        // ------  Music  ------
        if (this.config.settings.music.button)
        this.subs.push(
        this.musicButtonSub = this.settings.music.$
            .subscribe(e => this.state.settings.isMusic = !this.state.settings.isMusic))

        if (this.config.settings.music.state)
        this.subs.push(
        this.musicStateSub = this.state.settings.isMusic$
            .subscribe(e => this.settings.music.to(e)))  

        // ------  Fast  ------
        if (this.config.settings.fast.button)
        this.subs.push(
        this.fastButtonSub = this.settings.fast.$
            .subscribe(e => this.state.settings.isFast = !this.state.settings.isFast))
        
        if (this.config.settings.fast.state)
        this.subs.push(
        this.fastStateSub = this.state.settings.isFast$
            .subscribe(e => this.settings.fast.to(e)))

        // ------  Hand  ------
        if (this.config.settings.hand.button)
        this.subs.push(
        this.handButtonSub = this.settings.hand.$
            .subscribe(e => this.state.settings.isRightSide = !this.state.settings.isRightSide))

        if (this.config.settings.hand.state)
        this.subs.push(
        this.handStateSub = this.state.settings.isRightSide$
            .subscribe(e => this.settings.hand.to(e)))  
        
        // TODO: ??? Change place for this logic
        if (this.config.settings.hand.menu)
        this.subs.push(
        this.handMenuSub = this.state.settings.isRightSide$
            .subscribe(value => this.menu.changeSide(value)))

        // ------  Info  ------
        // TODO: Add Info handler
        if (this.config.settings.info)
        this.subs.push(
        this.handSub = this.settings.hand.$
            .subscribe(e => e))

        // ------  Quality  ------
        if (this.config.settings.quality.button)
        this.subs.push(
        this.qualityButtonSub = this.settings.quality.$
            .subscribe(e => this.state.settings.isLowQuality = !this.state.settings.isLowQuality))

        if (this.config.settings.quality.state)
        this.subs.push(
        this.qualityStateSub = this.state.settings.isLowQuality$
            .subscribe(e => this.settings.quality.to(e)))  
    
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

}

export { MobileMenuController }