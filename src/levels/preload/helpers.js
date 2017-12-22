import { TweenMax } from 'gsap'
import { Observable, Subject } from 'rxjs'
import { Container, Sprite, Graphics, Text } from '../../utils'

class JumpingButton extends Sprite {

    constructor({
        container,
        texture,
        name,
        x,
        y,
        tweenY,
        startScale = 0.85,
        endScale = 1.15
    }) {
        super({ container, texture, name, x, y })

        this.startScale = startScale
        this.endScale = endScale
        this.tweenY = tweenY

        this.tween = TweenMax.fromTo(this.scale, 1, {
            x: this.startScale,
            y: this.startScale
        }, {
            x: this.endScale,
            y: this.endScale,
            repeat: -1,
            yoyo: true
        })

        this.interactive = true
        this.buttonMode = true

        this.$ = Observable.fromEvent(this, 'pointerdown')
    }

    show() {
        TweenMax.to(this, 0.4, { y: this.tweenY * GAME_HEIGHT, ease: Elastic.easeOut })
    }

}

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

class Bar extends Sprite {

    constructor({
        container,
        texture,
        name,
        x,
        y
    }) {
        super({ container, texture, name, x, y })
        this.addMask()
    }

    addMask() {
        this.mask = new PIXI.Graphics()

        this.mask.beginFill(0xFFFFFF, 1)
        this.mask.drawRect(-this.width / 2, -this.height / 2, 0, this.height)
        this.mask.endFill()

        this.mask.x = this.x
        this.mask.y = this.y

        this.container.addChild(this.mask)
    }

    progress(value) {
        this.mask.clear()
        this.mask.drawRect(-this.width / 2, -this.height / 2, this.width * value / 100, this.height)
    }

    hide() {
        this.container.removeChild(this.mask)        
        TweenMax.to(this.scale, 0.3, { x: 0, y: 0 })
        TweenMax.to(this, 0.3, { alpha: 0 })
    }

}

class Light extends Sprite {

    constructor({
        container,
        texture,
        name,
        x,
        y,
        alpha
    }) {
        super({ container, texture, name, x, y })

        this.blendMode = PIXI.BLEND_MODES.ADD
        this.alpha = alpha

        this.tween = TweenMax.to(this, 25, {
            rotation: 2 * Math.PI,
            repeat: -1,
            ease: Linear.easeNone
        })
    }

}

class SoundTrigger extends Container {

