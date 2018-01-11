import './index.css'
import * as PIXI from 'pixi.js'
import 'pixi-spine'

import { Game } from './game'
import { Preload, Root, MobileRoot } from './levels'

const game = new Game({

    id: '#app',
    fps: 60,

    request: {
        url: 'https://frontqa.bossgs.net/service',
        mode: 'animalssteam',
        debug: {
            active: false,
            userID: 18,
            game: 'animalssteam'
        }
    }

})

// This is for debugging
// Remove it in Prod mode
window.game = game

const preload = [
    { name: 'preload_bg',    url: 'preload/bg.jpg' },
    { name: 'preload_bar',   url: 'preload/bar.png' },
    { name: 'preload_light', url: 'preload/light.png' },
    { url: 'preload/preload.json' }
]

const common = [
    { url: 'machine/elements/elements.json' },
            
    { name: 'jack',   url: 'machine/elements/jack.json' },
    { name: 'queen',  url: 'machine/elements/queen.json' },
    { name: 'king',   url: 'machine/elements/king.json' },
    { name: 'ace',    url: 'machine/elements/ace.json' },
    { name: 'rabbit', url: 'machine/elements/rabbit.json' },
    { name: 'mouse',  url: 'machine/elements/mouse.json' },
    { name: 'owl',    url: 'machine/elements/owl.json' },
    { name: 'cat',    url: 'machine/elements/cat.json' },
    { name: 'wild',   url: 'machine/elements/wild.json' },
    { name: 'bonus',  url: 'machine/elements/bonus.json' },
    { name: 'pig',    url: 'machine/elements/pig.json' },

    { url: 'footer/buttons.json' },
    { url: 'machine/numbers.json' },
    
    { name: 'logo',       url: 'machine/logo.json' },
    { name: 'splash',     url: 'machine/splash.json' },

    { name: 'tile',       url: 'machine/tile.png' },
    { name: 'frame',      url: 'machine/frame.png' },
    { name: 'win_table',  url: 'machine/win_table.png' },
    { name: 'win_circle', url: 'machine/win_circle.png' },
]

const mobile = [
    { url: 'mobile/buttons.json' },
    { url: 'mobile/settings.json' },
]

const desktop = [
    { url: 'machine/buttons.json' },
    { name: 'panel',      url: 'machine/panel.json' },
    { name: 'spin',       url: 'machine/button.json' },
    { name: 'panel_root', url: 'machine/panel_root.png' },
    { name: 'panel_fs',   url: 'machine/panel_fs.png' }
]

game.preload = new Preload({
    game,
    base: `src/img/${GAME_RES}`,
    config: {
        preload,
        common,
        desktop,
        mobile
    }
})

// TODO: Move it to GameController
game.request.$
    .filter(e => e.type === 'INIT')
    .subscribe(res => game.parser.init(res.data))

game.request.$
    .filter(e => e.type === 'ROLL')
    .subscribe(res => game.parser.roll(res.data))

game.device.$
    .filter(e => e.type === 'LEAVE')
    .subscribe(res => game.request.sendLogout())

game.preload.$
    .filter(e => e === 'REMOVED').take(1)
    .subscribe(e => GAME_DEVICE === 'mobile' 
        ? game.root = new MobileRoot({ game })
        : game.root = new Root({ game }))

function changeResDevice(newRes, newDevice) {

    game.root.remove()
    game.loader.reset() 
    PIXI.utils.clearTextureCache()

    

    game.preload = new Preload({
        game,
        base: `src/img/${GAME_RES}`,
        config: {
            preload,
            common,
            desktop,
            mobile
        }
    })

    game.preload.$
        .filter(e => e === 'REMOVED').take(1)
        .subscribe(e => GAME_DEVICE === 'mobile'
            ? game.root = new MobileRoot({ game })
            : game.root = new Root({ game }))

}

window.changeResDevice = changeResDevice