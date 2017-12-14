import { Container as PIXI_Container } from "pixi.js";

class Container extends PIXI_Container {
    constructor({
        container,
        x,
        y,
        index
    }) {
        super()

        // Index of child
        this.container = container
        if (index)
            this.container.addChildAt(this, index)
        else
            this.container.addChild(this)

        // Relative coords
        if (Math.abs(this.x) < 1 && window.GAME_WIDTH)
            this.x = x * GAME_WIDTH
        else
            this.x = x
        if (Math.abs(this.y) < 1 && window.GAME_HEIGHT)
            this.y = y * GAME_HEIGHT
        else
            this.y = y
    }
}

export { Container }