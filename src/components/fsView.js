import { Container, Sprite, Spine, BitmapText, BalanceText } from '../utils'
import defaultsDeep from 'lodash.defaultsdeep'
import { Subject } from 'rxjs'
import { Balance, Buttons } from './panel'
import { Panel } from '../components'
import { Collector } from './collector'

const defaultConfig = {
    views:[
        'panel',
        'counter',
        'animal'
    ],
    panel:{
        rendered: true,
        item: 'panel',
        panel: {
            active: true,
            name: 'panel',
            Constructor: Spine,
            general:{
                name:'panel',
                anim:{
                    track: 0,
                    name: 'idle',
                    repeat: true 
                }
            }
            
        },
        labels: {
            active: true,
            name: 'labels',
            Constructor: Sprite,
            general:{
                texture: 'panel_fs',
            }
        },
        buttons:{
            active: false
        },
        balance: {
            active: true,
            Constructor: Balance,
            name: 'balance',
            general:{
                y: 0.061,
                config: {
                    bet:{
                        x: -0.255,
                        y: 0,
                        text: 0,
                        fixed: 0
                    },
                    level:{
                        x: -0.255,
                        y: 0,
                        text: 0,
                        fixed: 0
                    },
                   value:{
                        x: -0.255,
                        y: 0,
                        text: 0,
                        fixed: 0
                    },
                    win:{
                        x: -0.255,
                        y: 0,
                        text: 0,
                        fixed: 0
                    },
                    total:{
                        x: -0.255,
                        y: 0,
                        text: 0,
                        fixed: 0
                    },
                    sum: {
                        x: -0.255,
                        y: 0,
                        text: 0,
                        fixed: 0
                    }
                }
            }
        },
        
    },
    counter:{
        counter:{
            name: 'counter',
            Constructor: Sprite,
            general:{
                texture: 'count_fs',
            },
            desktop:{
                y: 0.335,
                x:-0.034
            },
            mobile:{
                y: -0.376,
                x:-0.034
            }
        },
        multi:{
            name: 'multi',
            Constructor: Sprite,
            general:{
                texture:'multi_fs',
            },
            desktop:{
                y: 0.327,
                x: 0.0458
            },
            mobile:{
                y: -0.386,
                x: 0.046875
            }
        },
        counterBitmap:{
            name: 'countAmount',
            Constructor: BitmapText,
            general:{
                fontName: 'Transition',
                fontSize: 35,
                text: 'X15',
                name: 'counter'
            },
            desktop:{
                y: 0.342,
                x: -0.0328,
            },
            mobile:{
                y: -0.372,
                x: -0.034,
                fontSize: 50
            }
        },
        multiBitmap:{
            name: 'multiAmount',
            Constructor: BitmapText,
            general:{
                fontName: 'Transition',
                fontSize: 35,
                text: 'X2',
                name: 'multi'
            },
            desktop:{
                y: 0.339,
                x: 0.040,
            },
            mobile:{
                y: -0.379,
                x: 0.040,
                fontSize: 50,
            }
        }
    },
    animal:{
        animal: {
            name: 'animal',
            active: true,
            Constructor: Spine,
            general:{
                name: 'rabbit',
                anim:{
                    track: 0,
                    name: 'idle',
                    repeat: true
                },
                scale: 2.5
            },
            desktop:{
                x: -0.418,
                y: 0.217
            },
            mobile: {
                x: 0,
                y: 0
            }
    },
    }
    
}

export class FSView extends Container {
    
    constructor({
        game,
        container,
        x = 0.5,
        y = 0.5,
        config,
    }){
        super({
            container,
            x,
            y
        })

        this.config = defaultsDeep(config, defaultConfig) 

        this.$ = new Subject()
        this.tl = new TimelineMax()


        this.alreadyRendered = {
            panel: this.game.root.machine.panel
        }

        this.addCollector(this.config.collector)
        this.config.views
            .forEach(item => this.addView(this.config[item]))
        this.enable()
    }

    addCollector(config){
        this.collector = new Collector({
            container: this.game.root.machine,
            x: 0.00781,
            y: -0.3833,
            stream: this.$,
            game: this.game,
            config
        })
    }

    addView(config){
        if(Array.isArray(config)){
            this.createView(config)
        } 
        else if (config.rendered){
            this.renderExistingElement(this.alreadyRendered[config.item],config)
        }
        else {
            this.createView(config)
        }
    }

    renderExistingElement(el, config){
        if(el){
            el.rerender(config)
        }
    }

    createView(config){
        for(let item in config){
            this.createViewItem(config[item])
        }
    }

    createViewItem(item){
        this[item.name] = new item.Constructor(Object.assign(
            {container: this},
            item.general,
            item[GAME_DEVICE] || {},
        ))
    }

    enable(){
        this.subs = []
        this.subs.push(
            this.collector.$.subscribe(n => {
                this.$.next(n)
            }),

            this.animal.$
            .filter(n => n.type === 'COMPLETE' && n.anim === 'win')
            .subscribe(n => {
                this.animal.state.setAnimation(0, 'idle', true)
            })
        )
    }

    doItWhenWin(){
        this.animal.state.setAnimation(0, 'win', false)
    }

}