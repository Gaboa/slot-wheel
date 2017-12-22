import defaultsDeep from 'lodash.defaultsdeep'
import { Text } from "./text"

const defaultStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 22,
    fill: ['#ffffff', '#B2B2B2'],
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 8,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 1,
}

class BalanceText extends Text {
    constructor({
        container,
        x = 0,
        y = 0,
        style,

        tweenTime = 0.3,
        text = '0',
        prefix = '',
        suffix = '',
        fixed = 2,
        name
    }) {
        super({
            container,
            x,
            y,
            text: `${prefix}${Number(text).toFixed(fixed)}${suffix}`,
            style: defaultsDeep(style, defaultStyle)
        })

        this.name = name
        this.tweenTime = tweenTime
        this.currentText = Number(text)
        this.prefix = prefix
        this.suffix = suffix
        this.fixed = fixed

        TweenMax.ticker.addEventListener('tick', this.updateTextValue.bind(this))
    }

    set(newValue) {
        this.tween = TweenMax.to(this, this.tweenTime, { currentText: Number(newValue) })
    }

    updateTextValue() {
        if (`${this.prefix}${Number(this.currentText).toFixed(this.fixed)}${this.suffix}` === this.text) return null
        this.text = `${this.prefix}${Number(this.currentText).toFixed(this.fixed)}${this.suffix}`
    }

}

export { BalanceText }