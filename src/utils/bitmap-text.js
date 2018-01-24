// {type: 'change', source: this}
// {type: 'tweenStart', source: this, startValue: '1234', endValue: '4321'}
// {type: 'tweenEnd', source: this}
// {type: 'update', source: this, value: '2222'}

// Для генерации фонта можно использовать ShoeBox, но надо смотреть за высотой линии
// чтоб она была больше самого большо символа. После генерации внутри файла надо поменять
// Face - назваие шрифта которые будете юзать и пусть к файлу на нормальный.

import { Subject, Observable } from "rxjs"

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
        tweenTime = 1.5,
        index
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
        if (index)
            this.container.addChildAt(this, index)
        else
            this.container.addChild(this)

        // Set params
        this.scale.set(scale)
        this.visible = visible
        this.name = name
        this.tweenTime = tweenTime

        // Relative coords
        if (Math.abs(x) < 1 && window.GAME_WIDTH)
            this.x = Math.round(x * GAME_WIDTH)
        else
            this.x = x
        if (Math.abs(y) < 1 && window.GAME_HEIGHT)
            this.y = Math.round(y * GAME_HEIGHT)
        else
            this.y = y

        this.$ = new Subject()

        this.setAnchor(align)
    }

    tweenText(value) {
        TweenMax.to(this, this.tweenTime, {
            text: value,
            roundProps: 'text',
            onStart: () => this.$.next({type: 'tweenStart', source: this, startValue: this.text, endValue: value}),
            onUpdate: () => this.$.next({type: 'update', source: this, value: this.text}),
            onComplete: () => this.$.next({type: 'tweenEnd', source: this}),
        })
    }

    writeText(value) {
        this.$.next({type: 'change', source: this})

        this.text = value
    }

    setAnchor(side) {
         let anchorX = 0.5
         if(side === 'left') anchorX = 0
         if(side === 'right') anchorX = 1

         this.anchor.set(anchorX, 0.5)
    }
}

export { BitmapText }