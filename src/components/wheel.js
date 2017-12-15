import { Container } from '../utils'

import ModifiersPlugin from 'gsap/ModifiersPlugin'
import isEqual from 'lodash.isequal'
import { Graphics } from 'pixi.js'
import { TweenMax } from 'gsap'
import { Subject } from 'rxjs'

// Loop effects in wheel
// TODO: Add events for advanced loop methods

class Wheel extends Container {
    constructor({
        container,
        x,
        y,

        index,
        dir,
        el,

        start,
        loop,
        end
    }) {
        super({ container, x , y })

        this.index = index
        this.dir   = dir
        this.el    = el

        this.start = start
        this.loop  = loop
        this.end   = end

        this.createWheelMetric()
        this.createTweenConfig()

        this.createElements()
        this.positionElements()

        this.playStartAnimations()
        this.enableStreams()
    }

    // Inner logic
    enableStreams() {
        this.$ = new Subject()
        this.subs = []

        // Start tween
        this.subs.push(
        this.startStartSub = this.$
            .filter(e => e.from  === 'WHEEL')
            .filter(e => e.tween === 'START')
            .filter(e => e.state === 'START')
            .subscribe(e => {
                this.clearElementsParams()
                this.isRolling = true
                this.forcedLoops = 0
                this.minLoops = 0
                this.loops = 0
            }))

        this.subs.push(
        this.startCompleteSub = this.$
            .filter(e => e.from  === 'WHEEL')
            .filter(e => e.tween === 'START')
            .filter(e => e.state === 'COMPLETE')
            .subscribe(e => {
                this.updateElementsParams('start')
                this.checkForLoop()
            }))
        
        // Loop tween
        this.subs.push(
        this.loopStartSub = this.$
            .filter(e => e.from  === 'WHEEL')
            .filter(e => e.tween === 'LOOP')
            .filter(e => e.state === 'START')
            .subscribe(e => {
                this.isLooping = true
                this.loops++
            }))

        this.subs.push(
        this.loopCompleteSub = this.$
            .filter(e => e.from  === 'WHEEL')
            .filter(e => e.tween === 'LOOP')
            .filter(e => e.state === 'COMPLETE')
            .subscribe(e => {
                this.updateElementsParams('loop')
                this.checkForLoop()
            }))

        // End tween
        this.subs.push(
        this.endStartSub = this.$
            .filter(e => e.from  === 'WHEEL')
            .filter(e => e.tween === 'END')
            .filter(e => e.state === 'START')
            .subscribe(e => {
                this.isLooping = false
            }))

        this.subs.push(
        this.endCompleteSub = this.$
            .filter(e => e.from  === 'WHEEL')
            .filter(e => e.tween === 'END')
            .filter(e => e.state === 'COMPLETE')
            .subscribe(e => {
                    this.isRolling = false
                    this.checkWheelEnd()
                }))
    }
    disableStreams() {
        this.subs.forEach(sub => sub.unsubscribe())
    }

    // Direction
    get isHorizontal() {
        return this.dir === 'left' || this.dir === 'right'
    }
    get isVertical() {
        return this.dir === 'up' || this.dir === 'down'
    }

    // Animation array construct
    addStartAnimations(start) {
        if (start)
        this.anims = [...start]
    }
    addLoopAnimations(loop) {
        if (loop)
        this.anims = [...this.anims, ...loop]
    }
    addEndAnimations(end) {
        if (end)
        this.anims = [...this.anims, ...end]
    }
    playStartAnimations() {
        this.addStartAnimations(this.start.anims)
        this.els.forEach((el, i) => el.play(this.anims[i]))
    }
    getRandomLoopAnim() {
        return this.loop.anims[Math.round(Math.random() * (this.loop.anims.length - 1))]
    }
    getRandomLoopAnims(amount) {
        let result = []
        for (let i = 0; i < amount; i++)
            result.push(this.getRandomLoopAnim())
        return result
    }

    // Inner metrics
    createWheelMetric() {
        if (this.isHorizontal) {
            this.w = this.el.amount * this.el.width
            this.h = this.el.height
            this.outW = this.el.aside * this.el.width
            this.outH = 0
            this.inW = this.w - 2 * this.outW
            this.inH = this.h
        }
        if (this.isVertical) {
            this.w = this.el.width
            this.h = this.el.amount * this.el.height
            this.outW = 0
            this.outH = this.el.aside * this.el.height
            this.inW = this.w
            this.inH = this.h - 2 * this.outH
        }
        if (this.dir === 'right')
            this.pivot.x = (this.w - this.el.width) * 0.5
        if (this.dir === 'left')
            this.pivot.x = -(this.w - this.el.width) * 0.5
        if (this.dir === 'down')
            this.pivot.y = (this.h - this.el.height) * 0.5
        if (this.dir === 'up')
            this.pivot.y = -(this.h - this.el.height) * 0.5
    }

