import { Container } from './container'
import { Graphics } from './graphics'
import { Text } from './text'
import { TweenMax } from 'gsap'
import { Observable } from 'rxjs/Observable'

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
        this.bgAlpha = alpha

        this.bg = this.createBg()
        this.label = this.createLabel()
        this.on = this.createSideText('ON', 0.05)
        this.off = this.createSideText('OFF', -0.05)
        this.trigger = this.createTrigger()
        this.marker = this.createMarker()

        this.addInteractive()
    }

    to(value) {
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

    addInteractive() {
        this.interactive = true
        this.buttonMode = true
        this.$ = Observable.fromEvent(this, 'pointerdown')
    }

    createLabel() {
        return new Text({
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
    }

    createSideText(text, x) {
        return new Text({
            container: this,
            x: x,
            y: 0.016,
            text: text,
            style: { fill: '#ffffff', fontSize: 20 }
        })
    }

    createTrigger() {
        let trigger = PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAoCAMAAAA/pq9xAAAAS1BMVEX///////////////////////////9HcEz///////////////////////////////////////////////////////////////////81PUZ7AAAAGHRSTlPZA+qY5e7cAPrhs1jzE/Ich3jTrDcIlTg71dlhAAABGUlEQVRIx72Xy3aDMAxEx9hGMmDepPP/X9pFTpv0kVUs3RUr7kEysgbyTDi3Y8/KN9C8H9sZfrwWT8/LWtiIsi7/SupNSc2p9HiLvqSspN7qX8nYkXNBI8pMduMvSYjk1EwBAGUiY3iWXAPZoTEdOVwPSRioBc0pyiF8SyK1hwG9Mn5JRrLAhEKOd0nt2vfj0ZdcRSASOcGMiVEEsqhVse4F00UgK2cYMnMVhGT5IUBhCjipMEV5YmO2lWRuOJhsJYkHdtuWAIU7MntbSc8MJYyh+khcyuXSeJcj7PIzfniMFZcB6TLqfS4tuTlcv1KzwyLhshL5LHdy2a2pl+/CLcEjOviEIBGpsW2ci/VFME2tgml6EUwNI/YneP0yMuNg9lQAAAAASUVORK5CYII=')
        trigger.anchor.set(0.5)
        trigger.scale.set(SCALE_FIX)
        trigger.tint = this.color
        trigger.y = 0.016 * GAME_HEIGHT
        this.addChild(trigger)

        return trigger;
    }

    createMarker() {
        let marker = PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAA6lBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtLS2NjY3a2toAAAAAAADZ2dmkpKT8/PzV1dX7+/uPj4/j4+Orq6vw8PD29vY5OTm1tbXf39/Q0NDt7e339/fIyMidnZ0yMjJ8fHySkpLDw8P9/f3n5+fo6OjExMTExMTX19fl5eXs7OzZ2dnMzMyhoaH////+/v77+/vb29vMzMz+/v74+PjW1tbc3NzPz8/z8/PS0tLY2NjOzs7U1NT19fXu7u7i4uLf39/l5eXn5+fr6+vp6enx8fH8iqUMAAAAP3RSTlMAAg8cFAYIAQsEESEfGiMXLmH3Jyb/YPfm9VO4Z9TkMW+s1tDowXAxVGis+cDCubjR6Pb0z17///////////4d9/t7AAAC80lEQVRIx52W15aqQBBFJQgKmNA256yTwwUEQVtRxJH//51bNDrBUWTNedAH2OtUNdVVFYv9Es9TFJUEwR/Px24KXk/GOS5BxHFx4PgbALyfoAWWzYBYVqATPsWHAgmazTCSmC7k84V0WmIyLJ24ChFAYBkx2+70+iVVLfV7nXZWZFjhCgQER7NMunhfUnyp5Fcp3RfTDEtzFxieAouUWGwov9QoiikwOmd8gmVaNVW5ILXWYthzhhBStalcUbMqnTGEEOsV5apKdfEnQyXBo36nhOiuDj5J6tMkyQlMtaKEqlJlBC55sqHidKrVVG6o2UrRcepkAonUlJuqQTpHGyouMEX1NqL+Y4TAxjdJN5QIaqSPNpAJU1QiqcgE2VAcKz5EQx5ElqNIXJlsKRpSymb8yHiIq61EVBsi4yEuQepERTqSAJH5qfSiIj2SDAVH3I+K9OGYqRhkX6gY0QijUoD8fSS/mWsRIEObb/InxFtGYIBYeiek8Op5NxkgPO+VBOan//KxXc5vFKY6X24/Xkj6/iE/7/fbjRaOaPPtfv8cHDJ8yqnj7L3wyAxteXCcKfmUfsEMdztnGx6ZOt86u92QFAwpSxkhN9TG0DwXITkoS5LMANnWYXOdMbTNwbLRICh+csVylo13IaFBWDtsW7njFSMXuYswdjztCqNqnoMx6p4uMmkXOctc2O7ycmhwWq69MMHk2C6CpvSE8Npn1EseQKwxevpqSqT1jcoI69j15uqZkaHOPRceofLoq/UFDXb8tsK6voMqUH9abLY7Xcert/H3Bhu08Ym8wmvddH3IODkA4Jr6Gq/kyY82fhwWExnhha7bzsHbaEQb7+DYur7ASJ6IlwaMNC4jE4yAmjnufu86M3gfLExUHkuXxxgzerSQTaBPrbGNrMfR78H3OV5zXQuZNl4QbL3Atomsbu7ieP0a4rmBPEMr07Rt01yhmTzIXRvi31eF4fS9LM9mcvl9OgxbFf6ykPxp7fnTchVphfsPG7I+3ohZD3UAAAAASUVORK5CYII=')
        marker.anchor.set(0.5)
        marker.scale.set(SCALE_FIX)
        marker.y = 0.016 * GAME_HEIGHT
        this.addChild(marker)

        return marker
    }

    createBg() {
        let bg = new Graphics({ container: this })
        bg.beginFill(0x000000, this.bgAlpha)
        bg.drawRoundedRect(0, 0, 0.15 * GAME_WIDTH, 0.1 * GAME_HEIGHT, 0.015 * GAME_WIDTH)
        bg.endFill()
        bg.pivot.set(bg.width * 0.5, bg.height * 0.5)

        return bg
    }

}

export { SoundTrigger }