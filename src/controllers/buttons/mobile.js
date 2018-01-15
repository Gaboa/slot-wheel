import defaultsDeep from 'lodash.defaultsdeep'

const defaultConfig = {
    menu: true,
    auto: true,
    spin: true,
    bet: true,
    sound: true,
    state: true
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
        this.balance = this.data.balance
        this.footer  = this.level.footer
        this.machine = this.level.machine
        this.buttons = this.level.buttons
        this.menu    = this.level.menu

        if (autoEnable) this.enable()
    }

    enable() {
        this.subs = []

        // Menu
        if (this.config.menu)
        this.subs.push(
        this.menuSub = this.buttons.menu.down$
            .subscribe(e => this.menu.open('settings')))            

        // Autoplay
        if (this.config.auto)
        this.subs.push(
        this.autoSub = this.buttons.auto.down$
            .subscribe(e => this.menu.open('auto')))

        // Spin
        if (this.config.spin)
        this.subs.push(
        this.spinSub = this.buttons.spin.down$
            .subscribe(e => this.machine.screen.roll()))

        // Autoplay
        if (this.config.bet)
        this.subs.push(
        this.betSub = this.buttons.bet.down$
            .subscribe(e => this.menu.open('bet')))

        // Sound
        if (this.config.sound)
        this.subs.push(
        this.soundSub = this.buttons.sound.down$
            .subscribe(e => this.state.settings.isSound = !this.state.settings.isSound))

        if (this.config.sound)
        this.subs.push(
        this.soundStateSub = this.state.settings.isSound$
            .subscribe(e => this.buttons.sound.to(e)))

        // if (this.config.state)
        // this.subs.push(
        // this.buttonStateSub = this.state.button$
        //     .subscribe(e => this.buttons.changeTo(e)))
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

}

export { MobileButtonsController }