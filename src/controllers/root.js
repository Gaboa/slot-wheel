import defaultsDeep from 'lodash.defaultsdeep'

const defaultConfig = {
    screen: {
        start: true,
        end: true,
        data: true
    },
    fast: true,
    idle: true,
    idleFooter: true,
    rolling: true,
    lines: true
}

class RootController {

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
        this.buttons = this.level.machine.panel
            ? this.level.machine.panel.buttons
            : this.level.buttons

        if (autoEnable) this.enable()        
    }

    enable() {
        this.subs = []

        // Roll Start and End
        if (this.config.screen.start)
        this.subs.push(
        this.screenStartSub = this.machine.screen.$
            .filter(e => e.from  === 'SCREEN')
            .filter(e => e.state === 'START')
            .subscribe(e => {
                this.game.request.sendRoll({
                    value: this.data.balance.value.current,
                    level: this.data.balance.level.current
                })
                this.balance.coin.sum = this.balance.coin.sum - this.balance.coin.bet
                this.balance.cash.sum = (this.balance.cash.sum * 100 - this.balance.cash.bet * 100) / 100
                this.balance.cash.win = 0
                this.state.isRolling = true
            }))

        if (this.config.screen.end)
        this.subs.push(
        this.screenEndSub = this.machine.screen.$
            .filter(e => e.from  === 'SCREEN')
            .filter(e => e.state === 'END')
            .subscribe(e => this.state.isRolling = false ))

        // Set Start and End Screens
        if (this.config.screen.data)
        this.subs.push(
        this.screenDataStartSub = this.data.screen$
            .filter(e => Array.isArray(e))
            .take(1)
            .subscribe(s => this.machine.screen.setStartScreen(s)))

        if (this.config.screen.data)
        this.subs.push(
        this.screenDataEndSub = this.data.screen$
            .filter(e => Array.isArray(e))
            .skip(1)
            .subscribe(s => this.machine.screen.setEndScreen(s)))
        
        if (this.config.fast)
        this.subs.push(
        this.fastSub = this.state.settings.isFullscreen$
            .subscribe(e => this.machine.screen.setRollSpeed(this.machine.screen.config.roll[e ? 'fast' : 'normal'])))

        // Changing buttons states with isIdle state
        if (this.config.idle)
        this.subs.push(
        this.idleTrueSub = this.state.isIdle$
            .filter(e => e)
            .subscribe(e => this.buttons.enableAll()))

        if (this.config.idle)
        this.subs.push(
        this.idleFalseSub = this.state.isIdle$
            .filter(e => !e)
            .subscribe(e => this.buttons.disableAll()))


        // Disabling footer buttons with idle state
        if (this.config.idleFooter)
        this.subs.push(
        this.idleTrueSub = this.state.isIdle$
            .filter(e => e)
            .subscribe(e => {
                this.footer.buttons.settings.enable()
                this.footer.buttons.info.enable()
            }))

        if (this.config.idleFooter)
        this.subs.push(
        this.idleFalseSub = this.state.isIdle$
            .filter(e => !e)
            .subscribe(e => {
                this.footer.buttons.settings.disable()
                this.footer.buttons.info.disable()
            }))


        // When Rolling Starts => change Idle to false
        if (this.config.rolling)
        this.subs.push(
        this.rollingTrueSub = this.state.isRolling$
            .filter(e => e) // Start of roll
            .subscribe(e => this.state.isIdle = false))
        
        // When End of Roll and we not in Autoplay and Next is Root => return Idle state
        if (this.config.rolling)
        this.subs.push(
        this.rollingFalseSub = this.state.isRolling$
            .filter(e => !e) // End of roll
            .filter(e => !this.state.autoplay) // Not Autoplay
            .filter(e => this.state.next === 'root') // Next is Root
            .subscribe(e => this.state.isIdle = true))

        // When End of Roll and Next is not Root => We go in Transition
        if (this.config.rolling)
        this.subs.push(
        this.rollingTransitionSub = this.state.isRolling$
            .filter(e => !e) // End of roll
            .filter(e => this.state.next !== 'root') // Next is not Root
            .subscribe(e => this.state.isTransition = true))

        // Lines on Numbers Hover
        if (this.config.lines)
        this.subs.push(
        this.linesOverSub = this.machine.numbers.$
            .filter(e => e.type === 'OVER')
            .subscribe(e => this.machine.lines.show(e.num)))

        if (this.config.lines)
        this.subs.push(
        this.linesOutSub = this.machine.numbers.$
            .filter(e => e.type === 'OUT')
            .subscribe(e => this.machine.lines.hide(e.num)))
        
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

}

export { RootController }