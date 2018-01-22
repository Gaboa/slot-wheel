// {type: 'change', source: this}
// {type: 'tweenStart', source: this, startValue: '1234', endValue: '4321'}
// {type: 'tweenEnd', source: this}
// {type: 'update', source: this, value: '2222'}

// Для генерации фонта можно использовать ShoeBox, но надо смотреть за высотой линии
// чтоб она была больше самого большо символа. После генерации внутри файла надо поменять
// Face - назваие шрифта которые будете юзать и пусть к файлу на нормальный.

import { Subject, Observable } from "rxjs"
import ToolBox from './toolBox'

class BitmapText extends PIXI.extras.BitmapText {
    constructor({
        container,
        x = 0,
        y = 0,
        scale = 1,
        visible = true,
        name,
        text,
        fontSize,
        fontName,
        align = 'center',
        tint,
        tweenTime = 1.5
    }) {
        super(
            text,
            { font: {
                name: fontName,
                size: fontSize
                },
                align,
                tint
            })

        this.container = container
        ToolBox.combineContainers(container, this, index)
        this.x = ToolBox.getX(x)
        this.y = ToolBox.getY(y)

        // Set params
        this.scale.set(scale)
        this.visible = visible
        this.name = name
        this.tweenTime = tweenTime

        this.$ = new Subject()

        this.setAnchor(align)
    }

    tweenText(value) {
        TweenMax.to(this, this.tweenTime, {
            text: value,
            roundProps: 'text',
            onStart: () => this.$.next({type: 'TWEEN_START', source: this, startValue: this.text, endValue: value}),
            onUpdate: () => this.$.next({type: 'UPDATE', source: this, value: this.text}),
            onComplete: () => this.$.next({type: 'TWEEN_END', source: this}),
        })
    }

    writeText(value) {
        this.$.next({type: 'CHANGE', source: this})

        this.text = value
    }

    setAnchor(side) {
         let anchorX = 0.5
         if(side === 'left') anchorX = 0
         if(side === 'right') anchorX = 1

         this.anchor.set(anchorX, 0.5)
    }

    //TODO добавить возможность задавать промежуток между буквами и чтоб это работало с твином
}

export { BitmapText }