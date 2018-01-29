import { Container, Sprite, Spine, BitmapText, BalanceText } from '../utils'
import defaultsDeep from 'lodash.defaultsdeep'
import { Subject } from 'rxjs'
import { Balance, Buttons } from './panel'
import { Panel } from '../components'
import { TimelineMax, TweenMax } from 'gsap';

const collectorDefaultConfig = {
    settings:{
        amountOfItemsToCollect: 5,
        maxLevel: 20,
        item:{
            name: 'item',
            Constructor: Sprite,
            texture: 'carrot',
        },
        startX: -157,
        startY: null,
        delta: 75,
        horizontal: true,
        vertical: false,
        afterEveryItem: false,
        afterSetOfItems: true
    },
    view:{
        bg: {
            name: 'bg',
            Constructor: Sprite,
            general:{
                texture: 'middle'
            },
            desktop:{
                x:0,
                y:0,
            },
            mobile:{
                x:0,
                y:0,
            }
        },
        middleWin:{
            name:'middleWin',
            Constructor: Sprite,
            general:{
                texture: 'middle_win',
            },
            desktop:{
                x:0,
                y:0.0027,
                alpha: 0
            },
            mobile:{
                x:0,
                y:0,
            }
        },
        winSum:{
            name:'winSum',
            Constructor: BalanceText,
            general:{
                fixed: 0,
                fontSize: 30,
                visible: false
            },
            desktop:{
                x:0,
                y:0.0027,
                alpha: 0
            },
            mobile:{
                x:0,
                y:0,
            }
        }
        
    }
}

export class Collector extends Container{
    constructor({
        container,
        x,
        y,
        stream,
        game,
        config = {}
    }){
        super({
            container,
            x,
            y,
        })
        this.config = defaultsDeep(config, collectorDefaultConfig)
        this.game = game
        this.$ = new Subject()
        this.items = []
        this.tl = new TimelineMax()

        this.coordsMap = {}
        this.fillInCoordsMap()

        this.currentLevel = 0
        this.index = 0

        this.addView(this.config.view)

        this.startX = -157
       
    }

    show(){
        this.game.root.machine.logo.setAnimation({track: 0, animation: 'open', loop: false})
        this.game.root.machine.swapChildren(this, this.game.root.machine.logo)
    }

    fillInCoordsMap(){
        for (let i = 0; i < this.config.settings.amountOfItemsToCollect; i++ ){
            if(this.config.settings.horizontal){
                this.coordsMap[i] = {
                    x: this.config.settings.startX ? this.config.settings.startX + i * this.config.settings.delta : 0 ,
                    y: 0
                }
            } 
            if(this.config.settings.vertical){
                this.coordsMap[i] = {
                    x: 0,
                    y: this.config.settings.startY ? this.config.settings.startY + i * this.config.settings.delta : 0 
                }
            }
        }
    }

    addView(conf){
        for(let i in conf){
            this.addSingleView(conf[i])
        }
    }

    addSingleView(conf){
        this[conf.name] = new conf.Constructor(Object.assign(
            {container:this},
            conf.general,
            conf[GAME_DEVICE]
        ))
    }

    showItem(){
        this.createItem(this.index)
        this.updateItemIndex()
        setTimeout(() => {
            if(this.index === 0){
                this.reset()
                this.showAfterReset()
            } else {
                this.showAfterEvery()
            }
        }, 300)
    }

    showAfterEvery() {
        
        this.$.next({source: 'COLLECTOR', message: 'i am carrot'})
    }
    
    showAfterReset(){
        this.$.next({source: 'COLLECTOR', message: 'i am carrot', type:'RESET'})
    }

    updateItemIndex(){
        this.index = (this.index === this.config.settings.amountOfItemsToCollect - 1) ? 0 : ++this.index
    }

    createItem(index){
        this.item = new Sprite({
            container: this,
            x: this.coordsMap[index].x,
            y: this.coordsMap[index].y,
            texture: this.config.settings.item.texture
        })

        this.items.push(this.item)
    }

    reset(saved){
        this.items.forEach(item => this.removeChild(item))
        this.items = []
    }

    showMiddleWin(sum = '+1000'){
        TweenMax.to(this.middleWin, 0.5, {
            alpha:1
        })
        TweenMax.to(this.winSum, 0.5, {
            visible: true,
            onComplete: ()=> {
                this.winSum.set(sum)
            }
        })
    }

    hideMiddleWin(){
        TweenMax.to(this.middleWin, 0.5, {
            alpha: 0
        })
        TweenMax.to(this.winSum, 0.5, {
            visible: false,
        })
    }
}

const defaultConfig = {
    panel:{
        rendered: true,
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
            active: true,
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
            active: true,
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
            active: true,
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
            active: true,
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
    characters: [
        {
            animal:{
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
            }
        }
    ]
}

export class FSView extends Container{
    constructor({
        game,
        container,
        x = 0.5,
        y = 0.5,
        config,
        stream
    }){
        super({
            container,
            x,
            y
        })

        this.fsController$ = stream
        this.$ = new Subject()
        this.tl = new TimelineMax()

        this.subs = []
        this.game = game
        this.config = defaultsDeep(config, defaultConfig) 
        this.alreadyRendered = {
            panel: this.game.root.machine.panel
        }

        this.addCollector()
        this.addView(this.config)
        this.setStreams()
    }

    addCollector(){
        this.collector = new Collector({
            container: this.game.root.machine,
            x: 0.00781,
            y: -0.3833,
            stream: this.$,
            game: this.game
        })

        this.collector.show()
    }

    addView(config){
        for(let item in config){
            if(Array.isArray(config[item])){
                config[item].forEach( child => {
                    this.createView(child)
                })
            } 
            else if (config[item].rendered){
                this.rerenderExistingElement(this.alreadyRendered[item],config[item] )
            }
            else {
                this.createView(config[item])
            }
        }
    }

    rerenderExistingElement(el, config){
        if(el){
            el.rerender(config)
        }
    }

    createView(config){
        for(let item in config){
            if(config[item].active){
                this.createSingleViewItem(config[item])
            }
        }
    }

    createSingleViewItem(item){
        this[item.name] = new item.Constructor(Object.assign(
            {container: this},
            item.general,
            item[GAME_DEVICE] || {}
        ))
    }

    setStreams(){
        this.subs.push(
            this.collector.$.subscribe(n => {
                this.doItAfterEveryItem()
                this.$.next(n)
            }),

            this.collector.$
            .filter(n => n.type === 'RESET')
            .subscribe(n => {
                this.doItAfterSetOfItems()
                this.$.next(n)
            }),

            this.animal.$
            .filter(n => n.type === 'COMPLETE' && n.anim === 'win')
            .subscribe(n => {
                this.animal.state.setAnimation(0, 'idle', true)
            })
        )
    }

    doItAfterEveryItem(){
        this.animal.state.setAnimation(0, 'win', false)
    }

    doItAfterSetOfItems(){
        this.collector.showMiddleWin()
        this.collector.hideMiddleWin()
    }

}