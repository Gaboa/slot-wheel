import defaultsDeep from 'lodash.defaultsdeep'
import { loaders } from 'pixi.js'
import { Subject, Observable } from 'rxjs'
import { Container, Sprite, JumpingButton, Darkness, Bar, Light, SoundTrigger } from '../utils'

// TODO: Add error handling. 
// Error can be in INIT request, and with loading assets

const defaultConfig = {

    // Lists for loading
    preload: [],

    common: [],
    fullhd: [],
    hd: [],

    mobile: [],
    desktop: [],

    music: 'init',

    /*-----------------------*/
    /* -------- View ------- */
    /*-----------------------*/

    // BG
    bg: {
        active: true,
        texture: 'preload_bg',
        name: 'bg',
        x: 0,
        y: 0,
        Constructor: Sprite
    },

    // Bar
    bar: {
        active: true,
        texture: 'preload_bar',
        name: 'bar',
        x: 0,
        y: 0.335,
        Constructor: Bar
    },

    // Light
    light: {
        active: true,
        texture: 'preload_light',
        name: 'light',
        x: 0,
        y: -0.1,
        alpha: 0.4,
        Constructor: Light                
    },

    // Logo
    logo: {
        active: true,
        texture: 'preload_logo',
        name: 'logo',
        x: 0,
        y: -0.1,
        Constructor: Sprite
    },

    // Copyright
    copy: {
        active: true,
        Constructor: Sprite,
        desktop: {
            texture: 'preload_copy',
            name: 'copy',
            x: -0.425,
            y: 0.425,
            scale: 1,
        },
        mobile: {
            texture: 'preload_copy',
            name: 'copy',
            x: -0.37,
            y: 0.39,
            scale: 1.5,
        }
    },

    // Button
    button: {
        active: true,
        texture: 'preload_button',
        name: 'button',
        x: 0,
        y: 0.6,
        tweenY: 0.35,
        startScale: 0.85,
        endScale: 1.15,
        Constructor: JumpingButton
    },

    // Sound
    sound: {
        active: true,
        Constructor: SoundTrigger,            
        desktop: {
            x: 0.395,
            y: 0.425,
            scale: 1,
            color: 0x286e95,
            alpha: 0.4,
        },
        mobile: {
            x: 0.36,
            y: 0.39,
            scale: 1.6,
            color: 0x286e95,
            alpha: 0.35,
        }
    },

    // Darkness
    darkness: {
        active: true,
        x: 0,
        y: 0,
        autoShow: false,
        autoHide: true,
        Constructor: Darkness        
    }

}

class Preload extends Container {

    constructor({
        game,
        base,
        config
    }) {
        super({ container: game.stage, x: 0.5, y: 0.5 })
        this.game = game
        this.base = base
        
        this.config = defaultsDeep(defaultConfig, config)
        this.createLoaders()

        this.enablePreload()
        this.loader.load()
    }

    enablePreload() {
        this.subs = []
        this.$ = new Subject()

        // When loads prelod assets => create Preload level and start loading game assets with logic
        this.subs.push(
        this.loaderCompleteSub = this.loader.$
            .subscribe({ 
            error: (e) => this.game.state.error = 'Preload assets loading error.',
            complete: () => {
                this.create()
                this.enable()
                this.game.loader.load()
                if (!this.game.data.sid) this.game.request.sendInit()
                else this.$.next('INIT_DONE')
            }}))

    }

