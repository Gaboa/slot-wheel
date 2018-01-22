export default class ToolBox {
    constructor() {}

    static getX(value) {
        let x;

        if (Math.abs(value) < 1){
            x = Math.round(value * GAME_WIDTH)
        } else {
            x = value
        }

        return x
    }

    static getY(value) {
        let y;

        if (Math.abs(value) < 1){
            y = Math.round(value * GAME_HEIGHT)
        } else {
            y = value
        }

        return y
    }

    static combineContainers(parent, child, index) {
        if (Number.isInteger(index)) {
            let parentLength = parent.children.length
            let finalIndex = (index > parentLength) ? parentLength - 1 : index
            parent.addChildAt(child, finalIndex)
        } else {
            parent.addChild(child)
        }
    }

    static getTextures(name, frames) {
        let textureArray = []

        for (let i = 0; i < frames; i++)
            textureArray.push(PIXI.Texture.fromImage(`${name}${i}`))

        return textureArray
    }
}