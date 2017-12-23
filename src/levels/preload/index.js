import { loaders } from "pixi.js"
import defaultsDeep from 'lodash.defaultsdeep'
import { Subject, Observable } from "rxjs"
import { Container, Sprite } from "../../utils"
import { JumpingButton, Darkness, Bar, Light, SoundTrigger } from "./helpers"

// TODO: Add error handling. Error can be in INIT request, and with loading assets

const defaultConfig = {

    // Lists for loading
    preload: [],

    common: [],
    fullhd: [],
    hd: [],

    mobile: [],
    desktop: [],

    /*-----------------------*/
    /* -------- View ------- */
    /*-----------------------*/

    // BG
    bg: {
        active: true,
        texture: 'preload_bg',
        name: 'bg',
        x: 0,
        y: 0
    },

    // Bar
    bar: {
        active: true,
        texture: 'preload_bar',
        name: 'bar',
        x: 0,
        y: 0.335
    },

    // Light
    light: {
        active: true,
        texture: 'preload_light',
        name: 'light',
        x: 0,
        y: -0.1,
        alpha: 0.4
    },

    // Logo
    logo: {
        active: true,
        texture: 'preload_logo',
        name: 'logo',
        x: 0,
        y: -0.1
    },

    // Copyright
    copy: {
        active: true,
        desktop: {
            texture: 'preload_copy',
            name: 'copy',
            x: -0.425,
            y: 0.425,
            scale: 1
        },
        mobile: {
            texture: 'preload_copy',
            name: 'copy',
            x: -0.37,
            y: 0.39,
            scale: 1.5
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
    },

    // Sound
    sound: {
        active: true,
        desktop: {
            x: 0.395,
            y: 0.425,
            scale: 1,
            color: 0x286e95,
            alpha: 0.4
        },
        mobile: {
            x: 0.36,
            y: 0.39,
            scale: 1.6,
            color: 0x286e95,
            alpha: 0.35
        }
    },

    // Darkness
    darkness: {
        active: true,
        x: 0,
        y: 0,
        autoShow: false,
        autoHide: true
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

        this.enablePreloadStreams()
        this.loader.load()
    }

    enablePreloadStreams() {
        this.subs = []
        this.$ = new Subject()

        // When loads prelod assets => create Preload level and start loading game assets with logic
        this.subs.push(
        this.loaderCompleteSub = this.loader.$
            .subscribe({ complete: () => {
                this.createLevel()
                this.enableStreams()
                this.game.loader.load()
                this.game.request.sendInit()
            }}))

    }

    enableStreams() {
        // When progress loading game assets => change progress bar visibility
        this.subs.push(
        this.gameLoaderProgressSub = this.game.loader.$
            .pluck('progress')
            .subscribe(p => this.bar.progress(p)))

        // When game assets loding finished => trigger LOAD_COMPLETE event
        this.subs.push(
        this.gameLoaderCompleteSub = this.game.loader.$
            .subscribe({ complete: () => this.$.next('LOAD_COMPLETE') }))

        // When init request done => trigger INIT_DONE event
        this.subs.push(
        this.initRequestSub = this.game.request.$
            .filter(r => r.type === 'INIT')
            .subscribe(() => this.$.next('INIT_DONE')))

        // When LOAD_COMPLETE and INIT_DONE events triggers => trigger COMPLETE event
        this.subs.push(
        this.initAndLoadCompleteSub = this.$
            .bufferCount(2).take(1)
            .subscribe(arr => {
                if (arr.indexOf('INIT_DONE') !== -1
                 && arr.indexOf('LOAD_COMPLETE') !== -1)
                    this.$.next('COMPLETE')
            }))

        // When COMPLETE triggers => hide BAR and show BUTTON
        this.subs.push(
        this.completeSub = this.$
            .filter(e => e === 'COMPLETE')
            .subscribe(e => {
                this.bar.hide()
                this.button.show()
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
            .subscribe(e => this.removeLevel()))

        // Bind sound trigger state to global isSound state
        this.subs.push(
        this.soundStateSub = this.game.state.settings.isSound$
            .subscribe(e => this.sound.changeTo(e)))

        // When sound cliked => trigger isSound state
        this.subs.push(
        this.soundTriggerSub = this.sound.$
            .subscribe(e => this.game.state.settings.isSound = !this.game.state.settings.isSound))
        
    }

    disableStreams() {
        this.subs.forEach(sub => sub.unsubscribe())
        this.$.complete()
    }

    createButtonAndKeyboardListener() {
        this.space$ = Observable.fromEvent(document, 'keyup')
            .pluck('code')
            .map(code => String(code).toLowerCase())
            .filter(code => code === 'space')
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

    createLevel() {
        this.addView('bg', Sprite)
        this.addView('light', Light)
        this.addView('logo', Sprite)
        this.addView('copy', Sprite)
        this.addView('button', JumpingButton)
        this.addView('bar', Bar)
        this.addView('sound', SoundTrigger)
        this.addView('darkness', Darkness)
        this.$.next('CREATED')
    }

    addView(name, Constructor) {
        if (this.config[name].active)
            this[name] = new Constructor(Object.assign({
                container: this
            }, this.config[name][GAME_DEVICE] || this.config[name]))
    }

    removeLevel() {
        PIXI.utils.resources = this.game.loader.resources
        this.$.next('REMOVED')
        this.disableStreams()
        this.removeChildren()
        this.destroy()
    }

}

export { Preload }