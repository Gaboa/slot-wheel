import defaultsDeep from 'lodash.defaultsdeep'
import { Container, Button, BalanceText } from "../utils"

const defaultButtonsConfig = {
    buttons: ['menu', 'auto', 'stop', 'spin', 'bet', 'sound'],
    delta: 0.02,
    style: {}
};

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
            text: 0,
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

}

export { MobileButtons }