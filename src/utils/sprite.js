import { Sprite as PIXI_Sprite } from "pixi.js"

class Sprite extends PIXI_Sprite {

    constructor({
        container,
        texture,
        x = 0,
        y = 0,
        index,
        anchor = 0.5,
        scale = 1,
        alpha = 1,
        visible = true,
        name
    }) {
        super(PIXI.utils.TextureCache[texture])

        // Index of child
        this.container = container
        if (index)
            this.container.addChildAt(this, index)
        else
            this.container.addChild(this)

        // Set anchor
        this.anchor.set(anchor)
        this.scale.set(scale)
        this.alpha = alpha
        this.visible = visible
        this.name = name

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

    changeTexture(name) {
        if (PIXI.utils.TextureCache[name])
            this.texture = PIXI.utils.TextureCache[name]
        else
            this.texture = new PIXI.RenderTexture(new PIXI.BaseRenderTexture(1, 1, PIXI.SCALE_MODES.LINEAR, 1))
    }

}

export { Sprite }