import defaultsDeep from 'lodash.defaultsdeep'
import { Observable } from 'rxjs/Observable'

const defaultConfig = {
    start: true,
    timer: true,
    count: true,
    end: true,
    noRoot: true
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

    enable() {
        this.subs = []
        
        // Change Autoplay Counter
        if (this.config.count)
        this.subs.push(
        this.autoCounterSub = this.state.autoplay$
            .filter(e => e) // When autoplay is positive number
            .subscribe(e => this.buttons.count.set(e))) // Change counter to new value

        // Autoplay Start triggers when state.autoplay changes from null to positive number
        if (this.config.start)
        this.subs.push(
        this.autoStartSub = this.state.autoplay$
            .distinctUntilChanged((prev, curr) => !(prev === null && curr > 0 || curr === null))
            .filter(e => e !== null) // Last autoplay value must be not a null 
            .subscribe(e => {
                this.state.button = 'stop' // Change main button to stop
                this.buttons.count.visible = true // Counter is visible now 
                this.buttons.disableAll() // All buttons ( without Stop ) are disabled
                this.balance.cash.auto.start = this.balance.cash.sum // Save start sum to check stop triggers on edges

                this.machine.screen.roll() // First Autoplay roll
                this.state.autoplay-- // Decrease autoplay value
            }))
        
        // Autoplay Timer
        if (this.config.timer)
        this.subs.push(
        this.autoTimerSub = this.state.autoplay$
            .sample(this.state.isRolling$.filter(e => !e)) // At the end of roll
            .switchMap(e => this.data.win.lines.length // If we have win lines
                        ? Observable.of(e).delay(2000) // Delay 2 seconds
                        : Observable.of(e).delay(200)) // If no win lines - delay 200ms
            .filter(e => this.state.autoplay) // If autoplay is enabled now
            .subscribe(e => {
                if (this.checkStoppers()) this.state.autoplay = null // If we hanve stoppers and they triggered => stop autoplay
                else {
                    this.machine.screen.roll() // Roll the screen
                    this.state.autoplay-- // And decrease autoplay
                }
            }))

        // Autoplay End
        if (this.config.end)
        this.subs.push(
        this.autoEndSub = this.state.autoplay$
            .filter(e => !e) // When autoplay === 0 or null ( end or stop )
            .subscribe(e => {
                this.state.button = 'spin' // Return main button to default state
                this.buttons.count.visible = false // Remove counter
                this.buttons.count.set(0) // And set counter to 0
                if (this.state.autoplay !== null) // When Autoplay is noyt null ( like 0 )
                    this.state.autoplay = null // Set to null to know that autoplay ended
            }))

        // Stoping auto when we not rolling
        if (this.config.end)
        this.subs.push(
        this.autoNoRootStopSub = this.state.autoplay$
            .filter(e => !e) // When autoplay is stopped
            .filter(e => !this.state.isRolling) // And we are not rolling now
            .subscribe(e => this.buttons.enableAll())) // Enable buttons

        // Stop auto when next is not 'root'
        if (this.config.noRoot)
        this.subs.push(
        this.autoNoRootStopSub = this.state.next$
            .filter(e => e !== 'root') // When NextMode is not Root
            .sample(this.state.isRolling$.filter(e => !e)) // At the End of Roll
            .subscribe(e => this.state.autoplay = null)) // Stop autoplay

    }

    checkStoppers() {
        if (this.balance.cash.auto.increase
        && (this.balance.cash.sum - this.balance.cash.auto.start >= this.balance.cash.auto.increase)) return true
        if (this.balance.cash.auto.decrease
        && (this.balance.cash.auto.start - this.balance.cash.sum >= this.balance.cash.auto.decrease)) return true
        return false
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe()) 
    }

}

export { AutoplayController }