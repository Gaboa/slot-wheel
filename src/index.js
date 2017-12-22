import './index.css'

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
            { url: 'footer/buttons.json' }
        ]
    }
})

game.request.$
    .filter(e => e.type === 'INIT')
    .map(res => res.data)
    .subscribe(res => game.parser.init(res))

game.request.$
    .filter(e => e.type === 'ROLL')
    .map(res => res.data)
    .subscribe(res => game.parser.roll(res))

game.level.$
    .filter(e => e === 'REMOVED')
    .take(1)
    .subscribe(e => {
        game.level = new Root({
            game
        })
    })
