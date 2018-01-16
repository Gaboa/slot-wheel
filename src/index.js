import './index.css'
import * as PIXI from 'pixi.js'
import 'pixi-spine'
import Vue from 'vue' 
import defaultsDeep from 'lodash.defaultsdeep'

import { Game } from './game'
import { Preload, Root } from './levels'
//import Info from './components/vue-components/Info'
import Settings from './components/vue-components/Settings'

const game = new Game({
    id: '#app',
    fps: 60,

    device: {},

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

window.game = game

const info = document.createElement('div')
info.setAttribute('id', 'info')
document.getElementById('app').appendChild(info)

const settings = document.createElement('div')
settings.setAttribute('id', 'settings')
document.getElementById('app').appendChild(settings)

game.level = new Preload({
    game,
    base: `src/img/${GAME_RES}`,
    config: {
        preload: [
            { name: 'preload_bg',    url: 'preload/bg.jpg' },
            { name: 'preload_bar',   url: 'preload/bar.png' },
            { name: 'preload_light', url: 'preload/light.png' },
            { url: 'preload/preload.json' }
        ],
        common: [
            { url: 'machine/elements/elements.json' },
            
            { name: 'jack', url: 'machine/elements/jack.json' },
            { name: 'queen', url: 'machine/elements/queen.json' },
            { name: 'king', url: 'machine/elements/king.json' },
            { name: 'ace', url: 'machine/elements/ace.json' },
            { name: 'rabbit', url: 'machine/elements/rabbit.json' },
            { name: 'mouse', url: 'machine/elements/mouse.json' },
            { name: 'owl', url: 'machine/elements/owl.json' },
            { name: 'cat', url: 'machine/elements/cat.json' },
            { name: 'wild', url: 'machine/elements/wild.json' },
            { name: 'bonus', url: 'machine/elements/bonus.json' },
            { name: 'pig', url: 'machine/elements/pig.json' },
            
            { url: 'footer/buttons.json' },
            { url: 'machine/buttons.json' },
            { name: 'tile', url: 'machine/tile.png' },
            { name: 'frame', url: 'machine/frame.png' },
            { name: 'panel_root', url: 'machine/panel_root.png' },
            { name: 'panel_fs', url: 'machine/panel_fs.png' },
            { name: 'win_table', url: 'machine/win_table.png' },
            { name: 'win_circle', url: 'machine/win_circle.png' },
            { name: 'logo', url: 'machine/logo.json' },
            { name: 'panel', url: 'machine/panel.json' },
            { name: 'spin', url: 'machine/button.json' }
        ]
    }
})



game.request.$
    .filter(e => e.type === 'INIT')
    .subscribe(res => game.parser.init(res.data))

game.request.$
    .filter(e => e.type === 'ROLL')
    .subscribe(res => game.parser.roll(res.data))

game.device.$
    .filter(e => e.type === 'LEAVE')
    .subscribe(res => game.request.sendLogout())

game.level.$
    .filter(e => e === 'REMOVED').take(1)
    .subscribe(e => game.level = new Root({ game }))

// Experiment with resolution changing
// setTimeout(() => {
//     GAME_RES = 'hd'
//     GAME_WIDTH = 1280
//     GAME_HEIGHT = 720
//     game.renderer.resize(1280, 720)
//     game.level.removeLevel()
//     game.loader.reset()
//     PIXI.utils.clearTextureCache()
//     game.level = new Preload({
//         game,
//         base: `src/img/${GAME_RES}`,
//         config: {
//             preload: [
//                 { name: 'preload_bg', url: 'preload/bg.jpg' },
//                 { name: 'preload_bar', url: 'preload/bar.png' },
//                 { name: 'preload_light', url: 'preload/light.png' },
//                 { url: 'preload/preload.json' }
//             ],
//             common: [
//                 { url: 'machine/elements/elements.json' },

//                 { name: 'jack', url: 'machine/elements/jack.json' },
//                 { name: 'queen', url: 'machine/elements/queen.json' },
//                 { name: 'king', url: 'machine/elements/king.json' },
//                 { name: 'ace', url: 'machine/elements/ace.json' },
//                 { name: 'rabbit', url: 'machine/elements/rabbit.json' },
//                 { name: 'mouse', url: 'machine/elements/mouse.json' },
//                 { name: 'owl', url: 'machine/elements/owl.json' },
//                 { name: 'cat', url: 'machine/elements/cat.json' },
//                 { name: 'wild', url: 'machine/elements/wild.json' },
//                 { name: 'bonus', url: 'machine/elements/bonus.json' },
//                 { name: 'pig', url: 'machine/elements/pig.json' },

//                 { url: 'footer/buttons.json' },
//                 { url: 'machine/buttons.json' },
//                 { name: 'tile', url: 'machine/tile.png' },
//                 { name: 'frame', url: 'machine/frame.png' },
//                 { name: 'panel_root', url: 'machine/panel_root.png' },
//                 { name: 'panel_fs', url: 'machine/panel_fs.png' },
//                 { name: 'win_table', url: 'machine/win_table.png' },
//                 { name: 'win_circle', url: 'machine/win_circle.png' },
//                 { name: 'logo', url: 'machine/logo.json' },
//                 { name: 'panel', url: 'machine/panel.json' },
//                 { name: 'spin', url: 'machine/button.json' }
//             ]
//         }
//     })

//     game.level.$
//         .filter(e => e === 'REMOVED').take(1)
//         .subscribe(e => game.level = new Root({ game }))
// }, 10000)