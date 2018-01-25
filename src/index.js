import './index.css'
import 'pixi.js'
import 'pixi-spine'

import buildConfig from '../config/config'
import { Game } from './game'
import { GameController } from './controllers'
import { sprites } from './utils'

const game = new Game({
    id: '#app',
    fps: 60,
    request: {
        url: buildConfig.serviceURL,
        mode: 'themoney',
        debug: {
            active: false,
            userID: 18,
            game: 'themoney'
        }
    },
    audio: {
        src: ['sound/sprite.ogg', 'sound/sprite.mp3'],
        sprites 
    }
})

game.ctrl = new GameController({ game, config: {
    load: {
        sound: {
            desktop: {
                color: 0x9a0025
            },
            mobile: {
                color: 0x9a0025
            }
        }
    }
} })
game.ctrl.preload()

// Remove it in Prod mode
window.game = game