    constructor({
        container,
        x,
        y,
        scale = 1,
        color,
        alpha
    }) {
        super({ container, x, y })
        this.x += 1
        this.name = 'sound'

        this.scale.set(scale)
        this.color = color

        this.interactive = true
        this.buttonMode = true

        this.$ = Observable.fromEvent(this, 'pointerdown')

        // BG
        this.bg = new Graphics({ container: this })
        this.bg.beginFill(0x000000, alpha)
        this.bg.drawRoundedRect(0, 0, 0.15 * GAME_WIDTH, 0.1 * GAME_HEIGHT, 0.015 * GAME_WIDTH)
        this.bg.endFill()
        this.bg.pivot.set(this.bg.width * 0.5, this.bg.height * 0.5)

        // Label
        this.label = new Text({
            container: this,
            y: -0.025,
            text: 'Sound',
            style: {
                fill: '#ffffff',
                fontVariant: 'small-caps',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 200,
                fontSize: 24
            }
        })
        
        // ON-OFF
        this.on = new Text({
            container: this,
            x: 0.05,
            y: 0.016,
            text: 'ON',
            style: { fill: '#ffffff', fontSize: 20 }
        })
        this.off = new Text({
            container: this,
            x: -0.05,
            y: 0.016,
            text: 'OFF',
            style: { fill: '#ffffff', fontSize: 20 }
        })

        // Trigger
        this.trigger = PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAoCAMAAAA/pq9xAAAAS1BMVEX///////////////////////////9HcEz///////////////////////////////////////////////////////////////////81PUZ7AAAAGHRSTlPZA+qY5e7cAPrhs1jzE/Ich3jTrDcIlTg71dlhAAABGUlEQVRIx72Xy3aDMAxEx9hGMmDepPP/X9pFTpv0kVUs3RUr7kEysgbyTDi3Y8/KN9C8H9sZfrwWT8/LWtiIsi7/SupNSc2p9HiLvqSspN7qX8nYkXNBI8pMduMvSYjk1EwBAGUiY3iWXAPZoTEdOVwPSRioBc0pyiF8SyK1hwG9Mn5JRrLAhEKOd0nt2vfj0ZdcRSASOcGMiVEEsqhVse4F00UgK2cYMnMVhGT5IUBhCjipMEV5YmO2lWRuOJhsJYkHdtuWAIU7MntbSc8MJYyh+khcyuXSeJcj7PIzfniMFZcB6TLqfS4tuTlcv1KzwyLhshL5LHdy2a2pl+/CLcEjOviEIBGpsW2ci/VFME2tgml6EUwNI/YneP0yMuNg9lQAAAAASUVORK5CYII=')
        this.trigger.anchor.set(0.5)
        this.trigger.scale.set(1 / scale)
        this.trigger.tint = color
        this.trigger.y = 0.016 * GAME_HEIGHT
        this.addChild(this.trigger)
        
        // Marker
        this.marker = PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAA6lBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtLS2NjY3a2toAAAAAAADZ2dmkpKT8/PzV1dX7+/uPj4/j4+Orq6vw8PD29vY5OTm1tbXf39/Q0NDt7e339/fIyMidnZ0yMjJ8fHySkpLDw8P9/f3n5+fo6OjExMTExMTX19fl5eXs7OzZ2dnMzMyhoaH////+/v77+/vb29vMzMz+/v74+PjW1tbc3NzPz8/z8/PS0tLY2NjOzs7U1NT19fXu7u7i4uLf39/l5eXn5+fr6+vp6enx8fH8iqUMAAAAP3RSTlMAAg8cFAYIAQsEESEfGiMXLmH3Jyb/YPfm9VO4Z9TkMW+s1tDowXAxVGis+cDCubjR6Pb0z17///////////4d9/t7AAAC80lEQVRIx52W15aqQBBFJQgKmNA256yTwwUEQVtRxJH//51bNDrBUWTNedAH2OtUNdVVFYv9Es9TFJUEwR/Px24KXk/GOS5BxHFx4PgbALyfoAWWzYBYVqATPsWHAgmazTCSmC7k84V0WmIyLJ24ChFAYBkx2+70+iVVLfV7nXZWZFjhCgQER7NMunhfUnyp5Fcp3RfTDEtzFxieAouUWGwov9QoiikwOmd8gmVaNVW5ILXWYthzhhBStalcUbMqnTGEEOsV5apKdfEnQyXBo36nhOiuDj5J6tMkyQlMtaKEqlJlBC55sqHidKrVVG6o2UrRcepkAonUlJuqQTpHGyouMEX1NqL+Y4TAxjdJN5QIaqSPNpAJU1QiqcgE2VAcKz5EQx5ElqNIXJlsKRpSymb8yHiIq61EVBsi4yEuQepERTqSAJH5qfSiIj2SDAVH3I+K9OGYqRhkX6gY0QijUoD8fSS/mWsRIEObb/InxFtGYIBYeiek8Op5NxkgPO+VBOan//KxXc5vFKY6X24/Xkj6/iE/7/fbjRaOaPPtfv8cHDJ8yqnj7L3wyAxteXCcKfmUfsEMdztnGx6ZOt86u92QFAwpSxkhN9TG0DwXITkoS5LMANnWYXOdMbTNwbLRICh+csVylo13IaFBWDtsW7njFSMXuYswdjztCqNqnoMx6p4uMmkXOctc2O7ycmhwWq69MMHk2C6CpvSE8Npn1EseQKwxevpqSqT1jcoI69j15uqZkaHOPRceofLoq/UFDXb8tsK6voMqUH9abLY7Xcert/H3Bhu08Ym8wmvddH3IODkA4Jr6Gq/kyY82fhwWExnhha7bzsHbaEQb7+DYur7ASJ6IlwaMNC4jE4yAmjnufu86M3gfLExUHkuXxxgzerSQTaBPrbGNrMfR78H3OV5zXQuZNl4QbL3Atomsbu7ieP0a4rmBPEMr07Rt01yhmTzIXRvi31eF4fS9LM9mcvl9OgxbFf6ykPxp7fnTchVphfsPG7I+3ohZD3UAAAAASUVORK5CYII=')
        this.marker.anchor.set(0.5)
        this.marker.scale.set(1 / scale)
        this.marker.y = 0.016 * GAME_HEIGHT
        this.addChild(this.marker)

    }

    changeTo(value) {
        if (value) {
            this.on.style.fill = '#ffffff'
            this.off.style.fill = this.color
            TweenMax.to(this.marker, 0.3, { x: 0.018 * GAME_WIDTH })
        } else {
            this.on.style.fill = this.color
            this.off.style.fill = '#ffffff'
            TweenMax.to(this.marker, 0.3, { x: -0.018 * GAME_WIDTH })
        }
    }

}

export { JumpingButton, Darkness, Bar, Light, SoundTrigger }