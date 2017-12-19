import './index.css'

import { TweenMax } from 'gsap'
import { Game } from './game'
import { Screen } from './components'

const game = new Game({
    id: '#app',
    fps: 30,
    device: {
        mode: 'aspect'
    }
})

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
                    fast:   1.5
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

window.endH = [
    [{ type: 'static', el: '2' }, { type: 'static', el: '4' }, { type: 'static', el: '6' }, { type: 'static', el: '8' }, { type: 'static', el: '10' } ],
    [{ type: 'static', el: '2' }, { type: 'static', el: '4' }, { type: 'static', el: '6' }, { type: 'static', el: '8' }, { type: 'static', el: '10' } ],
    [{ type: 'static', el: '2' }, { type: 'static', el: '4' }, { type: 'static', el: '6' }, { type: 'static', el: '8' }, { type: 'static', el: '10' } ]
]
window.endV = [
    [{ type: 'static', el: '1' }, { type: 'static', el: '2' }, { type: 'static', el: '3' }, { type: 'static', el: '4' }, { type: 'static', el: '5' }  ],
    [{ type: 'static', el: '1' }, { type: 'static', el: '2' }, { type: 'static', el: '3' }, { type: 'static', el: '4' }, { type: 'static', el: '5' }  ],
    [{ type: 'static', el: '1' }, { type: 'static', el: '2' }, { type: 'static', el: '3' }, { type: 'static', el: '4' }, { type: 'static', el: '5' }  ],
    [{ type: 'static', el: '1' }, { type: 'static', el: '2' }, { type: 'static', el: '3' }, { type: 'static', el: '4' }, { type: 'static', el: '5' }  ],
    [{ type: 'static', el: '1' }, { type: 'static', el: '2' }, { type: 'static', el: '3' }, { type: 'static', el: '4' }, { type: 'static', el: '5' }  ]
]
