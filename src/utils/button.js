import { Sprite } from "./sprite"
import { Observable } from "rxjs"

class Button extends Sprite {
    constructor({
        container,
        texture,
        x,
        y,
        anchor,
        visible,
        isHover = true
    }) {
        super({ container, x, y, texture, anchor, visible })

        this.textureName = texture.split('_')[0]
        this.textureNormal = PIXI.utils.TextureCache[texture]
        this.textureOn = PIXI.utils.TextureCache[`${this.textureName}_on`]
        this.textureOff = PIXI.utils.TextureCache[`${this.textureName}_off`]
        this.textureHover = PIXI.utils.TextureCache[`${this.textureName}_hover`]
        this.textureTap = PIXI.utils.TextureCache[`${this.textureName}_tap`]
        this.textureDisabled = PIXI.utils.TextureCache[`${this.textureName}_disabled`]

        this.enabled = true
        this.isHover = isHover

        this.addStreams()
    }

    addStreams() {
        this.interactive = true
        this.buttonMode = true

        this.over$ = Observable.fromEvent(this, 'pointerover').filter(e => this.enabled).map(e => ({ from: this, type: 'OVER', data: e }))
        this.out$ = Observable.fromEvent(this, 'pointerout').filter(e => this.enabled).map(e => ({ from: this, type: 'OUT', data: e }))
        this.down$ = Observable.fromEvent(this, 'pointerdown').filter(e => this.enabled).map(e => ({ from: this, type: 'DOWN', data: e }))
        this.up$ = Observable.fromEvent(this, 'pointerup').filter(e => this.enabled).map(e => ({ from: this, type: 'UP', data: e }))
        this.$ = Observable.merge(this.over$, this.out$, this.down$, this.up$)

        if (this.isHover) {
            this.over$.subscribe(next => this.hover())
            this.out$.subscribe(next => this.normal())
        }

        this.down$.subscribe(next => this.tap())
        this.up$.subscribe(next => this.hover())
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
        if (this.textureDisabled) this.texture = this.textureDisabled
        else this.alpha = 0.3
    }
    
    enable() {
        this.enabled = true
        if (this.textureDisabled) this.texture = this.textureNormal
        else this.alpha = 1
    }
}

export { Button }
