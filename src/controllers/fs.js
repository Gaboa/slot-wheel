import { Subject, Observable } from 'rxjs'
import defaultsDeep from 'lodash.defaultsdeep'
import { FSView }  from '../components'
import { zip } from 'rxjs/observable/zip';
import { defaultNumbersConfig } from '../components/numbers';
import { Container, Sprite, Spine, BitmapText, BalanceText } from '../utils'
import { Balance } from '../components'
import { TweenMax } from 'gsap';

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
    tick: true,
    end: true,
    start: true,
    win: true,
    in:{
        rendering:{
            container: true,
            panel: true,
            logo: true,
            machine: false,
            buttons: false,
            footer: false
        }
    },
    out:{
        rendering:{
            container: true,
            panel: true,
            logo: true,
            machine: false,
            buttons: false,
            footer: false
        }
    }
    
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

        if(autoEnable) this.enable()
    }
    
    enable(){
        this.subs = []

        if(this.config.in.rendering.machine)  
        this.subs.push(
        this.renderMachineSub= this.state.isTransition$
        .filter(e => !e)
        .filter( e => this.state.mode.indexOf('fsBonus') > -1)
        .subscribe(e => {
            TweenMax.to(this.game.root.machine, 0.3, {
                x: 0.0882 * GAME_WIDTH,
            })

        }))

        if(this.config.in.rendering.buttons)  
        this.subs.push(
        this.renderBtnSub= this.state.isTransition$
        .filter(e => !e)
        .filter( e => this.state.mode.indexOf('fsBonus') > -1)
        .subscribe(e => {
            this.game.root.buttons.alpha = 0
        }))

        if(this.config.in.rendering.footer)  
        this.subs.push(
        this.renderFooterSub= this.state.isTransition$
        .filter(e => !e)
        .filter( e => this.state.mode.indexOf('fsBonus') > -1)
        .subscribe(e => {
            this.game.root.footer.balance.top.left.prefix = 'Total Win: '
            this.game.root.footer.balance.top.right.prefix = 'Win: '
        }))

        if(this.config.in.rendering.panel)  
        this.subs.push(
        this.renderPanelSub= this.state.isTransition$
        .filter(e => !e)
        .filter( e => this.state.mode.indexOf('fsBonus') > -1)
        .subscribe(e => {
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
        }))

        if(this.config.in.rendering.container)  
        this.subs.push(
        this.renderContSub= this.state.isTransition$
        .filter(e => !e)
        .filter( e => this.state.mode.indexOf('fsBonus') > -1)
        .subscribe(e => {
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
                            config:{
                                name: `${this.config.map[this.data.fs.multi].animal}`
                            }
                        }
                    } 
                }
            })
        }))

        if(this.config.in.rendering.logo)  
        this.subs.push(
        this.renderLogoSub= this.state.isTransition$
        .filter(e => !e)
        .filter( e => this.state.mode.indexOf('fsBonus') > -1)
        .subscribe(e => {
            this.game.root.machine.logo.collector.updateItemsTexture(this.config.map[this.data.fs.multi].item)
            this.game.root.machine.logo.showCollector()
        }))

        if(this.config.start)  
        this.subs.push(
        this.fsStartSub = this.state.isTransition$
        .filter(e => !e)
        .filter( e => this.state.mode.indexOf('fsBonus') > -1)
        .subscribe(e => {
            this.game.root.enableFS()
            this.enableTicker()
        }))

        if(this.config.out.rendering.machine)  
        this.subs.push(
            this.renderMachineOutSub =  this.state.next$
            .filter(e => this.state.mode !== 'root')
            .filter(e => e === 'root')
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(e => {
            TweenMax.to(this.game.root.machine, 0.3, {
                x: -0.1 * GAME_WIDTH
            })
        }))

        if(this.config.out.rendering.footer)  
        this.subs.push(
            this.renderFooterOutSub =  this.state.next$
            .filter(e => this.state.mode !== 'root')
            .filter(e => e === 'root')
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(e => {
                this.game.root.footer.balance.top.left.prefix = 'Coins: '
                this.game.root.footer.balance.top.right.prefix = 'Bet: '
        }))

        if(this.config.out.rendering.buttons)  
        this.subs.push(
            this.renderBtnOutSub =  this.state.next$
            .filter(e => this.state.mode !== 'root')
            .filter(e => e === 'root')
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(e => {
            this.game.root.buttons.alpha = 1
        }))

        if(this.config.out.rendering.logo)  
        this.subs.push(
        this.renderLogoOutSub =  this.state.next$
        .filter(e => this.state.mode !== 'root')
        .filter(e => e === 'root')
        .sample(this.state.isRolling$.filter(e => !e))
        .subscribe(e => {
            this.game.root.machine.logo.collector.cleanView()
            this.game.root.machine.logo.collector.cleanPrevState()
            this.game.root.machine.logo.closeCollector()
        }))

        if(this.config.out.rendering.panel)  
        this.subs.push(
        this.renderPanelOutSub =  this.state.next$
        .filter(e => this.state.mode !== 'root')
        .filter(e => e === 'root')
        .sample(this.state.isRolling$.filter(e => !e))
        .subscribe(e => {
            this.game.root.machine.panel.render()
        }))

        if(this.config.out.rendering.container)  
        this.subs.push(
        this.renderContoOutSub =  this.state.next$
        .filter(e => this.state.mode !== 'root')
        .filter(e => e === 'root')
        .sample(this.state.isRolling$.filter(e => !e))
        .subscribe(e => {
            this.game.root.fs.remove()
        }))
        
        if (this.config.end)
        this.subs.push(
            this.fsEndSub = this.state.next$
            .filter(e => this.state.mode !== 'root')
            .filter(e => e === 'root')
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(e => {
                this.disableTicker()
                this.state.isTransition = true
                this.game.root.disableFS()
            })
        )
    }

    enableTicker(){
        if (this.config.tick)
        this.subs.push(
        this.fsTickSub = this.data.fs.count.current$
            .sample(this.state.isRolling$.filter(e => !e)) 
            .switchMap(e => this.data.win.lines.length 
                ? Observable.of(e).delay(2000)
                : Observable.of(e).delay(200))
            .subscribe(e => {
                this.game.root.machine.screen.roll()
            })
        )
    }

    disableTicker(){
        if(this.fsTickSub)
            this.fsTickSub.unsubscribe()
    }

    disable(){
         this.subs.forEach( sub => sub.unsubscribe())
    }
}