import './index.css'
import * as PIXI from 'pixi.js'
import 'pixi-spine'
import Vue from 'vue' 
import defaultsDeep from 'lodash.defaultsdeep'

import buildConfig from '../config/config'
import { Game } from './game'
import { GameController } from './controllers'
//import Info from './components/vue-components/Info'
import Settings from './components/vue-components/Settings'

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
    }
})

game.ctrl = new GameController({ game })
game.ctrl.preload()

const info = document.createElement('div')
info.setAttribute('id', 'info')
document.getElementById('app').appendChild(info)
const settings = document.createElement('div')
settings.setAttribute('id', 'settings')
document.getElementById('app').appendChild(settings)
// Remove it in Prod mode
window.game = game