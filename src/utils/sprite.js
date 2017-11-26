import { Sprite as PIXI_Sprite } from "pixi.js";

class Sprite extends PIXI_Sprite {
    constructor({
        container,
        texture,
        x,
        y
    }) {
        super(PIXI.utils.TextureCache[texture])

        this.container = container
        this.container.addChild(this)

        this.x = x
        this.y = y
    }
}

export { Sprite }