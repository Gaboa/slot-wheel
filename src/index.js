import './index.css'

import { Game } from './game'
import { Screen } from './components'

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

game.loader.baseUrl = 'src/'
game.loader
    .add({ url: 'img/elements.json' })
    .load((loader, resources) =>  {

        const scr = new Screen({
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
                    normal: 0.2,
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

        game.request.sendInit()

        scr.$
            .filter(e => e.from === 'SCREEN')
            .filter(e => e.state === 'START')
            .subscribe(e => game.request.sendRoll({
                value: game.data.balance.value,
                level: game.data.balance.level
            }))

        game.request.$
            .filter(res => res.type === 'INIT')
            .map(res => res.data)
            .pluck('FirstScreen')
            .take(1)
            .subscribe(s => game.data.screen = s)

        game.request.$
            .filter(res => res.type === 'ROLL')
            .map(res => res.data)
            .pluck('Screen')
            .subscribe(s => game.data.screen = s)

        game.data.screen$
            .filter(e => Array.isArray(e))
            .map(s => s.map(r => r.map(el => { return { type: 'static', el } })))
            .take(1)
            .do(e => console.log('I have init screen: ', e))
            .subscribe(s => scr.setStartScreen(s))
            
        game.data.screen$
            .filter(e => Array.isArray(e))
            .map(s => s.map(r => r.map(el => { return { type: 'static', el } })))
            .skip(1)
            .do(e => console.log('I have roll screen: ', e))
            .subscribe(s => scr.setEndScreen(s))

        // Sound setings state
        game.state.settings.isEffects$
            .combineLatest(game.state.settings.isMusic$)
            .subscribe(data => {
                if (data.every(e => e === false)) game.state.settings.isSound = false
                else game.state.settings.isSound = true
            })
            
        // game.state.settings.isMusic$
        //     .combineLatest(game.state.settings.isEffects$)
        //     .subscribe(data => {
        //         if (!data[0] && !data[1]) game.state.settings.isSound = false
        //         else game.state.settings.isSound = true
        //     })
            

        window.scr = scr
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
