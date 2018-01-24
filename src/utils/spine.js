import { Subject } from "rxjs/Subject";
import ToolBox from './toolBox'

class Spine extends PIXI.spine.Spine {

    constructor({
        container,
        x = 0,
        y = 0,
        name,
        anim,
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
        this.$ = new Subject()

        // Index of child
        this.container = container
        ToolBox.combineContainers(container, this, index)
        this.x = ToolBox.getX(x)
        this.y = ToolBox.getY(y)

        this.createMixes()
        this.addListeners()

        if (anim) {
            let {track, name, repeat} = anim
            this.state.setAnimation(track, name, repeat)
        }
    }

    createMixes() {
        this.mixes.forEach(([anim1, anim2, delta]) => {
            if (this.state.hasAnimation(anim1) && this.state.hasAnimation(anim2))
                this.stateData.setMix(anim1, anim2, delta)
        })
    }

    addListeners() {
        this.state.addListener({
            start: entry => this.$.next({ type: 'START', spine: this, el: this.name, data: entry, anim: entry.animation.name })
        })

        this.state.addListener({
            complete: entry => this.$.next({ type: 'COMPLETE', spine: this, el: this.name, data: entry, anim: entry.animation.name })
        })

        this.state.addListener({
            end: entry => this.$.next({ type: 'END', spine: this, el: this.name, data: entry, anim: entry.animation.name })
        })

        this.state.addListener({
            event: (entry, event) => this.$.next({ type: 'EVENT', spine: this, el: this.name, data: entry, event: event, anim: entry.animation.name })
        })
    }

    play({index = 0, name, loop = true}) {
        this.state.setAnimation(index, name, loop)
    }

    add({index = 0, name, loop = true, delay = 0}) {
        this.state.addAnimation(index, name, loop, delay)
    }
}

export { Spine }