    // Mask
    addMask() {
        if (this.mask) return null
        this.mask = new Graphics()
        if (this.dir === 'right')
            this.mask.drawRect(this.outW - 0.5 * this.el.width, -0.5 * this.inH, this.inW, this.inH)
        if (this.dir === 'left')
            this.mask.drawRect(-this.w + this.outW + 0.5 * this.el.width, -0.5 * this.inH, this.inW, this.inH)
        if (this.dir === 'down')
            this.mask.drawRect(-0.5 * this.inW, this.outH - 0.5 * this.el.height, this.inW, this.inH)
        if (this.dir === 'up')
            this.mask.drawRect(-0.5 * this.inW, -this.h + this.outH + 0.5 * this.el.height, this.inW, this.inH)
        this.addChild(this.mask)
    }
    removeMask() {
        if (!this.mask) return null
        this.removeChild(this.mask)
        this.mask = null
    }

    // Elements
    createElements() {
        this.els = []
        for (let i = 0; i < this.el.amount; i++) {
            const element = new this.el.Element({
                container: this,
                width:  this.el.width,
                height: this.el.height,
                index: i
            })
            this.els.push(element)
        }
    }
    positionElements() {
        if (this.dir === 'right')
            this.els.forEach((el, i) => el.x = el.w * i)
        if (this.dir === 'left')
            this.els.forEach((el, i) => el.x = -el.w * (this.el.amount - i - 1))
        if (this.dir === 'down')
            this.els.forEach((el, i) => el.y = el.h * i)
        if (this.dir === 'up')
            this.els.forEach((el, i) => el.y = -el.h * (this.el.amount - i - 1))
    }
    clearElementsParams() {
        this.els.forEach(el => {
            el.switchCount = 0
            el.prevX = 0
            el.prevY = 0
        })
    }
    updateElementsParams(name) {
        if (this.dir === 'right'
         || this.dir === 'down') {
            this.els.forEach(el => {
                el.prevX += +this.tw[name].deltaX.split('=')[1]
                el.prevY += +this.tw[name].deltaY.split('=')[1]
            })
        }
        if (this.dir === 'left'
         || this.dir === 'up') {
            this.els.forEach(el => {
                el.prevX -= +this.tw[name].deltaX.split('=')[1]
                el.prevY -= +this.tw[name].deltaY.split('=')[1]
            })
        }
    }
    get elements() {
        return this.els.slice(this.el.aside, this.el.amount - this.el.aside)
    }
    element(i) {
        return this.els[i]
    }
    elementPosition(i) {
        return this.els[i].position
    }
    resetElementPosition(i) {
        const el = this.element(i)
        if (this.dir === 'right')
            el.position.set(el.w * i, 0)
        if (this.dir === 'left')
            el.position.set(-el.w * (this.el.amount - i - 1), 0)
        if (this.dir === 'down')
            el.position.set(0, el.h * i)
        if (this.dir === 'up')
            el.position.set(0, -el.h * (this.el.amount - i - 1))
    }

