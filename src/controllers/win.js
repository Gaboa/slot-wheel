import defaultsDeep from 'lodash.defaultsdeep'
import { Observable } from 'rxjs/Observable'

const defaultConfig = {
    table: {
        show: true,
        hide: true
    },
    lines: {
        show: true,
        hide: true
    },
    numbers: {
        show: true,
        hide: true
    },
    els: {
        show: true,
        hide: true,
        alpha: true
    },
    oneAfterAnother: {
        delay: 4000,
        interval: 3000
    },
    audio: ['win_1', 'win_2']
}

class WinController {

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

        if (autoEnable) this.enable()
    }

    enable() {
        this.subs = []

        // ------  Table  ------
        // Show Win Table when we have win coins in the End of Roll
        if (this.config.table.show)
        this.subs.push(
        this.tableShowSub = this.balance.coin.win$
            .filter(e => e)
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(e => this.machine.table.show(e)))

        // Hide Win Table when rolling starts 
        if (this.config.table.hide)
        this.subs.push(
        this.tableHideSub = this.state.isRolling$
            .filter(e => e)
            .subscribe(e => this.machine.table.hide()))

        // ------  Lines  ------
        // Show Win Lines when we have win combinations in the End of Roll
        if (this.config.lines.show)
        this.subs.push(
            this.linesShowSub = this.data.win.lines$
            .filter(e => e)
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(lines => lines.forEach(line => this.machine.lines.show(line.number))))
            
        // Hide Win Lines when rolling starts
        if (this.config.lines.hide)
        this.subs.push(
        this.linesHideSub = this.state.isRolling$
            .filter(e => e)
            .filter(e => this.data.win.lines)
            .subscribe(e => this.data.win.lines.forEach(line => this.machine.lines.hide(line.number))))

        // ------  Numbers  ------
        // Show Win Numbers when we have win combinations in the End of Roll
        if (this.config.numbers.show)
        this.subs.push(
        this.numbersShowSub = this.data.win.lines$
            .filter(e => e)
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(lines => lines.forEach(line => this.machine.numbers.show(line.number))))
            
        // Hide Win Numbers when rolling starts
        if (this.config.numbers.hide)
        this.subs.push(
        this.numbersHideSub = this.state.isRolling$
            .filter(e => e)
            .filter(e => this.data.win.lines)
            .subscribe(e => this.data.win.lines.forEach(line => this.machine.numbers.hide(line.number))))

        // ------  Audio  ------
        if (this.config.audio)
        this.subs.push(
        this.audioSub = this.data.win.lines$
            .filter(data => data && data.length)
            .sample(this.state.isRolling$.filter(e => !e))
                .subscribe(data => this.game.audio.play(this.config.audio[Math.round(Math.random() * this.config.audio.length - 1)])))

            
        // ------  Elements  ------
        // Show Win Elements when we have win combinations in the End of Roll
        if (this.config.els.show)
        this.subs.push(
        this.elementsShowSub = this.data.win.lines$
            .filter(data => data && data.length)
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(data => this.machine.screen.getElementsFromLines(data).forEach(el => el.playWin())))

        // Hide Win Elements when rolling starts
        if (this.config.els.hide)
        this.subs.push(
        this.elementsHideSub = this.data.win.lines$
            .filter(data => data)
            .sample(this.state.isRolling$.filter(e => e))
            .subscribe(data => this.machine.screen.getElementsFromLines(data).forEach(el => el.playNormal())))

        // ------  Elements - Alpha  ------
        // Hide Not Win Elements in alpha when we have win combinations
        if (this.config.els.alpha)
        this.subs.push(
        this.elementsAlphaShowSub = this.data.win.lines$
            .filter(data => data && data.length)
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(data => this.machine.screen.elements
                .filter(el => !this.machine.screen.getElementsFromLines(data).some(winEl => winEl === el) && el.anim.el !== '11')
                .forEach(el => el.alpha = 0.6)
                //.forEach(el => console.log(el))
                )
            )

        // Return Elements alpha when rolling starts        
        if (this.config.els.alpha)
        this.subs.push(
        this.elementsAlphaHideSub = this.data.win.lines$
            .filter(data => data)
            .sample(this.state.isRolling$.filter(e => e))
            .subscribe(data => this.machine.screen.elements.forEach(el => el.alpha = 1)))

        // ------  One After Another  ------
        // One after another logic
        if (this.config.oneAfterAnother)
        this.subs.push(
        this.winOneAfterAnotherSub = this.data.win.lines$
            .filter(data => data && data.length)
            .sample(this.state.isRolling$.filter(e => !e))
            .switchMap(
                () => Observable.timer(this.config.oneAfterAnother.delay, this.config.oneAfterAnother.interval)
                    .takeUntil(this.state.isRolling$.filter(e => e)),
                (data, index) => ({ data, index: (data.length > 1) ? index % data.length : 0 })
            )
            .subscribe(({ data, index }) => {
                if (data.number < 0) return null
                
                this.hideAllWithoutLine(data[index].number)
                this.showLine(data[index])
            }))
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe()) 
    }

    hideAllWithoutLine(num) {
        try {
            this.machine.table.hide()
            this.machine.screen.elements.forEach(el => el.playNormal())
            this.machine.numbers.hideAllWithout(num)
            this.machine.lines.hideAllWithout(num)
        } catch (e) {
            console.error('WinCtrl, Hide All Without Line Error: ', e)
        }
        
    }

    showLine(line) {
        try {
            this.machine.lines.show(line.number)
            this.machine.numbers.show(line.number)
            this.machine.screen.getElementsFromLine(line).forEach(el => el.playWin())
            this.machine.screen.getLastElementFromLine(line).win.show(line.win)    
        } catch (e) {
            console.error('WinCtrl, Show Line Error: ', e)
        }
    }

}

export { WinController }