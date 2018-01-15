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
    }
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

        // Hide Not Win Elements in alpha when we have win combinations
        if (this.config.els.alpha)
        this.subs.push(
        this.elementsAlphaShowSub = this.data.win.lines$
            .filter(data => data && data.length)
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe(data => this.machine.screen.elements
                .filter(el => !this.machine.screen.getElementsFromLines(data).some(winEl => winEl === el))
                .forEach(el => el.alpha = 0.6)))

        // Return Elements alpha when rolling starts        
        if (this.config.els.alpha)
        this.subs.push(
        this.elementsAlphaHideSub = this.data.win.lines$
            .filter(data => data)
            .sample(this.state.isRolling$.filter(e => e))
            .subscribe(data => this.machine.screen.elements.forEach(el => el.alpha = 1)))

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
                
                this.hideBeforeLine(data[index].number)
                this.showLine(data[index])
            }))
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe()) 
    }

    hideBeforeLine(num) {
        this.machine.table.hide()
        this.machine.screen.elements.forEach(el => el.playNormal())
        this.machine.numbers.hideAllWithout(num)
        this.machine.lines.hideAllWithout(num)
    }

    showLine(line) {
        this.machine.lines.show(line.number)
        this.machine.numbers.show(line.number)
        this.machine.screen.getElementsFromLine(line).forEach(el => el.playWin())
        this.machine.screen.getLastElementFromLine(line).win.show(line.win)
    }

}

export { WinController }