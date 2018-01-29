import { Subject } from 'rxjs'
import defaultsDeep from 'lodash.defaultsdeep'
import { FSView }  from '../components'
import { zip } from 'rxjs/observable/zip';
import { defaultNumbersConfig } from '../components/numbers';

const defaultConfig = {
    multiesMap:{
        2: 'bonus',
        3: 'rabbit',
        4: 'owl',
        5: 'cat'
    },
    itemsMap:{
        2: 'cheese',
        3: 'coffee',
        4: 'cheese',
        5: 'coin'
    }
}

export class FSController{
    constructor({
        game,
        data = {
            fs:{
                bonus:{},
                count: {
                    current: 10,
                    win: null
                },
                level: 0,
                multi: 4,
                win:{
                    cash:0,
                    coin:0
                },
            }
            
        },
        state,
        config
    }){
        this.game = game
        this.data = data
        this.state = state
        this.config = defaultsDeep(config, defaultConfig)

        this.$ = new Subject()
        this.subs = []
        this.currentLevel = 0
        
        // delete
        this.pigSimulator()

        this.render()
        this.enable()
    }

    pigSimulator(){
        this.game.root.pig$ = new Subject()
    }

    render(){
        this.fsView = new FSView({
            container: this.game.stage,
            game: this.game,
            stream: this.$,
            config:{
                panel: {},
                counter:{
                    counter:{},
                    multi: {},
                    counterBitmap:{
                        general:{
                            text: `${this.data.fs.count.current}`
                        }
                    },
                    multiBitmap:{
                        general:{
                            text: `X${this.data.fs.multi}`
                        }
                    },
                },
                characters:[
                    {
                        animal:{
                            general:{
                                name:`${this.config.multiesMap[this.data.fs.multi]}`
                            }
                        }
                    }
                ],
                collector:{
                    settings:{
                        item:{
                            texture: `${this.config.itemsMap[this.data.fs.multi]}`
                        }
                    }
                }
            }
        })
    }

    enable(){
        this.subs.push(
            this.pigSub = this.game.root.pig$
            // some filter on pig events
            .subscribe( n => {
                this.$.next(this.data.fs) 
            }),
            
            this.zippedSub = zip(
                this.game.root.pig$,
                this.fsView.$
            )
            .subscribe(n => {
                if(this.fsView.collector){
                    this.fsView.collector.showItem()
                }
            }),

            // this.animalSub = this.data.win.lines$
            //     .sample(this.state.isRolling$)
            //     .subscribe(n => {
            //         this.fsView.doItWhenWin()
            //     })

        )    
        this.fsView.$.next({})
    }

    disable(){
        this.subs.forEach( sub => sub.unsubscribe())
    }
}