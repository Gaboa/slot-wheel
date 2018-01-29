import { Container, Sprite, Spine, BitmapText, BalanceText } from '../utils'
import defaultsDeep from 'lodash.defaultsdeep'
import { Subject } from 'rxjs'

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
                visible: false,
                prefix: '+'
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
        game,
        config = {}
    }){
        super({
            container,
            x,
            y,
        })
        this.config = defaultsDeep(config, collectorDefaultConfig)
        debugger
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
        this.show()
       
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
                this.sendEvent()
            }
        }, 300)
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

    updateItemIndex(){
        this.index = (this.index === this.config.settings.amountOfItemsToCollect - 1) ? 0 : ++this.index
    }

    reset(){
        this.items.forEach(item => this.removeChild(item))
        this.items = []
    }

    sendEvent() {
        this.$.next({source: 'COLLECTOR', message: 'i am carrot'})
    }

    showAfterReset(){
        this.showMiddleWin()
    }

    showMiddleWin(sum = '1000'){
        this.tl
        .to(this.middleWin, 0.5, {
            alpha:1,
        })
        .to(this.winSum, 0.5, {
            visible: true,
            onComplete: ()=> {
                this.winSum.set(sum)
                this.winSum.tween.eventCallback('onComplete', this.hideMiddleWin, [], this)
            }
        })
    }

    hideMiddleWin(){
        this.tl
        .to(this, 1, {})
        .to(this.winSum, 0.1, {
                visible: false,
                onComplete:() =>{
                    this.winSum.set(0)
                }
            }
        )
        .to(this.middleWin, 0.3, {
                alpha: 0,
                onComplete:() => {
                    this.sendEvent()
                }
            }
        )
    }

    hide(){
        this.game.root.machine.logo.setAnimation({track: 0, animation: 'close', loop: false})
        //this.remove()
    }

    remove(){
        this.destroy()
    }
}