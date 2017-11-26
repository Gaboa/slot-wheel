import { Container } from '../utils'
import { Element } from './index'

import { Subject } from 'rxjs'
import { Rectangle, Graphics } from 'pixi.js'
import { TweenMax, TimelineLite } from 'gsap'
import ModifiersPlugin from 'gsap/ModifiersPlugin'

class Wheel extends Container {
    constructor({
        container,
        x,
        y,

        direction,

        el,

        start,
        loop,
        end
    }) {
        super({ container, x , y })

        this.direction = direction
        this.el = el

        this.start = start
        this.loop = loop
        this.end = end

        this.createMetrics()
        this.createTweenConfig()
        this.createElements()
        this.positionElements()

        this.createStreams()
    }

    // TODO: Add methods to work with animation array
    // TODO: Check different sides of rolling
    // TODO: Add methods to work with elements
    // TODO: Add methods to work with different loop animations
    // TODO: Add methods to change setup params
    // TODO: Add streams to check what happens in wheel  

    // Inner metrics
    createMetrics() {
        if (this.direction === 'left'
         || this.direction === 'right') {
            this.w = this.el.amount * this.el.width
            this.h = this.el.height
            this.outW = this.el.aside * this.el.width
            this.outH = 0
            this.inW = this.w - 2 * this.outW
            this.inH = this.h
        }
        if (this.direction === 'up'
         || this.direction === 'down') {
            this.w = this.el.width
            this.h = this.el.amount * this.el.height
            this.outW = 0
            this.outH = this.el.aside * this.el.height
            this.inW = this.w
            this.inH = this.h - 2 * this.outH
        }
        if (this.direction === 'right')
            this.pivot.x = (this.w - this.el.width) * 0.5
        if (this.direction === 'left')
            this.pivot.x = -(this.w - this.el.width) * 0.5
        if (this.direction === 'down')
            this.pivot.y = (this.h - this.el.height) * 0.5
        if (this.direction === 'up')
            this.pivot.y = -(this.h - this.el.height) * 0.5
    }

    // Inner logic
    createStreams() {
        this.$ = new Subject()

        this.$
            // .filter(e => e.type !== 'SWITCH')
            .subscribe(e => console.log(e))

        this.$
            .filter(e => e.type === 'START_BEGIN')
            .subscribe(e => {
                this.isRolling = true
                this.els.forEach(el => {
                    el.switchCount = 0
                    el.prevX = 0
                    el.prevY = 0
                })
            })

        this.$
            .filter(e => e.type === 'START_COMPLETE')
            .subscribe(e => {
                this.els.forEach(el => {
                    el.prevX += +this.tw.start.deltaX.split('=')[1]
                    el.prevY += +this.tw.start.deltaY.split('=')[1]
                })
                this.loopCount = 0
                this.checkForLoop()
            })
        
        this.$
            .filter(e => e.type === 'LOOP_BEGIN')
            .subscribe(e => {
                this.isLooping = true
            })
        
        this.$
            .filter(e => e.type === 'LOOP_COMPLETE')
            .subscribe(e => {
                this.els.forEach(el => {
                    el.prevX += +this.tw.loop.deltaX.split('=')[1]
                    el.prevY += +this.tw.loop.deltaY.split('=')[1]
                })
                this.checkForLoop()
            })

        this.$
            .filter(e => e.type === 'END_BEGIN')
            .subscribe(e => {
                this.isLooping = false
            })
        
        this.$
            .filter(e => e.type === 'END_COMPLETE')
            .subscribe(e => {
                this.isRolling = false
            })
    }

    // Mask
    addMask() {
        if (this.mask) return null
        this.mask = new Graphics()
        if (this.direction === 'right')
            this.mask.drawRect(this.outW - 0.5 * this.el.width, -0.5 * this.inH, this.inW, this.inH)
        if (this.direction === 'left')
            this.mask.drawRect(-this.w + this.outW + 0.5 * this.el.width, -0.5 * this.inH, this.inW, this.inH)
        if (this.direction === 'down')
            this.mask.drawRect(-0.5 * this.inW, this.outH - 0.5 * this.el.height, this.inW, this.inH)
        if (this.direction === 'up')
            this.mask.drawRect(-0.5 * this.inW, -this.h + this.outH + 0.5 * this.el.height, this.inW, this.inH)
        this.addChild(this.mask)
    }
    removeMask() {
        if (!this.mask) return null
        this.mask = null
        this.removeChild(this.mask)
    }

