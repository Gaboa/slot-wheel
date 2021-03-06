import { Container as PIXI_Container } from "pixi.js";

class Container extends PIXI_Container {
    constructor({
        container,
        x = 0,
        y = 0,
        index,
        scale = 1,
        name
    }) {
        super()

        this.name = name

        this.scale.set(scale)

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
    }
}

export { Container }