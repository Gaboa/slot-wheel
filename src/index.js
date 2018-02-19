import './index.css'
import 'pixi.js'
import 'pixi-spine'

import buildConfig from '../config/config'

import {
    Game,
    GameController,
    Preload
} from '../COREv3'

import { MobileRoot, DesktopRoot } from './root'

import {
    sprites,
    common,
    desktop,
    mobile,
    preload
} from './loadlist'

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

game.ctrl = new GameController({
    game,
    config: {
        constructors: {
            Preload,
            MobileRoot,
            DesktopRoot
        },
        load: {
            preload,
            common,
            desktop,
            mobile
        }
    }
})
game.ctrl.preload()

// Remove it in Prod mode
window.game = game