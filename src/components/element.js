import isEqual from 'lodash.isequal'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { TweenMax } from 'gsap'
import { Container, Sprite, Spine, BalanceText } from '../utils'

class WinCircle extends Container {

    constructor({
        container,
        x,
        y
    }) {
        super({ container, x, y })

        this.bg = new Sprite({
            container: this,
            texture: 'win_circle'
        })

        this.count = new BalanceText({
            container: this,
            suffix: '',
            fixed: 0,
            text: ''
        })

        this.scale.set(0)
    }

    show(num) {
        this.count.set(num)
        this.tween = TweenMax.to(this.scale, 0.3, { x: 1, y: 1 })
    }
    
    hide() {
        this.count.set(0)
        this.tween = TweenMax.to(this.scale, 0.3, { x: 0, y: 0 })
    }

}

class Element extends Container {

    constructor({
        container,
        x,
        y,

        width,
        height,
        index,
        symbols,
        anim
    }) {
        super({ container, x, y })

        this.w = width
        this.h = height

        this.index = index
        this.symbols = symbols

        this.createSprite('bg')
        this.createSprite('blur')
        this.createSprite('static')
        this.createSpines()
        this.win = new WinCircle({ container: this, x: this.w * 0.3, y: this.h * -0.3 })

        this.enable()
        
        if (anim)
            this.play(this.anim = anim)

    }

    enable() {
        this.subs = []
        this.$ = new Subject()

        this.spines.forEach(spine => this.subs.push(spine.$.subscribe(e => this.$.next(e))))

    }

    disable() {
        this.$.complete()
        this.subs.forEach(s => s.unsubscribe())
    }

    createSprite(name) {
        this[name] = new Sprite({
            container: this,
            texture: `${name}_${this.symbols[0].name}`,
            visible: false
        })
    }

    createSpines() {
        this.spines = []
        this.symbols.forEach(s => {
            
            this[name] = new Spine({
                container: this,
                name: s.name,
                visible: false
            })
            
            this.spines.push(this[name])
        })
    }

    play(anim) {
        this.$.next({ type: 'PLAY', anim })
        switch (anim.type) {
            case 'blur':
                this.playBlur(anim.el)
            break
            case 'static':
                this.playSpine(anim.el)
            break
            case 'spine':
                this.playSpine(anim.el)
            break
        }
    }

    playBlur(i) {
        this.static.visible = false
        this.bg.visible = false
        this.spines.forEach(s => s.visible = false)        

        this.blur.visible = true
        this.blur.changeTexture(`blur_${this.getSymbolName(i)}`)
    }
    
    playStatic(i) {
        this.blur.visible = false
        this.spines.forEach(s => s.visible = false)        

        this.bg.visible = true
        this.bg.changeTexture(`bg_${this.getSymbolName(i)}`)

        this.static.visible = true
        this.static.changeTexture(`static_${this.getSymbolName(i)}`)
    }
    
    playSpine(i) {
        this.playStatic(i)
        this.static.visible = false

        this.active = this.spines
            .filter(s => s.name === this.getSymbolName(i))[0]
        
        this.active.visible = true
        this.playNormal()
    }

    playWin() {
        if (this.active)
            this.active.state.setAnimation(0, 'win', true)
        
        this.tween = TweenMax.to(this.scale, 0.2, {
            x: 1.1,
            y: 1.1,
            onStart:    () => this.$.next({ type: 'WIN', state: 'START',    active: this.active }),
            onComplete: () => this.$.next({ type: 'WIN', state: 'COMPLETE', active: this.active })
        })
    }
    
    playNormal() {
        if (this.active)
            this.active.state.setAnimation(0, 'idle', true)

        this.tween = TweenMax.to(this.scale, 0.2, {
            x: 1,
            y: 1,
            onStart:    () => this.$.next({ type: 'NORMAL', state: 'START',    active: this.active }),
            onComplete: () => this.$.next({ type: 'NORMAL', state: 'COMPLETE', active: this.active })
        })
        this.win.hide()
    }
    
    getSymbolName(i) {
        return this.symbols.filter(s => s.symbol == i)[0].name
    }

}
class SpriteElement extends Sprite {
    constructor({
        container,
        x = 0,
        y = 0,

        width,
        height,
        index,
        anim
    }) {
        super({ container, x, y, texture: 'static_j' })
        this.w = width
        this.h = height

        this.index = index
        this.anchor.set(0.5)

        if (anim)
            this.play(this.anim)
        
        this.enableStreams()
    }
    enableStreams() {
        this.$ = new Subject()
        this.subs = []
    }
    disableStreams() {
        this.subs.forEach(sub => sub.unsubscribe())
    }
    play(anim) {
        this.anim = anim
        this.texture = PIXI.utils.TextureCache[`${anim.type}_${anim.el}`]
        this.$.next({ from: 'EL', state: 'play', anim, el: this })
    }
    show() {
        this.visible = true
        this.$.next({ from: 'EL', state: 'show', el: this })
    }
    hide() {
        this.visible = false
        this.$.next({ from: 'EL', state: 'hide', el: this })
    }
}

export { SpriteElement, Element }