import defaultsDeep from 'lodash.defaultsdeep'
import { Preload, DesktopRoot, MobileRoot } from '../levels'
import { preload, common, desktop, mobile } from '../utils'

const defaultGameConfig = {
    init: true,
    roll: true,
    leave: true,
    fullscreen: true,
    audio: {
        sound: {
            on: true,
            off: true
        },
        music: true,
        effects: true,
        volume: true,
        musicAndEffects: true
    },
    error: {
        request: true,
        handle: true
    },
    preload: {
        level: true,
        logic: true
    },
    constructors: {
        Preload,
        DesktopRoot,
        MobileRoot
    },
    load: {
        preload,
        common,
        desktop,
        mobile
    }
}

class GameController {
    
    constructor({
        game,
        config,
        autoEnable = true
    }) {
        this.game = game
        this.state = game.state
        this.settings = game.state.settings
        this.config = defaultsDeep(config, defaultGameConfig)

        if (autoEnable)
            this.enable()
    }

    enable() {
        this.subs = []

        if (this.config.init)
        this.subs.push(
        this.parseInitSub = this.game.request.$
            .filter(e => e.type === 'INIT')
            .subscribe(res => this.game.parser.init(res.data)))

        if (this.config.roll)
        this.subs.push(
        this.parseRollSub = this.game.request.$
            .filter(e => e.type === 'ROLL')
            .subscribe(res => this.game.parser.roll(res.data)))

        if (this.config.leave)
        this.subs.push(
        this.leaveSub = this.game.device.$
            .filter(e => e.type === 'LEAVE')
            .subscribe(e => this.game.request.sendLogout()))

        if (this.config.fullscreen)
        this.subs.push(
        this.fullscreenSub = this.settings.isFullscreen$
            .subscribe(e => this.game.device[`${e ? 'enter' : 'cancel'}Fullscreen`]()))

        // Audio Logic
        if (this.config.audio.sound.off)        
        this.subs.push(
        this.soundOffSub = this.state.settings.isSound$
            .distinctUntilChanged()
            .filter(e => !e)
            .subscribe(e => this.state.settings.isEffects = this.state.settings.isMusic = e))

        if (this.config.audio.sound.on)        
        this.subs.push(
        this.soundOnSub = this.state.settings.isSound$
            .distinctUntilChanged()
            .filter(e => e)
            .filter(e => !this.state.settings.isEffects && !this.state.settings.isMusic)
            .subscribe(e => this.state.settings.isEffects = this.state.settings.isMusic = e ))

        if (this.config.audio.musicAndEffects)        
        this.subs.push(
        this.musicAndEffectsSub = this.state.settings.isMusic$
            .combineLatest(this.state.settings.isEffects$)
            .subscribe(arr => {
                if (arr.every(e => !e)) this.state.settings.isSound = false
                else this.state.settings.isSound = true
            }))

        if (this.config.audio.music)        
        this.subs.push(
        this.musicSub = this.state.settings.isMusic$
            .subscribe(e => this.game.audio[`${e ? 'un' : '' }muteMusic`]()))

        if (this.config.audio.effects)        
        this.subs.push(
        this.effectsSub = this.state.settings.isEffects$
            .subscribe(e => this.game.audio[`${e ? 'un' : '' }muteEffects`]()))

        if (this.config.audio.volume)        
        this.subs.push(
        this.volumeSub = this.state.settings.volume$
            .subscribe(e => this.game.audio.volume = e / 100))

        // TODO: Change to Popup Open 
        if (this.config.error.handle)
        this.subs.push(
        this.errorHandleSub = this.state.error$
            .filter(e => e !== null)
            .subscribe(e => console.log('Error: ', e)))
        
        // Request errors
        if (this.config.error.request)
        this.subs.push(
        this.errorRequestSub = this.game.request.$
            .subscribe({
                error: (e) => this.game.state.error = e
            }))
        
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

    preload() {

        if (this.config.preload.level)
        this.game.preload = new this.config.constructors.Preload({
            game: this.game,
            base: `img/${GAME_RES}`,
            config: this.config.load
        })

        if (this.config.preload.logic)
        this.game.preload.$
            .filter(e => e === 'REMOVED').take(1)
            .subscribe(e => game.root = new this.config.constructors[`${GAME_DEVICE.split('').map((ch, i) => i === 0 ? ch.toUpperCase() : ch).join('')}Root`]({ game: this.game }))

    }

    changeMode({
        res,
        device
    }) {

        // Clear old session
        this.game.root.remove()
        this.game.loader.reset()
        PIXI.utils.clearTextureCache()

        // Params res and device
        this.game.device.isMobile = () => device === 'mobile' ? true : false
        this.game.device.config[device] = res

        // Change Global Params
        this.game.device.setGlobalParams()
        this.game.renderer.resize(GAME_WIDTH, GAME_HEIGHT)
        this.game.view.width = GAME_WIDTH
        this.game.view.height = GAME_HEIGHT
        this.game.device.setAspectMode()

        // New preload level
        this.preload()

    }

}
export { GameController }