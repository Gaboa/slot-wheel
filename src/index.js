import './index.css'
import * as PIXI from 'pixi.js'
import 'pixi-spine'

import { Game } from './game'
import { Preload, Root } from './levels'

const game = new Game({
    id: '#app',
    fps: 30,

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
            { url: 'elements.json' },
            { url: 'footer/buttons.json' },
            { url: 'machine/buttons.json' },
            { name: 'tile', url: 'machine/tile.png' },
            { name: 'frame', url: 'machine/frame.png' },
            { name: 'panel_root', url: 'machine/panel_root.png' },
            { name: 'panel_fs', url: 'machine/panel_fs.png' },
            { name: 'win_table', url: 'machine/win_table.png' },
            { name: 'logo', url: 'machine/logo.json' },
            { name: 'panel', url: 'machine/panel.json' },
            { name: 'spin', url: 'machine/button.json' },
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
