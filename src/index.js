import './index.css'
import { Application } from 'pixi.js'
import { Wheel } from './components'
import { TweenMax } from 'gsap';

const game = new Application({
    width:  800,
    height: 500
})
document.body.appendChild(game.view)

const wheel = new Wheel({
    container: game.stage,
    x: 400,
    y: 250,

    direction: 'right',

    el: {
        amount: 5,
        aside:  1,
        width:  100,
        height: 100
    },

    start: {
        anims:  [0, 1, 2, 3, 4],
        amount: 10,
        time:   0.5,
        ease:   Back.easeIn.config(0.6)
    },
    loop: {
        amount: 5,
        time:   0.12,
        ease:   Linear.easeNone
    },
    end: {
        amount: 10,
        time:   0.5,
        ease:   Back.easeOut.config(0.6)
    }
})

window.wheel = wheel