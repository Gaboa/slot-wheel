import defaultsDeep from 'lodash.defaultsdeep'
import { Observable } from 'rxjs/Observable';

const defaultConfig = {
    menu: true,
    auto: true,
    stop: true,
    spin: true,
    bet: true,
    sound: {
        button: true,
        state: true
    },
    autoplay: {
        start: true,
        end: true
    },
    audio: 'click_1'
}

class MobileButtonsController {

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
        this.settings = game.state.settings
        this.balance = this.data.balance
        this.footer  = this.level.footer
        this.machine = this.level.machine
        this.buttons = this.level.buttons
        this.menu    = this.level.menu

        if (autoEnable) this.enable()
    }

    enable() {
        this.subs = []

        // Menu Button
        if (this.config.menu)
        this.subs.push(
        this.menuSub = this.buttons.menu.down$
            .subscribe(e => this.menu.open('settings')))            

        // Autoplay Button
        if (this.config.auto)
        this.subs.push(
        this.autoSub = this.buttons.auto.down$
            .subscribe(e => this.menu.open('auto')))

        // Stop Button
        if (this.config.stop)
        this.subs.push(
        this.stopSub = this.buttons.stop.down$
            .subscribe(e => this.state.isAutoplay = false))

        // Spin Button
        if (this.config.spin)
        this.subs.push(
        this.spinSub = this.buttons.spin.down$
            .subscribe(e => this.machine.screen.roll()))

        // Bet Button
        if (this.config.bet)
        this.subs.push(
        this.betSub = this.buttons.bet.down$
            .subscribe(e => this.menu.open('bet')))

        // Sound Button
        if (this.config.sound.button)
        this.subs.push(
        this.soundButtonSub = this.buttons.sound.down$
            .subscribe(e => this.settings.isSound = !this.settings.isSound))

        // Sound State
        if (this.config.sound.state)
        this.subs.push(
        this.soundStateSub = this.settings.isSound$
            .subscribe(e => this.buttons.sound.to(e)))

        // Buttons audio
        if (this.config.audio)
        this.subs.push(
        this.audioSub = Observable.merge(...this.buttons.items.map(e => e.$))
            .subscribe(e => this.game.audio.play(this.config.audio)))

        // Autoplay buttons logic
        // Start
        if (this.config.autoplay.start)        
        this.subs.push(
        this.autoStartSub = this.state.button$
            .filter(e => e === 'stop')
            .subscribe(e => {
                this.buttons.spin.changeTexture('mobile_spin_empty', true)
                this.buttons.auto.visible = false
                this.buttons.stop.visible = true
            }))

        // End
        if (this.config.autoplay.end)
        this.subs.push(
        this.autoEndSub = this.state.button$
            .filter(e => e === 'spin')
            .subscribe(e => {
                this.buttons.spin.changeTexture('mobile_spin_off')
                this.buttons.auto.visible = true
                this.buttons.stop.visible = false
            }))
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

}

export { MobileButtonsController }