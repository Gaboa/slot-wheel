import { Container as PIXI_Container } from "pixi.js";
import {BitmapText} from "./bitmap-text";

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
        if (Number.isInteger(index)) {
            let parentLength = this.container.children.length
            let innerIndex = (index > parentLength) ? parentLength - 1 : index
            this.container.addChildAt(this, innerIndex)
        }
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