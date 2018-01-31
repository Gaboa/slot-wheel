import defaultsDeep from 'lodash.defaultsdeep'

const defaultConfig = {
    counter: true
}

export class FSCounterController {

    constructor({
        game,
        config,
        autoEnable = true
    }) {
        this.config = defaultsDeep(config, defaultConfig)

        this.game  = game
        this.level = game.root
        this.data  = game.data
        this.state = game.state
        this.machine = this.level.machine
        this.counter = this.level.fs.countAmount
        this.multi   = this.level.fs.multiAmount

        if (autoEnable) this.enable()        
    }

    enable() {
        this.subs = []

        if (this.config.counter)
        this.subs.push(
        this.counterSub = this.data.fs.count.current$
            .sample(this.state.isRolling$)
            .subscribe(e => this.counter.writeText(e)))
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

}
