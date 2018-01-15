import { Sprite } from "./sprite"
import { Observable } from "rxjs"

// TODO: if button disabled disable pointer mode ( idea )

class Button extends Sprite {
    constructor({
        container,
        texture,
        x,
        y,
        anchor,
        visible,
        name,
        alpha,
        isHover = true,
        isTap = true
    }) {
        super({ container, x, y, texture, anchor, name, alpha, visible })

        this.textureName = texture
        this.textureNormal = PIXI.utils.TextureCache[texture]
        this.textureOn = PIXI.utils.TextureCache[`${this.textureName}_on`]
        this.textureOff = PIXI.utils.TextureCache[`${this.textureName}_off`]
        this.textureHover = PIXI.utils.TextureCache[`${this.textureName}_hover`]
        this.textureTap = PIXI.utils.TextureCache[`${this.textureName}_tap`]
        this.textureDisabled = PIXI.utils.TextureCache[`${this.textureName}_disabled`]

        this.isHover = isHover
        this.isTap = isTap
        this.enabled = true
        this.isMax = false
        this.isMin = false

        this.addStreams()
    }

    addStreams() {
        this.interactive = true
        this.buttonMode = true

        this.over$ = Observable.fromEvent(this, 'pointerover').filter(e => this.enabled).map(e => ({ from: this, type: 'OVER', data: e }))
        this.out$ = Observable.fromEvent(this, 'pointerout').filter(e => this.enabled).map(e => ({ from: this, type: 'OUT', data: e }))
        this.end$ = Observable.fromEvent(this, 'touchend').filter(e => this.enabled).map(e => ({ from: this, type: 'END', data: e }))
        this.down$ = Observable.fromEvent(this, 'mousedown').merge(this.end$).filter(e => this.enabled).map(e => ({ from: this, type: 'DOWN', data: e }))
        this.up$ = Observable.fromEvent(this, 'pointerup').filter(e => this.enabled).map(e => ({ from: this, type: 'UP', data: e }))
        this.$ = Observable.merge(this.over$, this.out$, this.down$, this.up$)

        if (this.isHover) {
            this.over$.subscribe(next => this.hover())
            this.out$.subscribe(next => this.normal())
        }

        if (this.isTap) {
            this.down$.subscribe(next => this.tap())
            this.up$.subscribe(next => this.hover())
        }
    }

    normal() {
        this.texture = this.textureNormal
    }

    hover() {
        if (this.textureHover)
            this.texture = this.textureHover
    }

    tap() {
        if (this.textureTap)
            this.texture = this.textureTap
    }

    toOn() {
        if (this.textureOn)
            this.texture = this.textureOn
    }

    toOff() {
        if (this.textureOff)
            this.texture = this.textureOff
    }

    to(mode) {
        switch (mode) {
            case true:
                this.toOn()
                break
            case 'on':
                this.toOn()
                break
            case false:
                this.toOff()
                break
            case 'off':
                this.toOff()
                break
            default:
        }
    }

    disable() {
        this.enabled = false
        this.interactive = false
        if (this.textureDisabled) this.texture = this.textureDisabled
        else if (this.textureOff) this.texture = this.textureOff
        else this.alpha = 0.3
    }
    
    enable() {
        if (this.isMin || this.isMax) return null
        this.enabled = true
        this.interactive = true
        if (this.textureDisabled) this.texture = this.textureNormal
        else if (this.textureOff) this.texture = this.textureNormal
        else this.alpha = 1
    }

    min(v) {
        if (v) {
            this.isMin = true
            this.disable()
        } else {
            this.isMin = false
            this.enable()            
        }
    }

    max(v) {
        if (v) {
            this.isMax = true
            this.disable()
        } else {
            this.isMax = false
            this.enable()
        }
    }

}

export { Button }
