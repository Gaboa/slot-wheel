import { Container, Sprite, Spine } from '../utils'
import defaultsDeep from 'lodash.defaultsdeep'
import { Subject } from 'rxjs'
import { Balance, Buttons } from './panel'
import { Panel } from '../components'

const defaultConfig = {
    panel:{
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
        counter:{
            active: true,
            name: 'counter',
            Constructor: Sprite,
            general:{
                texture: 'count_fs',
                y: 0.031,
                x:-0.034
            }
        },
        multi:{
            active: true,
            name: 'multi',
            Constructor: Sprite,
            general:{
                texture:'multi_fs',
                y: 0.025,
                x: 0.0458
            }
        }
    }
    
}

export class FSView extends Container{
    constructor({
        game,
        container,
        x = 0.5,
        y = 0.5,
        config
    }){
        super({
            container,
            x,
            y
        })
        this.$ = new Subject()
        this.game = game
        this.config = defaultsDeep(config, defaultConfig) 
        this.rerenderExistingElement(this.game.root.machine.panel, this.config.panel)
    }

    addKeyPartOfView(piece){
        let partOfConfig = this.config[piece]
        this.createView(partOfConfig)
    }

    rerenderExistingElement(el, config){
        el.rerender(config)
    }

    createView(conf){
        for(let item in config){
            if(config[item].active){
                this.createSinglePieceOfView(config[item])
            }
        }
    }

    createSinglePieceOfView(data){
        console.log(data)
    }
}