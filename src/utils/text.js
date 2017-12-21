import { Text as PIXI_Text } from "pixi.js"

class Text extends PIXI_Text {
    constructor({
        container,
        x = 0,
        y = 0,
        text,
        style,
        index,
        anchor = 0.5
    }) {
        super(text, style)

        // Index of child
        this.container = container
        if (index)
            this.container.addChildAt(this, index)
        else
            this.container.addChild(this)

        this.anchor.set(anchor)

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

export { Text }