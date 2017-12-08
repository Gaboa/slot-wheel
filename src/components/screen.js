import * as _ from 'lodash'
import { Container } from "../utils"
import { Wheel } from "./wheel"
import { SpriteElement } from "./element"
import { TweenMax } from 'gsap'
import { Observable } from 'rxjs'
import { Subject } from 'rxjs/Subject';

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
        width:   256 * 0.5,
        height:  240 * 0.5
    },

    start: {
        anims: [
            { type: 'static', el: 'j' },
            { type: 'static', el: 'j' },
            { type: 'static', el: 'j' },
            { type: 'static', el: 'j' },
            { type: 'static', el: 'j' }
        ],
        amount: 15,
        time:   0.5,
        ease:   Back.easeIn.config(0.6)
    },

    loop: {
        anims: [
            { type: 'blur', el: 'j' },
            { type: 'blur', el: 'q' },
            { type: 'blur', el: 'k' },
            { type: 'blur', el: 'a' }
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
        fast: 2,
        immediate: 5
    }

}

// TODO: Add different masking methods and methods to work eith side elements
// TODO: Add handy methods to work with elements detection in every wheel direction
// TODO: Add methods to collect elements in some line configurations
// TODO: Add streams logic
// TODO: Add minLoops count for loop anims in wheels
// TODO: Add fast and immediate roll methods

class Screen extends Container {

    constructor({
        container,
        x,
        y,

        config
    }) {
        super({ container, x, y })

        this.config = _.defaultsDeep(config, defaultConfig)

        this.createWheels()
        this.positionWheels()

        this.enableStreams()
    }

    // Inner logic
    enableStreams() {
        this.subs = []

        this.$ = new Subject()

        this.wheels$ = Observable.merge(...this.wheels.map(w => w.$))
        this.wheels$.subscribe(e => this.$.next(e))

        this.subs.push(
        this.logSub = this.$
            .filter(e => e.type !== 'WHEEL_EL_SWITCH')
            .subscribe(e => console.log(e)))

        this.subs.push(
        this.rollEndSub = this.$
            .filter(e => e.type === 'WHEEL')
            .filter(e => e.tween === 'END')
            .filter(e => e.state === 'COMPLETE')
            .bufferCount(this.config.amount)
            .subscribe(e => this.$.next({ type: 'ROLL', state: 'END', time: performance.now() })))

        this.subs.push(
        this.maxLoopCountSub = this.$
            .filter(e => e.type === 'WHEEL')
            .filter(e => e.tween === 'LOOP')
            .filter(e => e.state === 'START')
            .pluck('count')
            .distinct(null, this.$.filter(e => e.type === 'ROLL').filter(e => e.state === 'END')) // Чистит свой кеш во время окончания крутки, что поз
            .subscribe(n => this.$.next({ type: 'ROLL', state: 'MAX_LOOP', count: n })))
        
        this.subs.push(
        this.setWheelMaxLoopCountSub = this.$
            .filter(e => e.type === 'ROLL')
            .filter(e => e.state === 'MAX_LOOP')
            .subscribe(e => this.wheels.forEach(wheel => wheel.minLoops = e.count)))

        this.subs.push(
        this.clearWheelMaxLoopCountSub = this.$
            .filter(e => e.type === 'ROLL')
            .filter(e => e.state === 'START')
            .subscribe(e => this.wheels.forEach(wheel => wheel.minLoops = null)))

    }
    disableStreams() {
        this.subs.forEach(sub => sub.unsubscribe())
    }
    disableMaxLoopStreams() {
        this.setWheelMaxLoopCountSub.unsubscribe()
        this.clearWheelMaxLoopCountSub.unsubscribe()
    }

    // Direction
    get isHorizontal() {
        return this.config.dir === 'left' || this.config.dir === 'right'
    }
    get isVertical() {
        return this.config.dir === 'up' || this.config.dir === 'down'
    }

    // Elements
    get elements() {
        const result = []
        this.wheels.forEach(w => result.push(w.elements))
        return result
    }
    el(x, y) {}

    // Mask
    addMask() { this.wheels.forEach(w => w.addMask()) }
    removeMask() { this.wheels.forEach(w => w.removeMask()) }

    // Wheel
    createWheels() {
        this.wheels = []
        for (let i = 0; i < this.config.amount; i++) {
            const wheel = new this.config.Wheel(_.defaultsDeep({
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
        this.tw = TweenMax.staggerTo(this.wheels, 0.1, { alpha: 1, onStart() { this.target.roll() } }, this.config.dt)
        this.$.next({ type: 'ROLL', state: 'START', time: performance.now() })
    }
    fast() {
        this.roll()
        this.wheels.forEach(wheel => wheel.fast())
    }
    immediate() {
        this.roll()
        this.wheels.forEach(wheel => wheel.immediate())
    }
    setRollSpeed(speed) {
        this.wheels.forEach(wheel => wheel.speed = speed)
    }

    // Screen data manipulation
    setStartScreen(data) {
        if (!this.checkScreenData(data)) {
            console.warn('Screen data is wrong!', data)
            return null
        }
        if (this.isHorizontal) {
            data.forEach((row, i) => {
                this.wheels[i].clearAnimations()
                this.wheels[i].start.anims = row
                this.wheels[i].playStartAnimations()
            })
        }
        if (this.isVertical) {
            data = this.transformScreenData(data)
            data.forEach((col, i) => {
                this.wheels[i].clearAnimations()
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
            data.forEach((row, i) => this.wheels[i].end.anims = row)
        }
        if (this.isVertical) {
            data = this.transformScreenData(data)
            data.forEach((col, i) => this.wheels[i].end.anims = col)
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

}

export { Screen }