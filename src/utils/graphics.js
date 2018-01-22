import { Graphics as PIXI_Graphics } from "pixi.js"
import ToolBox from './toolBox'

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
        ToolBox.combineContainers(container, this, index)
        this.x = ToolBox.getX(x)
        this.y = ToolBox.getY(y)
    }
}

export { Graphics }