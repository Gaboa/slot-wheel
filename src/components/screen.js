import defaultsDeep from 'lodash.defaultsdeep'
import isEqual from 'lodash.isequal'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import { TweenMax } from 'gsap/TweenMax'
import { Wheel } from './wheel'
import { SpriteElement } from './element'
import { Container } from '../utils'

const defaultConfig = {
    Wheel,
    amount: 5,
    pos: null,
    dt: 0.1,

    dir: 'down',

    el: {
        Element: SpriteElement,
        amount:  5,
        aside:   1,
        width:   256 * 0.9,
        height:  240 * 0.9
    },

    start: {
        anims: [
            { type: 'static', el: '1' },
            { type: 'static', el: '1' },
            { type: 'static', el: '1' },
            { type: 'static', el: '1' },
            { type: 'static', el: '1' }
        ],
        amount: 15,
        time:   0.5,
        ease:   Back.easeIn.config(0.6)
    },

    loop: {
        anims: [
            { type: 'blur', el: '1' },
            { type: 'blur', el: '2' },
            { type: 'blur', el: '3' },
            { type: 'blur', el: '4' },
            { type: 'blur', el: '5' },
            { type: 'blur', el: '6' },
            { type: 'blur', el: '7' },
            { type: 'blur', el: '8' },
            { type: 'blur', el: '9' }
        ],
        amount: 5,
        time:   0.12 * 0.5,
        ease:   Linear.easeNone
    },

    end: {
        amount: 15,
        time:   0.5,
        ease:   Back.easeOut.config(0.6)
    },

    roll: {
        normal: 1,
        fast: 2
    },

    lines: [
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }],
        [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }],
        [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }]
    ],

    log: {
        el: false,
        wheel: false,
        screen: false
    }

}

// TODO: Work on advanced loop methods
// TODO: Add methods to handle some advanced wheel effects
// TODO: Add events for start and end of forced loops in wheels, and slowMo loops
// TODO: Add in loop config coef for timing ( x2, x3 )

class Screen extends Container {

    constructor({
        container,
        x,
        y,

        config
    }) {
        super({ container, x, y })

        this.config = defaultsDeep(config, defaultConfig)

        this.createWheels()
        this.positionWheels()

        this.isRolling = false

        this.enableStreams()
    }

    // Inner logic
    enableStreams() {
        this.subs = []

        this.$ = new Subject()

        this.wheels$ = Observable.merge(...this.wheels.map(w => w.$))
        this.wheels$.subscribe(e => this.$.next(e))

        // Logging subs
        if (this.config.log.screen)
        this.subs.push(
        this.logScreenSub = this.$
            .filter(e => e.from === 'SCREEN')
            .subscribe(e => console.log(e)))
        if (this.config.log.wheel)
        this.subs.push(
        this.logWheelSub = this.$
            .filter(e => e.from === 'WHEEL')
            .subscribe(e => console.log(e)))
        if (this.config.log.el)
        this.subs.push(
        this.logElSub = this.$
            .filter(e => e.from === 'EL')
            .subscribe(e => console.log(e)))

        // Start, Rolling and End subs
        this.subs.push(
        this.rollStartSub = this.$
            .filter(e => e.from  === 'WHEEL')
            .filter(e => e.tween === 'START')
            .filter(e => e.state === 'START')
            .filter(e => e.index === 0)
            .subscribe(e => this.$.next({ from: 'SCREEN', state: 'START', time: Math.round(performance.now()) })))
        this.subs.push(
        this.startRollingSub = this.$
            .filter(e => e.from  === 'SCREEN')
            .filter(e => e.state === 'START')
            .subscribe(e => this.isRolling = true))
        this.subs.push(
        this.endRollingSub = this.$
            .filter(e => e.from  === 'SCREEN')
            .filter(e => e.state === 'END')
            .subscribe(e => this.isRolling = false))
        this.subs.push(
        this.rollEndSub = this.$
            .filter(e => e.from  === 'WHEEL')
            .filter(e => e.tween === 'END')
            .filter(e => e.state === 'COMPLETE')
            .bufferCount(this.config.amount)
            .subscribe(e => this.$.next({ from: 'SCREEN', state: 'END', time: Math.round(performance.now()) })))

        // Subs for loop controll
        this.subs.push(
        this.maxLoopCountSub = this.$
            .filter(e => e.from  === 'WHEEL')
            .filter(e => e.tween === 'LOOP')
            .filter(e => e.state === 'START')
            .pluck('count')
            .distinct(null, this.$.filter(e => e.from === 'SCREEN').filter(e => e.state === 'END')) // Чистит свой кеш во время окончания крутки, что поз
            .subscribe(n => this.$.next({ from: 'SCREEN', state: 'MAX_LOOP', count: n })))
        
        this.subs.push(
        this.setWheelMaxLoopCountSub = this.$
            .filter(e => e.from  === 'SCREEN')
            .filter(e => e.state === 'MAX_LOOP')
            .subscribe(e => this.wheels.forEach(wheel => wheel.minLoops = e.count )))

        this.subs.push(
        this.clearWheelMaxLoopCountSub = this.$
            .filter(e => e.from  === 'SCREEN')
            .filter(e => e.state === 'START')
            .subscribe(e => this.wheels.forEach(wheel => wheel.minLoops = null )))

    }
    disableStreams() {
        this.subs.forEach(sub => sub.unsubscribe())
    }
    disableMaxLoopStreams() {
        this.setWheelMaxLoopCountSub.unsubscribe()
        this.clearWheelMaxLoopCountSub.unsubscribe()
    }
    disableLogStreams() {
        this.logElSub.unsubscribe()
        this.logWheelSub.unsubscribe()
        this.logScreenSub.unsubscribe()
    }

