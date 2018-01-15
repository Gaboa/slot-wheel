import defaultsDeep from 'lodash.defaultsdeep'

const defaultConfig = {
    home: true,
    settings: true,
    info: true,
    sound: true,
    fast: true,
    fullscreen: true
}

class FooterButtonsController {
    
    constructor({
        game,
        config,
        autoEnable = true
    }) {
        this.config = defaultsDeep(config, defaultConfig)

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

export { FooterButtonsController }