    // Tweens
    createTweenConfig() {
        this.tw = {}
        this.tw.start = this.start
        this.tw.loop  = this.loop
        this.tw.end   = this.end

        this.tw.start.cb = {
            begin:    _ => this.$.next({ from: 'WHEEL', tween: 'START', state: 'START',    wheel: this, index: this.index }),
            complete: _ => this.$.next({ from: 'WHEEL', tween: 'START', state: 'COMPLETE', wheel: this, index: this.index })
        }
        this.tw.loop.cb = {
            begin:    _ => this.$.next({ from: 'WHEEL', tween: 'LOOP', state: 'START',    wheel: this, index: this.index, count: this.loops }),
            complete: _ => this.$.next({ from: 'WHEEL', tween: 'LOOP', state: 'COMPLETE', wheel: this, index: this.index, count: this.loops })
        }
        this.tw.end.cb = {
            begin:    _ => this.$.next({ from: 'WHEEL', tween: 'END', state: 'START',    wheel: this, index: this.index }),
            complete: _ => this.$.next({ from: 'WHEEL', tween: 'END', state: 'COMPLETE', wheel: this, index: this.index })
        }

        this.createTweenModifiers()

        this.createTweenDelta('start')
        this.createTweenDelta('loop')
        this.createTweenDelta('end')
        
    }
    createTweenDelta(name) {
        if (this.dir === 'right') {
            this.tw[name].deltaX = `+=${this.tw[name].amount * this.el.width}`
            this.tw[name].deltaY = ``
        }
        if (this.dir === 'left') {
            this.tw[name].deltaX = `-=${this.tw[name].amount * this.el.width}`
            this.tw[name].deltaY = ``
        }
        if (this.dir === 'up') {
            this.tw[name].deltaX = ``
            this.tw[name].deltaY = `-=${this.tw[name].amount * this.el.height}`
        }
        if (this.dir === 'down') {
            this.tw[name].deltaX = ``
            this.tw[name].deltaY = `+=${this.tw[name].amount * this.el.height}`
        }
    }
    createTweenModifiers() {
        const wheel = this
        if (this.isHorizontal) {
            this.tw.modifiers = {
                x(x) {
                    wheel.checkForSwitch({ wheel, el: this.t, x })
                    return x % wheel.w
                }
            }
        }
        if (this.isVertical) {
            this.tw.modifiers = {
                y(y) {
                    wheel.checkForSwitch({ wheel, el: this.t, y })
                    return y % wheel.h
                }
            }
        }
        this.tw.start.modifiers = this.tw.modifiers
        this.tw.loop.modifiers  = this.tw.modifiers
        this.tw.end.modifiers   = this.tw.modifiers
    }
    addTween({
        time,
        ease,
        deltaX,
        deltaY,
        modifiers,
        cb
    }) {
        cb.begin.call(this)
        this.tween = TweenMax.staggerTo(this.els, time, {
            ease,
            x: deltaX,
            y: deltaY,
            modifiers
        }, 0, cb.complete.bind(this))
        this.tween.forEach(tw => tw.timeScale(this.speed || 1))
    }
    addStartTween() {
        this.addStartAnimations([...this.start.anims, ...this.getRandomLoopAnims(this.start.amount)])
        this.addTween(this.tw.start)
    }
    addLoopTween() {
        this.addLoopAnimations(this.getRandomLoopAnims(this.loop.amount))
        this.addTween(this.tw.loop)
    }
    addEndTween() {
        this.addEndAnimations([...this.getRandomLoopAnims(this.end.amount - this.el.amount), ...this.end.anims])
        this.addTween(this.tw.end)
    }

    // Main methods
    roll() {
        if (this.isRolling) return null
        this.reset()
        this.addStartTween()
    }
    reset() {
        if (this.end.anims)
            this.start.anims = [...this.end.anims]
        this.end.anims = null
        this.els.forEach((el, i) => el.index = i )
    }

    // Checkers methods
    checkWheelEnd() {
        let check = this.els.every((el, i) => isEqual(el.anim, this.end.anims[i]))
        if (!check) console.warn('Wheel check failed!!! Index: ', this.index)
        if (!check) this.$.next({ from: 'WHEEL', state: 'error', index: this.index })
        return check
    }
    checkForLoop() {
        if (this.end.anims
         && this.loops >= this.minLoops + 1
         && this.loops >= this.forcedLoops ) {
            this.addEndTween()
        } else {
            this.addLoopTween()
        }
    }
    checkForSwitch({
        wheel,
        el,
        x,
        y
    }) {
        let switchCount
        if (wheel.dir === 'right'
         || wheel.dir === 'left')
            switchCount = Math.floor(Math.abs((el.prevX + x) / wheel.w))
        if (wheel.dir === 'down'
         || wheel.dir === 'up')
            switchCount = Math.floor(Math.abs((el.prevY + y) / wheel.h))

        if (switchCount > el.switchCount) {
            let delta = switchCount - el.switchCount // This is for very fast tweens where delta could be > 1
            el.switchCount = switchCount
            el.index += delta * wheel.el.amount
            el.anim = wheel.anims[el.index]
            el.play(el.anim)
            wheel.$.next({ from: 'WHEEL', state: 'SWITCH', el, index: el.index, count: switchCount, anim: el.anim, anims: wheel.anims })
        }

    }

}

export { Wheel }