import './index.css'
import { Application } from 'pixi.js'
import { TweenMax } from 'gsap'

import { Screen, Wheel, SpriteElement } from './components'

const game = new Application({
    width:  1280,
    height: 720
})
document.body.appendChild(game.view)
game.loader.add({
    name: 'elements', url: 'img/elements.json'
})
game.loader.load(
    function() {

        const screen = new Screen({
            container: game.stage,
            x: game.view.width  * 0.5,
            y: game.view.height * 0.5,
            config: {
                amount: 3,
                dir: 'right',
            }
        })
        
        window.screen = screen
        window.game = game
    }
)

window.endData = [
    [{ type: 'static', el: 'a' }, { type: 'static', el: 'j' }, { type: 'static', el: 'j' }, { type: 'static', el: 'j' }, { type: 'static', el: 'j' } ],
    [{ type: 'static', el: 'a' }, { type: 'static', el: 'k' }, { type: 'static', el: 'q' }, { type: 'static', el: 'k' }, { type: 'static', el: 'j' } ],
    [{ type: 'static', el: 'a' }, { type: 'static', el: 'a' }, { type: 'static', el: 'k' }, { type: 'static', el: 'a' }, { type: 'static', el: 'j' } ]
]
