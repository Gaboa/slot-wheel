import { Text as PIXI_Text } from "pixi.js"
import ToolBox from './toolBox'

class Text extends PIXI_Text {
    constructor({
        container,
        x = 0,
        y = 0,
        text = '',
        style,
        index,
        anchor = 0.5,
        withFix = true
    }) {
        super(text, style)

        // Index of child
        this.container = container
        ToolBox.combineContainers(container, this, index)
        this.x = ToolBox.getX(x)
        this.y = ToolBox.getY(y)

        this.anchor.set(anchor)

        // Multiply fontSize by global vars
        if (withFix)
            this.style.fontSize = this.style.fontSize * SCALE_FIX
    }
}

export { Text }