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
}

export class FSController{
    constructor({
        game,
        data = {
            fs:{
                bonus:{},
                count: 15,
                level: 0,
                multi: 4,
                win:{
                    cash:0,
                    coin:0
                },
                maxLevel: 15
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
                            text: `${this.data.fs.count}`
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
                ]
            }
        })
    }

    enable(){
        this.subs.push(
            this.pigSub = this.game.root.pig$
            // some filter on pig events
            .subscribe( n => {
                this.data.fs.level++
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

        )    
        this.fsView.$.next({})
    }

    disable(){
        this.subs.forEach( sub => sub.unsubscribe())
    }
}