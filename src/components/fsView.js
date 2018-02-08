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
            x:-0.274
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
            x: 0.442
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
            x: -0.271,
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
                x: 0.435,
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

export class Animal  extends Spine{
    constructor({
        container,
        x,
        y,
        config
        
    }){
        super(Object.assign({}, config, {container, x, y}))
        this.addListeners()
    }
    
    addListeners(){
        this.state.addListener({
            complete:(entry, ev) => {
                if(entry.animation.name === 'win') this.state.setAnimation(0, 'idle', true)
            }
        })
    }
}

const defaultConfig = {
    views:[
        'counter',
        'animal'
    ],
    
    counter:{
        Constructor: FSCounter,
        general:{
            name: 'counter',
        },
        desktop:{
            x: 0,
            y: 0
        }
    },

    animal: {
        Constructor: Animal,
        general:{
            name: 'animal',
            config:{
                name: 'rabbit',
                anim:{
                    track: 0,
                    name: 'idle',
                    repeat: true
                },
                index: 0,
                scale: 2.5
            }
        },
        desktop:{
            x: -0.418,
            y: 0.217
        },
        mobile: {
            x: -0.393,
            y: 0.172
        }
    },
    
}

export class FSView extends Container {
    
    constructor({
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
        
        this.config.views
            .forEach(item => this.addView(this.config[item]))
    }

    addView(config){
        if(Array.isArray(config))
            config.forEach(c => this.createViewItem(c))
        else 
            this.createViewItem(config)
    }

    createViewItem(item){
        this[item.general.name] = new item.Constructor(Object.assign(
            {container: this},
            item.general,
            item[GAME_DEVICE] || {},
        ))
    }

    remove(){
        this.destroy()
    }

}