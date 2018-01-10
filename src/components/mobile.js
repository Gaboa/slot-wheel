import defaultsDeep from 'lodash.defaultsdeep'
import { Container, Button, Text, BalanceText, Graphics, Sprite } from "../utils"
import { Darkness } from '../levels/preload/helpers'
import { Observable } from 'rxjs'

const defaultButtonsConfig = {
    buttons: ['menu', 'auto', 'stop', 'spin', 'bet', 'sound'],
    delta: 0.02,
    style: {}
}

const defaultStyle = {
    fontFamily: 'Arial',
    fontSize: 30,
    fill: ['#ffffff', '#B2B2B2'],
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 8,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 1,
}

class MobileButtons extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })

        this.config = defaultsDeep(config, defaultButtonsConfig)
        this.name = 'buttons'        

        this.items = []
        this.config.buttons.forEach(button => {
            this.items.push(
            this[button] = new Button({
                container: this,
                texture: `mobile_${button}`,
                isHover: false,
                name: button
            }))
        })

        // Autoplay counter
        this.count = new BalanceText({
            container: this,
            fixed: 0,
            text:  0,
            suffix: '',
            style: this.config.style,
            visible: false
        })
        this.stop.visible = false

        this.setupPositions()

    }

    setupPositions() {
        this.auto.y = -this.spin.height / 2 - this.auto.height / 2 - this.config.delta * GAME_HEIGHT
        this.bet.y = this.spin.height / 2 + this.bet.height / 2 + this.config.delta * GAME_HEIGHT
        this.menu.y = this.auto.y - this.auto.height / 2 - this.menu.height / 2 - this.config.delta * GAME_HEIGHT
        this.sound.y = this.bet.y + this.bet.height / 2 + this.sound.height / 2 + this.config.delta * GAME_HEIGHT
        this.stop.y = this.auto.y
    }

    enableAll() {
        this.items
            .filter(item => item !== this.sound)
            .forEach(button => button.enable())
    }

    disableAll() {
        this.items
            .filter(item => item !== this.sound)
            .forEach(button => button.disable())
    }

    show() {
        this.visible = true
    }
    
    hide() {
        this.visible = false
    }

}

const defaultMenuConfig = {
    width: 0.25,
    settings: {
        header: 'SETTINGS',
        rows: [0.23, 0.455, 0.68],
        buttons: {
            sound: {
                label: 'EFFECTS',
                side: -1,
                row: 0
            },
            music: {
                label: 'MUSIC',
                side: 1,
                row: 0
            },
            fast: {
                label: 'FAST SPIN',
                side: -1,
                row: 1
            },
            hand: {
                label: 'HAND MODE',
                side: 1,
                row: 1
            },
            info: {
                label: 'INFO',
                side: -1,
                row: 2
            },
            quality: {
                label: 'LOW QUALITY',
                side: 1,
                row: 2
            }
        },
    },
    auto: {
        header: 'AUTOPLAY',
        values: [10, 25, 50, 100, 250, 500],
        rows: [0.25, 0.47, 0.7],
        font: 60
    },
    bet: {
        header: 'SET BET',
        rows: [0.23, 0.475, 0.7],
        max: true,
        level: true,
        value: true,
    }
}

class MobileMenu extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })

        this.config = defaultsDeep(config, defaultMenuConfig)
        this.name = 'menu'

        this.darkness = new Darkness({ container: this, autoHide: true })
        this.auto     = new MobileAutoMenu({ container: this, config: this.config })
        this.settings = new MobileSettingsMenu({ container: this, config: this.config })
        this.bet      = new MobileBetMenu({ container: this, config: this.config })
    }

    open(name) {
        this.close()
        this.current = name
        this.visible = true
        this[this.current].visible = true
    }
    
    close() {
        this.visible = false
        if (this.current)
        this[this.current].visible = false
    }

}

class MenuTemplate extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })

        this.config = config
        this.pivot.set(this.config.width * GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5)
        this.visible = false

        // BG
        this.bg = new Graphics({ container: this })
        this.bg.beginFill(0x000000)
        this.bg.drawRect(0, 0, this.config.width * GAME_WIDTH, GAME_HEIGHT)
        this.bg.endFill()
        
        this.title = new Text({
            container: this,
            x: this.config.width * 0.5,
            y: 0.075,
            text: this.config.header,
            style: {
                fontSize: 45,
                fill: 0xffffff
            }
        })

        this.back = new Button({
            container: this,
            texture: 'settings_return',
            x: this.config.width * 0.5,
            y: 0.9
        })
    }

}

class AutoButton extends Container {

    constructor({
        container,
        x,
        y,
        amount,
        style
    }) {
        super({ container, x, y })
        this.name = amount

        this.bg = new Sprite({
            container: this,
            texture: 'settings_empty'
        })

        this.label = new Text({
            container: this,
            text: amount,
            style: defaultsDeep(style, defaultStyle)
        })

        this.setupStreams()
    }

