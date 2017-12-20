import { loaders } from "pixi.js"
import { Container } from "../../utils"

const defaultConfig = {

    /*-----------------------*/
    /* -------- Logic ------ */
    /*-----------------------*/

    // Lists for loading
    common: [],
    fullHD: [],
    hd: [],
    mobile: [],

    // Logic
    logic: {
        autorun: false,
        autocreate: true,
        load: true,
        init: true,
        enter: true,
        sound: true,
        button: true,
    },

    // Debug
    debug: {
        active: false,
        service: 'animalssteam',
        mode: 'dev',
        userID: '1'
    },

    /*-----------------------*/
    /* -------- View ------- */
    /*-----------------------*/

    // BG
    bg: {
        active: true,
        texture: 'init_bg',
        x: 0,
        y: 0
    },

    // Bar
    bar: {
        active: true,
        texture: 'preload_bar',
        x: 0,
        y: 0.335,
        withMask: true
    },

    // Light
    light: {
        active: true,
        texture: 'init_light',
        x: 0,
        y: -0.1,
        alpha: 0.4,
        amount: 30
    },

    // Logo
    logo: {
        active: true,
        obj: null,
        texture: 'logo',
        x: 0,
        y: -0.1
    },

    // Fog
    fog: {
        active: false,
        texture: 'fog',
        scale: 5,
        x: 0,
        y: 0.4
    },

    // Copyright
    copy: {
        active: true,
        desktop: {
            texture: 'copyright',
            x: -0.425,
            y: 0.425,
            scale: 1
        },
        mobile: {
            texture: 'copyright',
            x: -0.37,
            y: 0.39,
            scale: 1.5
        }
    },

    // Button
    button: {
        active: true,
        texture: 'continue',
        x: 0,
        y: 0.75,
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
            alpha: 0.35,
            state: true
        },
        mobile: {
            x: 0.36,
            y: 0.39,
            scale: 1.6,
            color: 0x286e95,
            alpha: 0.35,
            state: false
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

        this.loader = new loaders.Loader(base)
    }

    addView(config, name, Constructor) {
        if (config[name].active)
            this[name] = new Constructor(Object.assign({
                container: this
            }, config[name][game.device] || config[name]))
    }

}