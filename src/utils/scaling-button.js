import { Button } from "./button"

class ScalingButton extends Button {
    constructor({
        texture,
        container,
        x,
        y,
        anchor,
        visible,
        startScale = 1,
        finalScale = 1.3,
        tweenTime = 0.3
    }) {
        super({ container, x, y, texture, anchor, visible, isHover: false })

        this.tweenTime = tweenTime
        this.startScale = startScale
        this.finalScale = finalScale
        this.scale.set(startScale)
        this.name = texture
    }

    addStreams() {
        super.addStreams()
        this.over$.subscribe(next => this.scaleUp())
        this.out$.subscribe(next => this.scaleDown())
    }

    scaleUp() {
        this.tween = TweenMax.to(this.scale, this.tweenTime, {
            x: this.finalScale,
            y: this.finalScale
        })
    }

    scaleDown() {
        this.tween = TweenMax.to(this.scale, this.tweenTime, {
            x: this.startScale,
            y: this.startScale
        })
    }

}

export { ScalingButton }