    setupStreams() {
        this.interactive = true
        this.buttonMode = true

        this.$ = Observable.fromEvent(this, 'pointerdown')
        this.$ = this.$.mapTo(this.name)
    }

}

class MobileAutoMenu extends MenuTemplate {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y, config: defaultsDeep(config.auto, config) })

        this.menuWidth = config.width * GAME_WIDTH
        this.config = config.auto
        
        this.buttons = []
        this.config.values.forEach((amount, index) => {
            let button = new AutoButton({
                container: this,
                amount,
                style: { fontSize: this.config.font }
            })
            let delta = (this.menuWidth - 2 * button.width) / 3
            let col = (index % 2 === 0) ? -1 : 1
            button.x = this.menuWidth / 2 + col * (delta / 2 + button.width / 2)
            switch (index) {
                case 0:
                case 1:
                    button.y = this.config.rows[0] * GAME_HEIGHT
                    break
                case 2:
                case 3:
                    button.y = this.config.rows[1] * GAME_HEIGHT
                    break
                case 4:
                case 5:
                    button.y = this.config.rows[2] * GAME_HEIGHT
                    break
                default:
            }
            this.buttons.push(button)
        })

        this.$ = Observable.merge([...this.buttons.map(b => b.$)])

    }

}

class SettingButton extends Container {

    constructor({
        container,
        x,
        y,
        margin = 0.02,
        name,
        text,
        side,
        menuWidth,
        style
    }) {
        super({ container, x, y })

        this.name = name.split('_')[0]

        this.sprite = new Sprite({
            container: this,
            texture: `settings_${name}`
        })

        this.label = new Text({
            container: this,
            text: text.toUpperCase(),
            style: defaultsDeep(style, defaultStyle)
        })
        this.label.y = this.sprite.height / 2 + margin * GAME_HEIGHT

        let d = (menuWidth - 2 * this.sprite.width) / 3
        this.x = menuWidth / 2 + side * (d / 2 + this.sprite.width / 2)

        this.setupStreams()
    }

    changeTo(mode) {
        switch (mode) {
            case 'on':
                this.changeToOn()
                break
            case true:
                this.changeToOn()
                break
            case 'off':
                this.changeToOff()
                break
            case false:
                this.changeToOff()
                break
            default:
        }
    }

    changeToOn() {
        this.sprite.changeTexture(`settings_${this.name}_on`)
    }

    changeToOff() {
        this.sprite.changeTexture(`settings_${this.name}_off`)
    }

    setupStreams() {
        this.interactive = true
        this.buttonMode = true

        this.$ = Observable.fromEvent(this, 'pointerdown')
    }
}

class MobileSettingsMenu extends MenuTemplate {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y, config: defaultsDeep(config.settings, config) })

        this.buttons = []
        for (let button in this.config.buttons) {
            this.buttons.push(
                this[button] = new SettingButton({
                    container: this,
                    y: this.config.rows[this.config.buttons[button].row],
                    text: this.config.buttons[button].label,
                    name: button,
                    side: this.config.buttons[button].side,
                    menuWidth: this.config.width * GAME_WIDTH
                })
            )
        }

    }

}

class MobileBalance extends Container {

    constructor({
        container,
        x,
        y,

        text = 'bet level',
        delta = 0.01,
        labelStyle,
        textStyle
    }) {
        super({ container, x, y })

        this.delta = delta * GAME_WIDTH

        this.bg = new Sprite({
            container: this,
            texture: 'settings_empty'
        })

        this.label = new Text({
            container: this,
            y: -this.bg.height / 2 - this.delta,
            text: text.toUpperCase(),
            style: defaultsDeep(labelStyle, defaultStyle)
        })

        this.text = new BalanceText({
            container: this,
            fixed: 0,
            tweenTime: 0.3,
            text: 0,
            style: defaultsDeep(textStyle, defaultStyle)
        })

        this.plus = new Button({
            container: this,
            texture: 'settings_plus'
        })
        this.minus = new Button({
            container: this,
            texture: 'settings_minus'
        })
        this.plus.x = this.bg.width / 2 + this.delta + this.plus.width / 2
        this.minus.x = -this.bg.width / 2 - this.delta - this.minus.width / 2

    }

}

class MobileBetMenu extends MenuTemplate {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y, config: defaultsDeep(config.bet, config) })

        this.max = new Button({
            container: this,
            texture: 'settings_max',
            x: this.config.width / 2,
            y: this.config.rows[0]
        });

        this.level = new MobileBalance({
            container: this,
            x: this.config.width / 2,
            y: this.config.rows[1],
            text: 'BET LEVEL',
            textStyle: { fontSize: 60 }
        })
        
        this.value = new MobileBalance({
            container: this,
            x: this.config.width / 2,
            y: this.config.rows[2],
            text: 'COIN VALUE',
            textStyle: { fontSize: 60 }
        })

    }

}

export { MobileButtons, MobileMenu }