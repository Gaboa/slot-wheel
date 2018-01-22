import defaultsDeep from 'lodash.defaultsdeep'
import { Observable } from 'rxjs/Observable'

const defaultConfig = {
    start: {
        counter: true,
        button: true,
        idle: true,
        roll: true,
        delay: 500,
        save: true
    },
    count: {
        roll: true,
        change: true,
        end: true
    },
    tick: {
        win: 2000,
        fail: 200
    },
    end: {
        counter: true,
        button: true,
        idle: true,
        next: true
    }
}

class AutoplayController {

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
        this.balance = this.data.balance
        this.footer  = this.level.footer
        this.machine = this.level.machine
        this.buttons = this.machine.panel
            ? this.machine.panel.buttons
            : this.level.buttons

        if (autoEnable) this.enable()
    }

    enableStart() {
        // -----  Start  -----
        // When isAutoplay state = true -> visible counter
        if (this.config.start.counter)
        this.subs.push(
        this.autoplayStartCounterSub = this.state.isAutoplay$
            .filter(e => e)
            .subscribe(e => this.buttons.count.visible = true ))

        // When isAutoplay state = true -> change button to stop
        if (this.config.start.button)
        this.subs.push(
        this.autoplayStartButtonSub = this.state.isAutoplay$
            .filter(e => e)
            .subscribe(e => this.state.button = 'stop' ))

        // When isAutoplay state = true -> save start sum
        if (this.config.start.save)
        this.subs.push(
        this.autoplayStartSaveSub = this.state.isAutoplay$
            .filter(e => e)
            .subscribe(e => this.data.autoplay.start = this.balance.cash.sum ))

        // When isAutoplay state = true -> change idle state to false
        if (this.config.start.idle)
        this.subs.push(
        this.autoplayStartIdleSub = this.state.isAutoplay$
            .filter(e => e)
            .subscribe(e => this.state.isIdle = false ))

        // When isAutoplay state = true -> start roll after some delay
        if (this.config.start.roll)
        this.subs.push(
        this.autoplayStartRollSub = this.state.isAutoplay$
            .filter(e => e)
            .delay(this.config.start.delay || 300)
            .subscribe(e => this.machine.screen.roll() ))
    }

    enableCounter() {
        // -----  Counter  -----
        // On roll =>  decrease counter
        if (this.config.count.roll)
        this.subs.push(
        this.autoplayCountRollSub = this.machine.screen.$
            .filter(e => e.from  === 'SCREEN')
            .filter(e => e.state === 'START')
            .filter(e => this.state.isAutoplay)
            .subscribe(e => this.data.autoplay.count--))
        
        // Change Counter Value
        if (this.config.count.change)
        this.subs.push(
        this.autoplayCountChangeSub = this.data.autoplay.count$
            .filter(e => Number(e) >= 0) 
            .subscribe(e => this.buttons.count.set(e)))

        // When Counter is not a positive number -> stop Autoplay
        if (this.config.count.end)
        this.subs.push(
        this.autoplayCountEndSub = this.data.autoplay.count$
            .filter(e => !(Number(e) > 0)) 
            .subscribe(e => this.state.isAutoplay = false))
    }

    enableTicker() {
        // -----  Ticker  -----
        if (this.config.tick)
        this.subs.push(
        this.autoTickSub = this.data.autoplay.count$
            .sample(this.state.isRolling$.filter(e => !e)) // At the end of roll
            .switchMap(e => this.data.win.lines.length // If we have win lines
                ? Observable.of(e).delay(this.config.tick.win) // Delay 2 seconds
                : Observable.of(e).delay(this.config.tick.fail)) // If no win lines - delay 200ms
            .filter(e => this.state.isAutoplay) // If autoplay is enabled now
            .subscribe(e => {
                if (this.checkStoppers()) this.state.isAutoplay = false // If we hanve stoppers and they triggered => stop autoplay
                else this.machine.screen.roll() // Roll the screen
            }))

    }

    enableEnd() {
        // -----  End  -----
        // When isAutoplay state = false -> Hide counter
        if (this.config.end.counter)
        this.subs.push(
        this.autoAutoplayEndCounterSub = this.state.isAutoplay$
            .filter(e => !e)
            .subscribe(e => this.buttons.count.visible = false))

        // When isAutoplay state = false -> Button to Spin
        if (this.config.end.button)
        this.subs.push(
        this.autoAutoplayEndButtonSub = this.state.isAutoplay$
            .filter(e => !e)
            .subscribe(e => this.state.button = 'spin'))

        // When isAutoplay state = false -> Idle state to true
        if (this.config.end.idle)
        this.subs.push(
        this.autoAutoplayEndIdleSub = this.state.isAutoplay$
            .filter(e => !e)
            .filter(e => !this.state.isRolling)
            .subscribe(e => this.state.isIdle = true ))

        // When NextMode is not Root -> stop Autoplay
        if (this.config.end.next)
        this.subs.push(
        this.autoAutoplayEndNextSub = this.state.next$
            .filter(e => e !== 'root')
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(e => this.state.isAutoplay = false ))
    }

    enable() {
        this.subs = []

        this.enableStart()
        this.enableCounter()
        this.enableTicker()
        this.enableEnd()
    }

    checkStoppers() {
        if (this.data.autoplay.increase
        && (this.balance.cash.sum - this.data.autoplay.start >= this.data.autoplay.increase)) return true
        if (this.data.autoplay.decrease
        && (this.data.autoplay.start - this.balance.cash.sum >= this.data.autoplay.decrease)) return true
        return false
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe()) 
    }

}

export { AutoplayController }