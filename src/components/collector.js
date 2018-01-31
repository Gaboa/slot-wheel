import defaultsDeep from 'lodash.defaultsdeep'
import { Container, Sprite, Spine, BitmapText, BalanceText, ReactiveObject, ReactiveProperty } from '../utils'
import { Subject } from 'rxjs'

export class WinField extends Container {
    
    constructor({
        container,
        x,
        y
    }){
        super({
            container,
            x,
            y
        })
        this.alpha = 0

        this.bg = new Sprite({
            container: this,
            texture: 'middle_win',
        })

        this.amount = new BalanceText({
            container: this,
            fixed: 0,
            fontSize: 30,
            prefix: '+',
            alpha: 0,
            y: 0.0027,
        })
    }

    show(amount) {
        this.tl = new TimelineMax()
        this.tl
            .to(this, 0.5, { alpha:1 }, 0)
            .call(() => this.amount.set(amount), [], null, 0.3)
            .to(this, 0.5, { alpha: 0 }, 1.3)
            .call(() => this.amount.set(0), [], null, 1.3)
    }
}

const defaultConfig = {

    amountOfItems: 5,
    sum: 0,

    done: true,
    remain: true,
    win: true,
    reset: {
        reset: true,
        prev: true
    },

    views: [
        'bg',
        'items',
        'closed',
        'win'
    ],

    bg: {
        Constructor: Sprite,
        general:{
            name: 'bg',
            texture: 'middle'
        }
    },

    closed: {
        Constructor: Sprite,
        amount: 5,
        arr: 'closed',
        delta: 0.02,
        pos: [{ x: -0.081, y: 0.0046 }, { x: -0.042, y: 0.0046 },
             { x: -0.0015, y: 0.0046 }, { x: 0.0375, y: 0.0046 }, { x: 0.077, y: 0.0046 }],
        general: {
            name: 'closed',
            texture: 'closed'
        }
    },
    
    items: {
        Constructor: Sprite,
        amount: 5,
        arr: 'items',
        delta: 0.06,
        pos: [{ x: -0.081, y: 0 }, { x: -0.0416, y: 0 }, { x: -0.002, y: 0 }, { x: 0.037, y: 0 }, { x: 0.077, y: 0 }],
        general: {
            name: 'item',
            texture: 'carrot'
        }
    },

    win: {
        Constructor: WinField,
        general: {
            name: 'win',

        }
    }

}

export class Collector extends Container {
    
    constructor({
        container,
        x,
        y,
        config = {}
    }){
        super({
            container,
            x,
            y,
        })
        this.config = defaultsDeep(config, defaultConfig)

        new ReactiveObject({ context: this.prev = {}, object: {
            level: 0,
            index: 0,
            loops: 0
        }})
        new ReactiveObject({ context: this.curr = {}, object: {
            level: 0,
            index: 0,
            loops: 0
        }})
        new ReactiveProperty({
            context: this,
            prop: 'remain',
            value: null
        })
        new ReactiveProperty({
            context: this,
            prop: 'saved',
            value: null
        })

        this.config.views
            .forEach(view => this.addView(this.config[view]))

        this.$  = new Subject()
        this.tl = new TimelineMax()
        this.enable()
    }

    addView(item) {
        if (item.amount) this.addCollection(item)
        else this[item.general.name] = new item.Constructor(Object.assign( 
            { container: this }, 
            item.general, 
            item[GAME_DEVICE]))
        return this[item.general.name]
    }

    addCollection(item) {
        this[item.arr] = []
        for (let i = 0; i < item.amount; i++) {
            this[item.arr].push(
            this.addView(defaultsDeep({
                amount: null,
                general: {
                    name: `${item.general.name}_${i}`,
                    x: item.pos[i].x,
                    y: item.pos[i].y
                }
            }, item)))
        }
    }

    enable() {
        this.subs = []

        if (this.config.done)
        this.subs.push(
        this.doneSub = this.$
            .filter(e => e.type === 'OPENED')
            .filter(e => e.index === this.config.amountOfItems - 1)
            .subscribe(e => this.$.next({ type: 'DONE' })))
        
        if (this.config.reset)
        this.subs.push(
        this.resetSub = this.$
            .filter(e => e.type === 'DONE')
            .subscribe(e => this.reset()))

        if (this.config.reset.prev)
        this.subs.push(
        this.resetPrevSub = this.$
            .filter(e => e.type === 'RESET')
            .subscribe(e => this.prev.index = 0))
        
        if (this.config.reset.saved)
        this.subs.push(
        this.resetSavedSub = this.$
            .filter(e => e.type === 'RESET')
            .filter(e => this.saved)
            .subscribe(e => this.play(this.saved)))

        if (this.config.remain)
        this.subs.push(
        this.remainSub = this.remain$
            .filter(e => e)
            .subscribe(e => this.play(e)))

        if (this.config.win)
        this.subs.push(
        this.winSub = this.$
            .filter(e => e.type === 'RESET')
            .subscribe(e => this.win.show(this.config.sum || 1000)))

    }

    play(amount) {
        for (let i = this.prev.index; i < this.prev.index + amount; i++)
            this.open(i)
    }


    level(val) {
        this.curr.level = val
        this.curr.index = val % this.config.amountOfItems
        this.curr.loops = Math.floor(val / this.config.amountOfItems)

        this.calc()
    }

    calc() {
        if (this.curr.loops > this.prev.loops) {
            this.remain = this.config.amountOfItems - this.prev.index
            this.saved = this.curr.index
        } else {
            this.remain = null
            this.saved = null
            this.play(this.curr.index - this.prev.index)
        }

        this.prev.index = this.curr.index 
        this.prev.loops = this.curr.loops 
        this.prev.level = this.curr.level 
    }

    changeItems(name) {
        this.items.forEach(item.texture = name)
    }

    open(i) {
        TweenMax.to(this.items[i],  0.3, { alpha: 1 })
        TweenMax.to(this.closed[i], 0.3, { alpha: 0, onComplete: () => this.$.next({ index: i, type: 'OPENED' }) })
    }

    // openItem() {
    //     // TweenMax.fromTo(this.items[this.index % this.config.amountOfItems].scale, 0.2, { x: 0, y: 0 }, { x: 1, y: 1 })
    //     // TweenMax.to(this.items[this.index % this.config.amountOfItems], { alpha: 1 })
    // }

    // openClosed() {
    //     this.closed[this.index].alpha = 0
        
    //     // TweenMax.to(this.closed[this.index % this.config.amountOfItems], 0.2, { y: '-=75', alpha: 0 })
    // }
    
    reset() {
        this.closed.forEach(door => {
            door.alpha = 1
            door.y = 0
        })
        this.$.next({ type: 'RESET' })
    }

    sendEvent() {
        this.$.next({source: 'COLLECTOR', message: 'i am carrot'})
    }

    showAfterReset() {
        this.win.show('1000', this.sendEvent, this)
    }

    remove() {
        this.destroy()
    }
}