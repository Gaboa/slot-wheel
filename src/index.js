import './index.css'
import * as PIXI from 'pixi.js'
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
        mode: 'animalssteam',
        debug: {
            active: false,
            userID: 18,
            game: 'animalssteam'
        }
    },
    audio: {
        src: ['sound/sprite.ogg', 'sound/sprite.mp3'],
        sprites 
    }
})

game.ctrl = new GameController({ game })
game.ctrl.preload()

// Remove it in Prod mode
window.game = game