    // Direction
    get isHorizontal() {
        return this.config.dir === 'left' || this.config.dir === 'right'
    }
    get isVertical() {
        return this.config.dir === 'up' || this.config.dir === 'down'
    }

    // Rows and Cols
    get allRows() {
        if (this.isHorizontal)
            return this.wheels.map(w => w.els)
        if (this.isVertical)
            return this.transformScreen(this.wheels, 'els')
    }
    get rows() {
        if (this.isHorizontal)
            return this.wheels.map(w => w.elements)
        if (this.isVertical)
            return this.transformScreen(this.wheels, 'elements')
    }
    row(i) {
        return this.rows[i]
    }
    get allCols() {
        if (this.isHorizontal)
            return this.transformScreen(this.wheels, 'els')
        if (this.isVertical)
            return this.wheels.map(w => w.els)
    }
    get cols() {
        if (this.isHorizontal)
            return this.transformScreen(this.wheels, 'elements')
        if (this.isVertical)
            return this.wheels.map(w => w.elements)
    }
    col(i) {
        return this.cols[i]
    }

    // Elements
    get sideElements() {
        const result = []
        this.wheels
            .map(wheel => wheel.els.filter(el => !wheel.elements.includes(el)))
            .forEach(arr => arr.forEach(el => result.push(el)))
        return result
    }
    get allElements() {
        const result = []
        if (this.isHorizontal)
            this.wheels.forEach(w => w.els.forEach(el => result.push(el)))
        if (this.isVertical)
            this.transformScreen(this.wheels, 'els').forEach(w => w.forEach(el => result.push(el)))
        return result
    }
    get elements() {
        const result = []
        if (this.isHorizontal)
            this.wheels.forEach(w => w.elements.forEach(el => result.push(el)))
        if (this.isVertical)
            this.transformScreen(this.wheels, 'elements').forEach(w => w.forEach(el => result.push(el)))
        return result
    }
    element(x, y) {
        return this.elements[x + y * this.cols.length]
    }

    // Elements positions
    elementPosition(x, y) {
        if (this.isHorizontal)
            return this.wheels[y].elementPosition(x)
        if (this.isVertical)
            return this.wheels[x].elementPosition(y)
    }
    resetElementPosition(x, y) {
        if (this.isHorizontal)
            this.wheels[y].resetElementPosition(x)
        if (this.isVertical)
            this.wheels[x].resetElementPosition(y)
    }

    // Getters for Elements
    getElementsFromLine({ number, amount }) {
        const result = []
        this.config.lines[number]
            .filter((el, i) => i < amount)
            .forEach(el => result.push(this.element(el.x, el.y)))
        return result
    }
    getElementsFromLines(config) {
        const set = new Set()
        config.forEach(line => this.getElementsFromLine(line).forEach(el => set.add(el)))
        return Array.from(set)
    }
    getElementsWithAnim(anim) {
        return this.elements.filter(el => isEqual(anim, el.anim))
    }
    getLastElementWithAnim(anim) {
        const lastCol = this.cols[this.cols.length - 1]
        const filteredLastCol = lastCol.filter(el => isEqual(el.anim, anim))
        return filteredLastCol[filteredLastCol.length - 1]
    }
    getLastElementFromLine(config) {
        const lineEls = this.getElementsFromLine(config)
        return lineEls[lineEls.length - 1]
    }

