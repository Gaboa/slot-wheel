import { Subject } from "rxjs/Subject";

class Spine extends PIXI.spine.Spine {

    constructor({
        container,
        x = 0,
        y = 0,
        name,
        animation,
        index,
        visible = true,
        mixes = [
            ['idle', 'win', 0.15],
            ['win', 'idle', 0.15]
        ]
        //TODO дефолтным я бы сделал пустой массив
    }) {
        super(PIXI.utils.resources[name].spineData)

        // Set params
        this.visible = visible
        this.mixes = mixes
        this.name = name

        // Index of child
        this.container = container
        if (index)
            this.container.addChildAt(this, index)
        else
            this.container.addChild(this)

        // Relative coords
        if (Math.abs(x) < 1 && window.GAME_WIDTH)
            this.x = Math.round(x * GAME_WIDTH)
        else
            this.x = x
        if (Math.abs(y) < 1 && window.GAME_HEIGHT)
            this.y = Math.round(y * GAME_HEIGHT)
        else
            this.y = y

        this.createMixes()

        this.enable()

        if (typeof(animation) === 'string') {
            let {track, name, repeat} = animation
            this.state.setAnimation(track, name, repeat)
        }

    }


    createMixes() {
        this.mixes.forEach(([anim1, anim2, delta]) => {
            if (this.state.hasAnimation(anim1) && this.state.hasAnimation(anim2))
                this.stateData.setMix(anim1, anim2, delta)
        })
    }

    enable() {
        this.$ = new Subject()
        this.subs = []

        this.subs.push(
        this.startSub = this.state.addListener({
            start: entry => this.$.next({ type: 'START', spine: this, el: this.name, data: entry, anim: entry.animation.name })
        }))

        this.subs.push(
        this.completeSub = this.state.addListener({
            complete: entry => this.$.next({ type: 'COMPLETE', spine: this, el: this.name, data: entry, anim: entry.animation.name })
        }))

        this.subs.push(
        this.endSub = this.state.addListener({
            end: entry => this.$.next({ type: 'END', spine: this, el: this.name, data: entry, anim: entry.animation.name })
        }))

        this.subs.push(
        this.eventSub = this.state.addListener({
            event: (entry, event) => this.$.next({ type: 'EVENT', spine: this, el: this.name, data: entry, event: event, anim: entry.animation.name })
        }))

    }

    disable() {
        this.$.complete()
        this.subs.forEach(s => s.unsubscribe())
    }

    play({index = 0, name, loop = true}) {
        this.state.setAnimation(index, name, loop)
    }

    add({index = 0, name, loop = true, delay = 0}) {
        this.state.addAnimation(index, name, loop, delay)
    }
}

export { Spine }