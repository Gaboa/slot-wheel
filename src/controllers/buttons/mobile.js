import defaultsDeep from 'lodash.defaultsdeep'

const defaultConfig = {
    menu: true,
    auto: true,
    spin: true,
    bet: true,
    sound: {
        button: true,
        state: true
    }
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
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

}

export { MobileButtonsController }