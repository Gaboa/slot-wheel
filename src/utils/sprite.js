import { Sprite as PIXI_Sprite } from "pixi.js"
import ToolBox from './toolBox'

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

        ToolBox.combineContainers(container, this, index)
        this.x = ToolBox.getX(x)
        this.y = ToolBox.getY(y)

        // Set anchor
        this.anchor.set(anchor)
        this.scale.set(scale)
        this.alpha = alpha
        this.visible = visible
        this.name = name
    }

    changeTexture(name) {
        if (PIXI.utils.TextureCache[name])
            this.texture = PIXI.utils.TextureCache[name]
        else
            this.texture = new PIXI.RenderTexture(new PIXI.BaseRenderTexture(1, 1, PIXI.SCALE_MODES.LINEAR, 1))
    }

}

export { Sprite }