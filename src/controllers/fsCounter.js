import defaultsDeep from 'lodash.defaultsdeep'

const defaultConfig = {
    counter: true,
    multi: true,
    counterIncrease: true
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
        this.counter = this.level.fs.counter.count
        this.multi = this.level.fs.counter.multi

        if (autoEnable) this.enable()        
    }

    enable() {
        this.subs = []

        if (this.config.counter)
        this.subs.push(
        this.counterSub = this.data.fs.count.current$
            .sample(this.state.isRolling$.filter(e => e))
            .subscribe(e => {
                this.counter.writeText(e - 1)
            })
        )

        if (this.config.multi)
        this.subs.push(
        this.counterSub = this.data.fs.multi$
            .sample(this.state.isRolling$.filter(e => !e))
            .distinct()
            .subscribe(e => {
                this.multi.writeText(`X${e}`)
            })
        )

        if (this.config.counterIncrease)
        this.subs.push(
        this.counterSub = this.data.fs.count.win$
            .filter(e => e)
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(e => {
                this.counter.writeText(this.data.fs.count.current)
            })
        )
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

}
