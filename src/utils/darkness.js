import { Graphics } from './graphics'
import { Subject } from 'rxjs/Subject'
import { TweenMax } from 'gsap'

class Darkness extends Graphics {

    constructor({
        container,
        x,
        y,
        autoShow,
        autoHide
    }) {
        super({ container, x, y })

        this.beginFill(0x000000)
        this.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
        this.endFill()
        this.pivot.set(this.width * 0.5, this.height * 0.5)
        this.name = 'darkness'

        autoShow && this.show()
        autoHide && this.hide()

        this.$ = new Subject()
    }

    changeAlpha(final, event) {
        this.tween = TweenMax.to(this, 0.5, {
            alpha: final,
            onComplete: () => this.$.next(event)
        })
    }

    show(final = 0.75) {
        this.alpha = 0
        this.changeAlpha(final, 'SHOW')
    }

    hide(final = 0) {
        this.changeAlpha(final, 'HIDE')
    }

}

export { Darkness }