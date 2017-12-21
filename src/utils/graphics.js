import { Graphics as PIXI_Graphics } from "pixi.js"

class Graphics extends PIXI_Graphics {
    constructor({
        container,
        x = 0,
        y = 0,
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
            this.x = Math.round(x * GAME_WIDTH)
        else
            this.x = x
        if (Math.abs(this.y) < 1 && window.GAME_HEIGHT)
            this.y = Math.round(y * GAME_HEIGHT)
        else
            this.y = y
    }
}

export { Graphics }