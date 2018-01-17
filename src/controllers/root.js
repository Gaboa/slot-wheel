import defaultsDeep from 'lodash.defaultsdeep'

const defaultConfig = {

    idle: {
        buttons: {
            enable:  true,
            disable: true
        },
        footer: {
            enable:  true,
            disable: true
        }
    },

    rolling: {
        start: true,
        end: true,
        transition: true
    }

}

class RootController {

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
        this.buttons = this.level.machine.panel
            ? this.level.machine.panel.buttons
            : this.level.buttons

        if (autoEnable) this.enable()        
    }

    enable() {
        this.subs = []

        // Changing buttons states with isIdle state
        if (this.config.idle.buttons.enable)
        this.subs.push(
        this.idleButtonsEnableSub = this.state.isIdle$
            .filter(e => e)
            .subscribe(e => this.buttons.enableAll()))

        if (this.config.idle.buttons.disable)
        this.subs.push(
        this.idleButtonsDisableSub = this.state.isIdle$
            .filter(e => !e)
            .subscribe(e => this.buttons.disableAll()))


        // Disabling footer buttons with idle state
        if (this.config.idle.footer.enable)
        this.subs.push(
        this.idleFooterEnableSub = this.state.isIdle$
            .filter(e => e)
            .subscribe(e => {
                this.footer.buttons.settings.enable()
                this.footer.buttons.info.enable()
            }))

        if (this.config.idle.footer.disable)
        this.subs.push(
        this.idlefooterDisableSub = this.state.isIdle$
            .filter(e => !e)
            .subscribe(e => {
                this.footer.buttons.settings.disable()
                this.footer.buttons.info.disable()
            }))


        // When Rolling Starts => change Idle to false
        if (this.config.rolling.start)
        this.subs.push(
        this.rollingStartSub = this.state.isRolling$
            .filter(e => e) // Start of roll
            .subscribe(e => this.state.isIdle = false))
        
        // When End of Roll and we not in Autoplay and Next is Root => return Idle state
        if (this.config.rolling.end)
        this.subs.push(
        this.rollingEndSub = this.state.isRolling$
            .filter(e => !e) // End of roll
            .filter(e => !this.state.isAutoplay) // Not Autoplay
            .filter(e => this.state.next === 'root') // Next is Root
            .subscribe(e => this.state.isIdle = true))

        // When End of Roll and Next is not Root => We go in Transition
        if (this.config.rolling.transition)
        this.subs.push(
        this.rollingTransitionSub = this.state.isRolling$
            .filter(e => !e) // End of roll
            .filter(e => this.state.next !== 'root') // Next is not Root
            .subscribe(e => this.state.isTransition = true))
        
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

}

export { RootController }