import { Subject, Observable } from 'rxjs'
import defaultsDeep from 'lodash.defaultsdeep'
import { FSView }  from '../components'
import { zip } from 'rxjs/observable/zip';
import { defaultNumbersConfig } from '../components/numbers';
import { Container, Sprite, Spine, BitmapText, BalanceText } from '../utils'
import { Balance } from '../components'

const defaultConfig = {
    map: {
        2: {
            animal: 'rabbit',
            item: 'carrot'
        },
        3: {
            animal: 'mouse',
            item: 'cheese'
        },
        4: {
            animal: 'owl',
            item: 'coffee'
        },
        5: {
            animal: 'cat',
            item: 'money'
        }
    },
    pigs: true,
    collector: true,
    afterEachPigWin: true,
    transition: true,
    tick: true,
    end: true,
    start: true
}

export class FSController{
    constructor({
        game,
        config,
        autoEnable = true
    }){
        this.game = game
        this.data = this.game.data
        this.state = this.game.state

        this.config = defaultsDeep(config, defaultConfig)

        this.$ = new Subject()

        if(autoEnable)
            this.enable()
    }
    
    render(){
        this.game.root.fs = new FSView({
            container: this.game.stage,
            game: this.game,
            stream: this.$,
            config:{
                counter:{
                    general:{
                        config:{
                            counter:{
                                general:{
                                    text: String(this.data.fs.count.current)
                                }
                            }
                        }
                    }
                },
                animal:{
                    general:{
                        name: `${this.config.map[this.data.fs.multi].animal}`
                    }
                } 
            }
        })
        
        this.game.root.machine.logo.showCollector()
        this.game.root.machine.panel.render({
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
        })

        this.game.root.machine.logo.collector.updateItemsTexture(this.config.map[this.data.fs.multi].item)
    }
    
    enable(){
        this.subs = []

        if(this.config.start)  
        this.subs.push(
        this.fsStartSub = this.state.isTransition$
        .filter(e => !e)
        .filter( e => this.state.mode.indexOf('fsBonus') > -1)
        .subscribe(e => {
            this.render()
            this.game.root.enableFS()
            this.enableTicker()
        }))
        
        
        if (this.config.end)
        this.subs.push(
            this.fsEndSub = this.state.next$
            .filter(e => this.state.mode !== 'root')
            .filter(e => e === 'root')
            .sample(this.state.isRolling$.filter(e => !e))
            .delay(200)
            .subscribe(e => {
                this.disableTicker()
                this.game.root.machine.logo.collector.clean()
                this.game.root.machine.logo.closeCollector()
                this.game.root.machine.panel.render()
                this.game.root.fs.remove()
                this.state.isTransition = true
                this.game.root.disableFS()
            }))

        
    }

    enableTicker(){
        if (this.config.tick)
        this.subs.push(
        this.fsTickSub = this.data.fs.count.current$
            .sample(this.state.isRolling$.filter(e => !e)) // At the end of roll
            .switchMap(e => this.data.win.lines.length // If we have win lines
                ? Observable.of(e).delay(2000) // Delay 2 seconds
                : Observable.of(e).delay(200)) // If no win lines - delay 200ms
            .subscribe(e => {
                this.game.root.machine.screen.roll()
            }))
    }

    disableTicker(){
        if(this.fsTickSub)
            this.fsTickSub.unsubscribe()
    }

    disable(){
         this.subs.forEach( sub => sub.unsubscribe())
    }
}