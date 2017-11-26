import { Container as PIXI_Container } from "pixi.js";

class Container extends PIXI_Container {
    constructor({
        container,
        x,
        y
    }) {
        super()

        this.container = container
        this.container.addChild(this)

        this.x = x
        this.y = y
    }
}

export { Container }