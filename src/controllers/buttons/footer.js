import defaultsDeep from 'lodash.defaultsdeep'
import { Observable } from 'rxjs/Observable'

const defaultConfig = {
    home: {
        request: true,
        redirect: true
    },
    settings: true,
    info: true,
    sound: {
        button: true,
        state: true
    },
    fast: {
        button: true,
        state: true
    },
    fullscreen: {
        button: true,
        state: true
    },
    audio: 'click_2'
}

class FooterButtonsController {
    
    constructor({
        game,
        config,
        autoEnable = true
    }) {
        this.config = defaultsDeep(config, defaultConfig)

        this.game  = game
        this.level = game.root
        this.buttons  = game.root.footer.buttons
        this.screen   = game.root.machine.screen
        this.settings = game.state.settings

        if (autoEnable) this.enable()        
    }

    enable() {
        this.subs = []

        // Home button Request
        if (this.config.home.request)
        this.subs.push(
        this.homeRequestSub = this.buttons.home.down$
            .subscribe(e => this.game.request.sendLogout()))
            
        // TODO: Add handling homeUrl
        // Home button Redirect
        if (this.config.home.redirect)
        this.subs.push(
        this.homeRedirectSub = this.buttons.home.down$
            .subscribe(e => window.history.back()))

        // TODO: Some Settings bindings
        // Settings button
        if (this.config.settings)
        this.subs.push(
        this.settingsSub = this.buttons.settings.down$
            .subscribe(e => this.level.settings.open()))

        // TODO: Some Info bindings
        // Info button
        if (this.config.info)
        this.subs.push(
        this.infoSub = this.buttons.info.down$
            .subscribe(e => this.level.info.open()))

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

        // Fast Button
        if (this.config.fast.button)
        this.subs.push(
        this.fastButtonSub = this.buttons.fast.down$
            .subscribe(e => this.settings.isFast = !this.settings.isFast))
            
        // Fast State
        if (this.config.fast.state)
        this.subs.push(
        this.fastStateSub = this.settings.isFast$
            .subscribe(e => this.buttons.fast.to(e)))                        

        // Fullscreen Button
        if (this.config.fullscreen.button)
        this.subs.push(
        this.fullscreenButtonSub = this.buttons.fullscreen.down$
            .subscribe(e => this.settings.isFullscreen = !this.settings.isFullscreen))

        // Fullscreen State
        if (this.config.fullscreen.state)
        this.subs.push(
        this.fullscreenStateSub = this.settings.isFullscreen$
            .subscribe(e => this.buttons.fullscreen.to(e)))

        // Click sound
        if (this.config.audio)
        this.subs.push(
        this.audioSub = Observable.merge(...this.buttons.children.map(item => item.down$))
            .subscribe(e => this.game.audio.play(this.config.audio)))

    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

}

export { FooterButtonsController }