    // Border
    addBorder() {
        if (this.border) return null
        this.border = new Graphics()
        this.border.lineStyle(2, 0xffffff)
        if (this.direction === 'right')
            this.border.drawRect(this.outW - 0.5 * this.el.width, -0.5 * this.inH, this.inW, this.inH)
        if (this.direction === 'left')
            this.border.drawRect(-this.w + this.outW + 0.5 * this.el.width, -0.5 * this.inH, this.inW, this.inH)
        if (this.direction === 'down')
            this.border.drawRect(-0.5 * this.inW, this.outH - 0.5 * this.el.height, this.inW, this.inH)
        if (this.direction === 'up')
            this.border.drawRect(-0.5 * this.inW, -this.h + this.outH + 0.5 * this.el.height, this.inW, this.inH)
        this.addChild(this.border)
    }
    removeBorder() {
        if (!this.border) return null
        this.removeChild(this.border)
    }

    // Elements
    createElements() {
        this.els = []
        for (let i = 0; i < this.el.amount; i++) {
            const element = new Element({
                container: this,
                width: this.el.width,
                height: this.el.height,
                index: i
            })
            this.els.push(element)
        }
    }
    positionElements() {
        if (this.direction === 'right')
            this.els.forEach((el, i) => el.x = el.w * (this.el.amount - i - 1))
        if (this.direction === 'left')
            this.els.forEach((el, i) => el.x = -el.w * (this.el.amount - i - 1))
        if (this.direction === 'down')
            this.els.forEach((el, i) => el.y = el.h * i)
        if (this.direction === 'up')
            this.els.forEach((el, i) => el.y = -el.h * (this.el.amount - i - 1))
    }

    // Tweens
    createTweenConfig() {
        this.tw = {}
        this.tw.start = this.start
        this.tw.loop  = this.loop
        this.tw.end   = this.end

        this.tw.start.cb = {
            begin:    _ => this.$.next({ type: 'START_BEGIN' }),
            complete: _ => this.$.next({ type: 'START_COMPLETE' })
        }
        this.tw.loop.cb = {
            begin:    _ => this.$.next({ type: 'LOOP_BEGIN',    count: this.loopCount }),
            complete: _ => this.$.next({ type: 'LOOP_COMPLETE', count: this.loopCount })
        }
        this.tw.end.cb = {
            begin:    _ => this.$.next({ type: 'END_BEGIN' }),
            complete: _ => this.$.next({ type: 'END_COMPLETE' })
        }

        this.createTweenModifiers()

        this.createTweenDelta('start')
        this.createTweenDelta('loop')
        this.createTweenDelta('end')
        
    }
    createTweenDelta(name) {
        if (this.direction === 'right') {
            this.tw[name].deltaX = `+=${this.tw[name].amount * this.el.width}`
            this.tw[name].deltaY = ``
        }
        if (this.direction === 'left') {
            this.tw[name].deltaX = `-=${this.tw[name].amount * this.el.width}`
            this.tw[name].deltaY = ``
        }
        if (this.direction === 'up') {
            this.tw[name].deltaX = ``
            this.tw[name].deltaY = `-=${this.tw[name].amount * this.el.height}`
        }
        if (this.direction === 'down') {
            this.tw[name].deltaX = ``
            this.tw[name].deltaY = `+=${this.tw[name].amount * this.el.height}`
        }
    }
    createTweenModifiers() {
        const wheel = this
        if (this.direction === 'right'
         || this.direction === 'left') {
            this.tw.modifiers = {
                x(x) {
                    wheel.checkForSwitch({ wheel, el: this.t, x })
                    return x % wheel.w
                }
            }
        }
        if (this.direction === 'down'
         || this.direction === 'up') {
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
        const wheel = this
        cb.begin()
        this.tween = TweenMax.staggerTo(this.els, time, {
            ease,
            x: deltaX,
            y: deltaY,
            modifiers
        }, 0, cb.complete)
    }
    addStartTween() {
        this.addTween(this.tw.start)
    }
    addLoopTween() {
        this.addTween(this.tw.loop)
    }
    addEndTween() {
        this.addTween(this.tw.end)
    }

    roll() {
        if (this.isRolling) return null
        this.generateAnims()
        this.addStartTween()
    }
    checkForLoop() {
        this.loopCount++
        if (this.loopCount <= 15) {
            this.addLoopTween()
        } else {
            this.addEndTween()
        }
    }
    checkForSwitch({
        wheel,
        el,
        x,
        y
    }) {
        let switchCount
        if (this.direction === 'right'
         || this.direction === 'left')
            switchCount = Math.floor(Math.abs((el.prevX + x) / wheel.w))
        if (this.direction === 'down'
         || this.direction === 'up')
            switchCount = Math.floor(Math.abs((el.prevY + y) / wheel.h))

        if (switchCount > el.switchCount) {
            wheel.$.next({ type: 'SWITCH', el, index: el.index, count: switchCount })
            el.switchCount = switchCount
            el.play(this.anims[el.index + this.el.amount * el.switchCount])
        }

    }

    generateAnims() {
        this.anims = []
        const totalAmount = 
            this.el.amount +
            this.tw.start.amount +
            this.tw.loop.amount * 15 +
            this.tw.end.amount
        for (let i = 0; i < totalAmount; i++)
            this.anims.push(i)
    }
}

export { Wheel }