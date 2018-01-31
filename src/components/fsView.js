import { Container, Sprite, Spine, BitmapText, BalanceText } from '../utils'
import defaultsDeep from 'lodash.defaultsdeep'
import { Subject } from 'rxjs'
import { Balance, Buttons } from './panel'

const counterDefaultConfig = {
    views: [
        'counterBg',
        'multiBg',
        'counter',
        'multi'
    ],
    counterBg:{
        Constructor: Sprite,
        general:{
            name: 'counterBg',
            texture: 'count_fs',
        },
        desktop:{
            y: 0.335,
            x:-0.034
        },
        mobile:{
            y: -0.409,
            x:-0.454
        }
    },
    multiBg:{
        Constructor: Sprite,
        general:{
            name: 'multiBg',
            texture:'multi_fs',
        },
        desktop:{
            y: 0.327,
            x: 0.0458
        },
        mobile:{
            y: -0.409,
            x: 0.264
        }
    },
    counter:{
        Constructor: BitmapText,
        general:{
            name: 'count',
            fontName: 'Transition',
            fontSize: 35,
            text: '15',
        },
        desktop:{
            y: 0.342,
            x: -0.0328,
        },
        mobile:{
            y: -0.404,
            x: -0.452,
            fontSize: 50
        }
    },
    multi:{
        Constructor: BitmapText,
        general:{
            name: 'multiA',
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
                y: -0.404,
                x: 0.257,
                fontSize: 50,
            }
    }
}

export class FSCounter extends Container{
    constructor({
        container,
        x,
        y,
        config
    }){
        super({
            container,
            x,
            y
        })
        this.config = defaultsDeep(config, counterDefaultConfig)
        this.config.views.forEach(item => this.addView(this.config[item]))
    }

    addView(item){
        this[item.general.name] = new item.Constructor(Object.assign( 
            {container: this}, 
            item.general, 
            item[GAME_DEVICE]))
        return this[item.general.name]
    }
}

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
                        active: true,
                        x: -0.255,
                        y: 0,
                        text: 0,
                        fixed: 0
                    },
                    level:{
                        active: true,
                        x: -0.189,
                        y: 0,
                        text: 0,
                        fixed: 0
                    },
                   value:{
                    active: true,
                        x: -0.119,
                        y: 0,
                        text: 0,
                        fixed: 2
                    },
                    win:{
                        active: true,
                        x: 0.1130,
                        y: 0,
                        text: 0,
                        fixed: 0
                    },
                    total:{
                        active: true,
                        x: 0.170,
                        y: 0,
                        text: 0,
                        fixed: 0
                    },
                    sum: {
                        active: true,
                        x: 0.250,
                        y: 0,
                        text: 0,
                        fixed: 0
                    },
                    lines:{
                        active: false
                    }
                }
            }
        },
        
    },
    counter:{
        counter:{
            Constructor: FSCounter,
            general:{
                name: 'counter',
            },
            desktop:{
                x: 0,
                y: 0
            }
        }
    },
    animal:{
        animal: {
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

        // ?????
        this.game = game
        this.alreadyRendered = {
            panel: this.game.root.machine.panel
        }
        if(GAME_DEVICE === 'mobile'){
            this.game.root.footer.balance.changeModeTo('fs', true)
        }
        // ????
        
        this.config.views
            .forEach(item => this.addView(this.config[item]))
        this.enable()

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
        this[item.general.name] = new item.Constructor(Object.assign(
            {container: this},
            item.general,
            item[GAME_DEVICE] || {},
        ))
    }

    enable(){
        this.subs = []
    }

    doItWhenWin(){
        this.animal.state.setAnimation(0, 'win', false)
    }

}