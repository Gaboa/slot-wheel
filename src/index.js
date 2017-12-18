import './index.css'
import { Application } from 'pixi.js'
import { TweenMax } from 'gsap'

import { StateManager } from './game'
import { Screen, Wheel, SpriteElement } from './components'

const game = new Application({
    width:  1280,
    height: 720
})
window.GAME_WIDTH = 1280
window.GAME_HEIGHT = 720
document.body.appendChild(game.view)
game.loader.baseUrl = 'src/'
game.loader
    .add({ url: 'img/elements.json' })
    .load((loader, resources) =>  {

        const screen = new Screen({
            container: game.stage,
            x: 0.5,
            y: 0.5,
            config: {
                amount: 5,
                dir: 'down',

                loop: {
                    amount: 20,
                    time:   0.5
                },

                roll: {
                    normal: 1,
                    fast: 1.5
                },

                log: {
                    screen: false,
                    wheel: false,
                    el: false
                }
            },
            dt: 0.075
        })
        
        window.screen = screen
        window.game = game
    }
)

window.endHorizontalData = [
    [{ type: 'static', el: '2' }, { type: 'static', el: '4' }, { type: 'static', el: '6' }, { type: 'static', el: '8' }, { type: 'static', el: '10' } ],
    [{ type: 'static', el: '2' }, { type: 'static', el: '4' }, { type: 'static', el: '6' }, { type: 'static', el: '8' }, { type: 'static', el: '10' } ],
    [{ type: 'static', el: '2' }, { type: 'static', el: '4' }, { type: 'static', el: '6' }, { type: 'static', el: '8' }, { type: 'static', el: '10' } ]
]
window.endVerticalData = [
    [{ type: 'static', el: '1' }, { type: 'static', el: '2' }, { type: 'static', el: '3' }, { type: 'static', el: '4' }, { type: 'static', el: '5' }  ],
    [{ type: 'static', el: '1' }, { type: 'static', el: '2' }, { type: 'static', el: '3' }, { type: 'static', el: '4' }, { type: 'static', el: '5' }  ],
    [{ type: 'static', el: '1' }, { type: 'static', el: '2' }, { type: 'static', el: '3' }, { type: 'static', el: '4' }, { type: 'static', el: '5' }  ],
    [{ type: 'static', el: '1' }, { type: 'static', el: '2' }, { type: 'static', el: '3' }, { type: 'static', el: '4' }, { type: 'static', el: '5' }  ],
    [{ type: 'static', el: '1' }, { type: 'static', el: '2' }, { type: 'static', el: '3' }, { type: 'static', el: '4' }, { type: 'static', el: '5' }  ]
]

window.state = new StateManager({  })
