import './index.css'
import { Application } from 'pixi.js'
import { TweenMax } from 'gsap'

import { Wheel } from './components'
import { SpriteElement } from './components'

const game = new Application({
    width:  1280,
    height: 720
})
document.body.appendChild(game.view)
game.loader.add({
    name: 'elements', url: 'img/elements.json'
})
game.loader.load(
    () => {
        const wheels = []
        for (let i = 0; i < 3; i++) {
            wheels.push(
                new Wheel({
                    container: game.stage,
                    x: game.view.width  * 0.5 + (i - 1) * 256,
                    y: game.view.height * 0.5,
                
                    direction: 'down',
                
                    el: {
                        Element: SpriteElement,
                        amount:  5,
                        aside:   1,
                        width:   256,
                        height:  240
                    },
                
                    // Amount param in anims config should be divided by el.amount
                    start: {
                        anims:  [
                            { type: 'static', el: 'j' },
                            { type: 'static', el: 'q' },
                            { type: 'static', el: 'j' },
                            { type: 'static', el: 'q' },
                            { type: 'static', el: 'j' }
                        ],
                        amount: 10,
                        time:   0.5,
                        ease:   Back.easeIn.config(0.6)
                    },
                    loop: {
                        anims:  [
                            { type: 'blur', el: 'j' },
                            { type: 'blur', el: 'q' },
                            { type: 'blur', el: 'k' },
                            { type: 'blur', el: 'a' }
                        ],
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
            )
        }
        
        window.wheels = wheels
        window.game = game
    }
)
