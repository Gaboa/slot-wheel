import { Container as PIXI_Container } from "pixi.js";
import ToolBox from './toolBox'

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

        ToolBox.combineContainers(container, this, index)
        this.x = ToolBox.getX(x)
        this.y = ToolBox.getY(y)
    }
}

export { Container }