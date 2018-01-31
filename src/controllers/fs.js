import { Subject } from 'rxjs'
import defaultsDeep from 'lodash.defaultsdeep'
import { FSView }  from '../components'
import { zip } from 'rxjs/observable/zip';
import { defaultNumbersConfig } from '../components/numbers';

const defaultConfig = {
    map: {
        2: {
            animal: 'rabbit',
            item: 'carrot'
        },
        3: {
            animal: 'rat',
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
    transition: true
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
        config,
        autoEnable = true
    }){
        this.game = game
        this.data = data
        this.state = this.game.state

        this.config = defaultsDeep(config, defaultConfig)

        this.$ = new Subject()

        if(autoEnable){
            this.render()
            //this.enable()
        }
        
        
    }
    
    render(){
        this.game.root.fs = new FSView({
            container: this.game.stage,
            game: this.game,
            stream: this.$,
            config:{
                
            }
        })

        this.game.root.machine.logo.showCollector()
    }
    
    enable(){
        this.subs = []

        // Start event
        if (this.config.start)
        this.subs.push(
        this.fsStartSub = this.state.mode$
            .filter(e => e.indexOf('fsBonus'))
            // TODO: Add start logic
            .subscribe(e => {
                // Change view to FS
                // Add FS Controllers
                // Start Ticker
                // Disable Root Controllers (some)
            }))

        // End event
        if (this.config.end)
        this.subs.push(
        this.fsEndSub = this.state.next$
            .filter(e => e === 'root')
            // TODO: Add end logic
            .subscribe(e => {
                // Change view to Root ???
                // Disable FS Controllers
                // Stop Ticker
                // Enable Root Controllers (some) ???
            }))






        this.fsStartIdleSub = this.state.mode$
            .filter( e => e)
            .subscribe(e => {
                this.game.root.machine.screen.roll()
                this.state.isIdle = false })

        if(this.config.pigs){
            this.subs.push(
                this.pigSub = this.game.root.pig$
                // some filter on pig events
                .subscribe( n => {
                    this.$.next(this.data.fs) 
                }),
            )
        }

        if(this.config.collector){
            this.zippedSub = zip(
                this.game.root.pig$,
                this.fsView.$
            )
            .subscribe(n => {
                if(this.fsView.collector){
                    this.fsView.collector.showItem()
                }
            })
        }

        if(this.config.afterEachPigWin){
            this.subs.push(
                // this.animalSub = this.data.win.lines$
                //     .sample(this.state.isRolling$)
                //     .subscribe(n => {
                    //         this.fsView.doItWhenWin()
                    //     })
                    
            ) 
        }

        this.fsView.$.next({})
    }
        
    disable(){
         this.subs.forEach( sub => sub.unsubscribe())
    }
}