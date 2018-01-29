import defaultsDeep from 'lodash.defaultsdeep'

const defaultConfig = {

    map: {
        2: {
            food: 'carrot',
            char: 'static_rabbit'
        },
        3: {
            food: 'cheese',
            char: 'static_rat'
        },
        4: {
            food: 'coffee',
            char: 'static_owl'
        },
        5: {
            food: 'money',
            char: 'static_cat'
        }
    },

    fs: {
        in: true,
        out: true,
        win: true
    },

    mode: true

}

export class TransitionController{
    
    constructor({
        game,
        config,
        autoEnable = true
    }){
        this.config = defaultsDeep(config, defaultConfig)
        
        this.game = game
        this.level = this.game.root
        this.transition = this.level.transition

        this.data  = game.data
        this.state = game.state
        
        if (autoEnable)
            this.enable()
    }
    
    enable(){
        this.subs = []

        // FS in transition
        if (this.config.fs.in)
        this.subs.push(
        this.fsInSub = this.state.isTransition$
            .filter(e => e)
            .filter(e => this.state.mode === 'root')
            .filter(e => this.state.next !== 'root')
            .subscribe(e => this.transition.render({
                fs: { in: {
                    count: { general: { text: String(this.data.fs.count.current) } },
                    multi: { general: { text: `X${this.data.fs.multi}` } },
                    characters: [
                        { general: { texture: this.config.map[this.data.fs.multi].char } }
                    ],
                }}
            }, 'fs', 'in')))
            
        // FS out transition
        if (this.config.fs.out)
        this.subs.push(
        this.fsOutSub = this.state.isTransition$
            .filter(e => e)
            .filter(e => this.state.mode !== 'root')
            .filter(e => this.state.next === 'root')
            .subscribe(e => this.transition.render({
                fs: { out: {
                    win: { general: { start: 0, end: this.data.fs.win.coin } },
                    topTitle: { general: { texture: this.data.fs.level.current >= this.data.fs.level.max ? 'big_win' : 'total_win' } },
                    emitter: { general: { textures: [this.config.map[this.data.fs.multi].food] } },
                }}
            }, 'fs', 'out')))

        // Win Tween on end
        if (this.config.fs.win)
        this.subs.push(
        this.fsOutSub = this.transition.$
            .filter(e => this.state.mode !== 'root')
            .filter(e => this.state.next === 'root')
            .filter(e => e.type === 'CREATED')
            .subscribe(e => this.transition.win.tweenText(this.data.fs.win.coin)))
            
        // Remove Transition => change mode to FS
        if (this.config.mode)        
        this.subs.push(
        this.transitionBtnSub = this.transition.$
            .filter(e => e.type === 'CONTINUE_CLICKED')
            .subscribe(e => {
                this.state.isTransition = false
                this.data.mode = this.data.next
                this.transition.remove()
            })) 
        
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe()) 
    }

}