    // Mask
    addMask() { this.wheels.forEach(w => w.addMask()) }
    removeMask() { this.wheels.forEach(w => w.removeMask()) }

    // Wheel
    createWheels() {
        this.wheels = []
        for (let i = 0; i < this.config.amount; i++) {
            const wheel = new this.config.Wheel(defaultsDeep({
                container: this,
                index: i
            }, this.config))    
            this.wheels.push(wheel)
        }
    }
    positionWheels() {
        if (this.config.pos
         && this.config.pos.length === this.config.amount) {
            this.wheels.forEach((wheel, index) => {
                wheel.x = this.config.pos[index].x
                wheel.y = this.config.pos[index].y
            })
        } else  {
            if (this.isHorizontal)
                this.wheels.forEach((wheel, index) => {
                    wheel.y = (index - (this.config.amount - 1) / 2) * this.config.el.height
                    wheel.x = 0
                })
            if (this.isVertical)
                this.wheels.forEach((wheel, index) => {
                    wheel.x = (index - (this.config.amount - 1) / 2) * this.config.el.width
                    wheel.y = 0
                })
        }
    }

    // Roll methods
    roll() {
        if (this.isRolling) return null
        this.setRollSpeed(this.config.roll.normal)
        this.tw = TweenMax.staggerTo(this.wheels, 0.1, { alpha: 1, onStart() { this.target.roll() } }, this.config.dt)
    }
    fast() {
        if (this.isRolling) return null
        this.roll()
        this.setRollSpeed(this.config.roll.fast)
    }
    setRollSpeed(speed) {
        this.wheels.forEach(wheel => wheel.speed = speed)
    }

    // Advanced wheel methods
    setForcedLoops(arr) {
        this.wheels.forEach((wheel, i) => wheel.forcedLoops = arr[i])
    }
    // Если тайминг анимаций будет отличаться от дефолтных, то это поламает механизм поочередной остановки колес
    // Лучше использовать для вручную управляемых эффектов докручивания колес
    changeLoopConfig(wheel, config) {
        wheel.loop = config
        wheel.createTweenConfig()
    }
    resetLoopConfig(wheel) {
        wheel.loop = this.config.loop
        wheel.createTweenConfig()
    }

    // Screen data manipulation
    setStartScreen(data) {
        if (!this.checkScreenData(data)) {
            console.warn('Screen data is wrong!', data)
            return null
        }
        if (this.isHorizontal) {
            data.forEach((row, i) => {
                this.wheels[i].start.anims = row
                this.wheels[i].playStartAnimations()
            })
        }
        if (this.isVertical) {
            data = this.transformScreenData(data)
            data.forEach((col, i) => {
                this.wheels[i].start.anims = col
                this.wheels[i].playStartAnimations()
            })
        }
    }
    setEndScreen(data) {
        if (!this.checkScreenData(data)) {
            console.warn('Screen data is wrong!', data)
            return null
        }
        if (this.isHorizontal) {
            data.forEach((row, i) => this.wheels[i].setEndAnimations(row))
        }
        if (this.isVertical) {
            data = this.transformScreenData(data)
            data.forEach((col, i) => this.wheels[i].setEndAnimations(col))
        }
    }
    checkScreenData(data) {
        if (this.isVertical) {
            const colCheck = data.length === this.config.el.amount
            const rowCheck = data.every(arr => arr.length === this.config.amount)
            return colCheck && rowCheck
        }
        if (this.isHorizontal) {
            const colCheck = data.length === this.config.amount
            const rowCheck = data.every(arr => arr.length === this.config.el.amount)
            return colCheck && rowCheck
        }
    }
    transformScreenData(data) {
        const result = []
        data.forEach((row, rowIndex) => {
            row.forEach((el, colIndex) => {
                result[colIndex] = result[colIndex] || []
                result[colIndex][rowIndex] = el
            })
        })
        return result
    }
    transformScreen(data, name) {
        const result = []
        data.forEach((row, rowIndex) => {
            row[name].forEach((el, colIndex) => {
                result[colIndex] = result[colIndex] || []
                result[colIndex][rowIndex] = el
            })
        })
        return result
    }

}

export { Screen }