    enable() {
        // When progress loading game assets => change progress bar visibility
        this.subs.push(
        this.gameLoaderProgressSub = this.game.loader.$
            .subscribe(e => this.bar.progress(e.progress)))

        // When game assets loding finished => trigger LOAD_COMPLETE event
        this.subs.push(
        this.gameLoaderCompleteSub = this.game.loader.$
            .subscribe({ 
                error: (e) => this.game.state.error = 'Game assets loading error.',
                complete: () => this.$.next('LOAD_DONE') }))

        // When init request done => trigger INIT_DONE event
        this.subs.push(
        this.initRequestSub = this.game.request.$
            .filter(r => r.type === 'INIT')
            .subscribe(() => this.$.next('INIT_DONE')))

        // When audio load done => trigger AUDIO_DONE event
        this.subs.push(
        this.audioLoadSub = this.game.audio.$
            .filter(r => r.type  === 'LOAD')
            .filter(r => r.state === 'COMPLETE')
            .subscribe(() => this.$.next('AUDIO_DONE')))

        // When LOAD_COMPLETE and INIT_DONE events triggers => trigger COMPLETE event
        this.subs.push(
        this.initAndLoadCompleteSub = this.$
            .bufferCount(3).take(1)
            .subscribe(arr => {
                if (arr.indexOf('INIT_DONE')  !== -1
                 && arr.indexOf('LOAD_DONE')  !== -1
                 && arr.indexOf('AUDIO_DONE') !== -1)
                    this.$.next('COMPLETE')
            }))

        // When COMPLETE triggers => hide BAR and show BUTTON
        this.subs.push(
        this.completeSub = this.$
            .filter(e => e === 'COMPLETE')
            .subscribe(e => {
                this.bar.hide()
                this.button.show()
                if (this.config.music)
                    this.game.audio.play(this.config.music)
            }))

        // When COMPLETE triggers => you can tap on button or space once to show DARKNESS
        this.createButtonAndKeyboardListener()
        this.subs.push(
        this.clickOrSpaceSub = this.tap$
            .skipUntil(this.$.filter(e => e === 'COMPLETE'))
            .take(1)
            .subscribe(e => this.darkness.show()))

        // When darkness showed => remove level
        this.subs.push(
        this.darknessShowSub = this.darkness.$
            .filter(e => e === 'SHOW')
            .take(1)
            .subscribe(e => this.remove()))

        // Bind sound trigger state to global isSound state
        this.subs.push(
        this.soundStateSub = this.game.state.settings.isSound$
            .subscribe(e => this.sound.to(e)))

        // When sound cliked => trigger isSound state
        this.subs.push(
        this.soundTriggerSub = this.sound.$
            .subscribe(e => this.game.state.settings.isSound = !this.game.state.settings.isSound))

        // Change AudioManager mute when we complete loading
        this.subs.push(
        this.soundStateSub = this.game.state.settings.isSound$
            .sample(this.$.filter(e => e === 'COMPLETE'))
            .subscribe(e => this.game.audio[`${e ? 'un' : ''}muteAll`]()))

        this.subs.push(
        this.soundStateSub = this.game.state.settings.isSound$
            .skipUntil(this.$.filter(e => e === 'COMPLETE'))
            .subscribe(e => this.game.audio[`${e ? 'un' : ''}muteAll`]()))
        
    }

    disable() {
        this.subs.forEach(sub => sub.unsubscribe())
        this.$.complete()
    }

    createButtonAndKeyboardListener() {
        this.space$ = Observable.fromEvent(document, 'keyup')
            .map(e => String(e.code).toUpperCase())
            .filter(code => code === 'SPACE')
        this.tap$ = Observable.merge(this.space$, this.button.$)
    }

    createLoaders() {
        // Preload loader
        this.loader = new loaders.Loader(this.base)
        this.loader.add(this.config.preload)
        this.loader.$ = new Observable(observer => {
            this.loader.onProgress.add(data => observer.next(data))
            this.loader.onError.add(err     => observer.error(err))
            this.loader.onComplete.add(done => observer.complete())
        })

        // Game assets loader
        this.game.loader.baseUrl = this.base
        this.game.loader.add([
            ...this.config.common,
            ...this.config[GAME_DEVICE],
            ...this.config[GAME_RES]
        ])
        this.game.loader.$ = new Observable(observer => {
            this.game.loader.onProgress.add(data => observer.next(data))
            this.game.loader.onError.add(err     => observer.error(err))
            this.game.loader.onComplete.add(done => observer.complete())
        })
    }

    create() {
        for (let item in this.config)
            this.addView(item)
        this.$.next('CREATED')
    }

    addView(name) {
        if (this.config[name].active)
            this[name] = new this.config[name].Constructor(Object.assign({
                container: this
            }, this.config[name][GAME_DEVICE] || this.config[name]))
    }

    remove() {
        PIXI.utils.resources = this.game.loader.resources
        this.game.audio.stop(this.config.music)
        this.$.next('REMOVED')
        this.disable()
        this.destroy()
    }

}

export { Preload }