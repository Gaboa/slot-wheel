import defaultsDeep from 'lodash.defaultsdeep'
import { Observable, Subject } from 'rxjs'
import { Container, Sprite, Button, BalanceText, Text, Graphics } from "../utils"
import { Screen } from "./screen"
import { TweenMax } from 'gsap';

// TODO: Add Lines to Machine
// TODO: Add Numbers to Machine
// TODO: Add Win to Machine
// TODO: Line with three types of tiles for different advanced line types

const defaultButtonsConfig = {
    level: {
        x: -0.128,
        y: 0,
        delta: 0.075
    },
    value: {
        x: 0.132,
        y: 0,
        delta: 0.075
    },
    auto: {
        x: -0.065,
        y: -0.005
    },
    spin: {
        x: 0,
        y: -0.002
    },
    stop: {
        x: 0,
        y: -0.005,
        visible: false
    },
    max: {
        x: 0.065,
        y: -0.005
    },
}

const defaultBalanceConfig = {
    style: {},
    bet: {
        x: -0.255,
        y: 0,
        text: 0,
        fixed: 0
    },
    lines: {
        x: -0.199,
        y: 0,
        text: 0,
        fixed: 0
    },
    level: {
        x: -0.127,
        y: 0,
        text: 0,
        fixed: 0
    },
    value: {
        x: 0.134,
        y: 0,
        text: 0,
        fixed: 2
    },
    sum: {
        x: 0.235,
        y: 0,
        text: 0,
        fixed: 0
    }
}

class WinNumber extends Text {

    constructor({
        container,
        x,
        y,
        value,
        size
    }) {
        super({ container, x, y, text: value, style: { fill: '#ffffff' } })

        this.name = value
        this.value = value
        if (size)
            this.hitArea = new PIXI.Circle(0, 0, size * 0.5)
    }

    enable() {
        this.interactive = true
        this.buttonMode = true

        this.over$ = Observable.fromEvent(this, 'pointerover').map(e => ({ type: 'OVER', num: this.value }))
        this.out$ = Observable.fromEvent(this, 'pointerout').map(e => ({ type: 'OUT', num: this.value }))
        this.down$ = Observable.fromEvent(this, 'pointerdown').map(e => ({ type: 'DOWN', num: this.value }))
        this.up$ = Observable.fromEvent(this, 'pointerup').map(e => ({ type: 'UP', num: this.value }))
        this.$ = Observable.merge(this.over$, this.out$, this.down$, this.up$)
    }

    disable() {
        this.interactive = false
        this.buttonMode = false
    }

}

class WinTable extends Container {

    constructor({
        container,
        x,
        y
    }) {
        super({ container, x, y })
        this.name = 'table'

        this.bg = new Sprite({
            container: this,
            texture: 'win_table',
            name: 'bg'
        })

        this.text = new BalanceText({
            container: this,
            text: 0,
            name: 'text',
            fixed: 0,
            style: { fontSize: 80 }
        })

        this.scale.set(0)
    }

    show(value) {
        this.text.set(value)
        this.tween = TweenMax.to(this.scale, 0.3, { x: 1, y: 1 })
    }

    hide() {
        this.text.set(0)
        this.tween = TweenMax.to(this.scale, 0.3, { x: 0, y: 0 })
    }

}

const defaultNumbersConfig = {
    left: {
        x: -0.337,
        y: 0,
        pattern: [4, 2, 6, 9, 10, 1, 8, 7, 3, 5],
        delta: 0.065,
        positions: [],
        size: 0,
        WinNumber
    },
    right: {
        x: 0.338,
        y: 0,
        pattern: [4, 2, 6, 9, 10, 1, 8, 7, 3, 5],
        delta: 0.065,
        positions: [],
        size: 0,
        WinNumber
    }
}

const defaultLinesConfig = {
    lines: [
        [2, 0, 0, 0, 2],
        [0, 0, 0, 0, 0],
        [2, 1, 1, 1, 2],
        [0, 1, 1, 1, 0],
        [2, 0, 0, 0, 2],
        [0, 0, 0, 0, 0],
        [2, 1, 1, 1, 2],
        [0, 1, 1, 1, 0],
        [2, 1, 1, 1, 2],
        [0, 1, 1, 1, 0]
    ],
    el: {
        width: 256,
        height: 240
    },
    width: 350,
    tint: {
        bg: 0xff00ff,
        fg: 0xffffff
    },
    show: {
        time: 0.07,
        delta: 0.03
    }
}

// Numbers
class Numbers extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })
        this.name = 'numbers'

        this.config = defaultsDeep(config, defaultNumbersConfig)

        for (const side in this.config)
            this.createSide(side)

        this.enable()
    }

    createSide(side) {
        this[side] = new Container({
            container: this,
            x: this.config[side].x,
            y: this.config[side].y
        })
        this[side].name = side
        this[side].items = []
        this.config[side].pattern.forEach((el, i, arr) => {
            let position = this.config[side].positions[i] || this.config[side].delta * (i - (arr.length - 1) / 2)

            this[side].items.push(
                new this.config[side].WinNumber({
                    container: this[side],
                    y: position,
                    value: el,
                    size: this.config[side].size
                })
            )

        })
    }

    enable() {
        this.$ = new Subject()

        for (const side in this.config)
            this[side].items.forEach(num => num.enable())

        for (const side in this.config)
            this[side].items
                .forEach(num => num.$
                    .map(e => Object.assign({ side }, e))
                    .subscribe(e => this.$.next(e)))
    }

    disable() {
        this.$.complete()
        for (const side in this.config)
            this[side].items.forEach(num => num.disable())
    }

}

// Lines
class Lines extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })

        this.name = 'lines'
        this.items = []
        this.config = defaultsDeep(config, defaultLinesConfig)
        this.config.lines.forEach((line, index) => this.items.push(
            new Line({ container: this, config: this.config, index })))
    }

    show(number) {
        this.items[number - 1].show()
    }
    
    hide(number) {
        this.items[number - 1].hide()
    }

}

class Line extends Container {

    constructor({
        container,
        x,
        y,
        config,
        index
    }) {
        super({ container, x, y })

        this.name = index + 1
        this.config = config
        this.items = []

        this.config.lines[index]
            .filter((cur, i, arr) => i !== arr.length - 1)
            .forEach((cur, i) => this.items.push(
                new Part({
                    container: this,

                    w: this.config.el.width,
                    h: this.config.el.height,
                    width: this.config.width,
                    tint: this.config.tint,

                    length: this.config.lines[index].length,
                    next: this.config.lines[index][i + 1],
                    cur,
                    i
            })))

        this.hide()
    }

    show() {
        TweenMax.staggerTo(this.items, this.config.show.time, { alpha: 1 }, this.config.show.delta)
        // this.items.forEach(part => part.alpha = 1)
    }
    
    hide() {
        TweenMax.staggerTo([...this.items].reverse(), this.config.show.time, { alpha: 0, overwrite: 'all' }, this.config.show.delta)
        // this.items.forEach(part => part.alpha = 0)
    }

}

class Part extends Container {

    constructor({
        container,

        w,
        h,
        width,
        tint,

        length,
        next,
        cur,
        i
    }) {
        super({ container })

        this.bg = PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXgAAAAsCAMAAABYK1PBAAAAtFBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////oK74hAAAAO3RSTlMAAwoGEhsOFiMwKEQfPyw3O1M0aVxP+VclSG5hhIC/cmXDpI2piZF3TKGcupe0y93urXvO08fZsPTh5zjmSe8AAAgJSURBVHja7NXpVhpBEIbhxJV9AAdZB1DZRBFBwAj3f1+p6q7uqh6GAYx4NPK25uSHAc/zNZNfX6Tfn9Wvn9DOGqef2f+y0fs4T75KpzF9kVFidHdHvcAT3dnF2YGDt4gOf6k9xznYHFuJN7nKYigvYzrn8/7Eq8QUN5No0zBb59hfe4txLG4Eo1MGj1tityqbS+xYRqZ+k/XBtq4Tu8iGKWLRI6E3CEtbppWmkWgpt1xUyQ8tF1XKKXI8uQ4nZ9k0h+snF9ikLqAjjeWtDeuGWKMZiyZPlrdl8SuLf4kvbU98/KKcJyuaoqdyp1kfRQxiW5vC+q/RW3XyDim7wtI3ROuasiZriarUAI+tFF1h50qRDTh8RyrNiQ3XFnKXCW0iBwl9QMQQWp/phTuqIzlJs7IklsBSN+RqSLEwXVnll32u7taWXemzR/RPRHWRj99cWcezyZ1C6ziz8CRkEl6Dp1ATIL6hZ3dkR3UkTyhqVmZiFha81lawup5GUFWjWrq+bWoKggC+uUbQ2LMAj9M0mFJ9W0tXo2g1XooHEtvYWeQkYg93DTNFBQYAfKBneXZH9kQlBd5K2iizsRRmXmvLrkxKkhDpdXV3qh71aBrK7kPd7tJ9qKHs0daj7rCujkbT8UY8jt2FR+FBwnPYLXAImADwM0iv5c1zRrsDO6B7ebBWzALZFWZfwiVZcjWkbCngOroJ9KoamR5ETbcbfW7gWza/kdEPqOP00HywjR5GutfRKzTBOjoejley65hpzCo8CQ1Cc/AatIUaIpv3imAP9HDprTy7p5JePl0dlApl7UzIkpiAmZdwSdagWlHBSFiqJ+hFN5MtnMaiNzjwJ3xtaEw/4LRwmsleVE/YHKPxVDQSROvYZWgWGgUMxCB2DhDjLXCIQqmaznrJXAUv/ckJw6N7JpEr5tODgl9vX9XQWSuzsRZmYMVLuEZWokpKbYctsWfqj+7aaYXnI8MXDEVv/EwtobclrsdriX1oGzOMHYUmsXvgGmoONYb5aLRghrpfLlWBPgV3/sLI44WH+w7u2WrBb9f6QaN7h8ykTMZ0fS2w5rW2BGtUJejqGyYGstvQMHYVNQlI8B76I0Jr0BYwRDeYtq7q5UHaS1YylyCP8HTh4TlTzA7K7da02xvedibgTMqAzMQkjL7E+31t/3UV2sQMAjS8Bo0BU8ASndvhYzfoX/mltJdLwMOG4eHCV5L5Krg3esPOqHkzV9CKGZGV8Q8U3i9ag8bAKdQQT/PmaHL/2AX5QbaoHzanCh6fNBm48KV6K+jdj+az8RKhj84fs8Tz8m3x0pyAfLuAV97A05Mm56XL7WlvvDp2oBaNmj/IJyvnly58vurXgtnq2MF6atVL2WQK/nsV8JWkgj8+Ww7YdR/giyH4xF92zWQ3YSiGouqiA5AyNIwJiCFDUQeqAFVB/P9/1X5xbN5zglRVLKrmBrFAwMIgeD7n5oM/nOpcLcN52eDbncnI3+5Oda6WTQDHGv0b32n1wnlU/7leLR8zfzTp0qmGz/Fes9Fd9/3n5C1+hfPk0Rwo6/Pkr5IfJvE0uV++r6JZEA5aT/bg7+7NV34Ak5/C4prB1so7K+xRsKrWS9TlDDG0POHutKf91WyvWfySJtsg7E26wAxyTCaMbNzAySOqSVLANERpCIQxpCFGA0stg4PD//o8SvZTZjaCbITYAK9JoynAmj7OvYlfeIZk5lfeAyiMlCxENrklLqmwpKKSDCUJ6BjKIDDn79Gc4UnwGMExmi8O2KFigsUgFqRkRom0OPAX/d66ZeYuXPiG8KQ3Ri48QRofhhaJJxBvc3hNiTMN4ZdLzYoFZSpCjFGIGK6fB1+lSLBiwUeIAC7C80znBc3n6oQnbHF5UiUOlmdHglC+b4B8t2PmnpsQNn93OPmHZi6gjH0683shhNyeNk+V3qmwThXKqXBNbJtELHE2nxs3u6qoZ8KrOUsOaykKGylMBhEdpWVUJOZDmShLfmDYQ62NgyIPwjheJp+P3hjXXLe6spVdtuVay02r2EAtWR3D6jjVeBXbydx86WQqscS8oyNlHQ2rFewUUmVffYh2r5Z6tcwrWleUrrc8dxo8224cvfHdbe4XOPUC3S6o6BboYsHcxC4VSJWAkliJkshNChfcn4cftpPgVWSaSAehiF07KOkcLDC6b9DDlLQNHjG6a2CKBmOuGfDcda3G86xGTdvkYp9Gt2msKs2IUtKjoeYH3M4SfLdvRrsJwzAUlTqlEdommIa0lRf+/y/nLkZ2fG9Ds1UIIY5RoTRNGvf13M8TcD6dVyEDAZnQA7oNt2zM5TDDBgUbZzyhXqN2TTFrwO5Qgc9EsixQh+xboAYZ9cfeC84ce50ugDX2YXz9HgJHKeXIcAMBnRNFMzDLvFemMKdsVwiSXxTKkuJcMus7tF7NyZY0GZ3JBWMSbElnSu4PRnQiGVM5ainWquraVE6AYFkeHMSk3JmwRy3K4FCmpkIpDUV5EmXhwWAmdq4sYQ9xhIkfXEnBtRZctjvv2rGX0l9X0bGATFjm98jqDuIOU2848R5nJg1HYXhR1iZqPA8eEJ14Lk9CQIenErd+bcc1i77W5YGsWIc9o9Gw5FemFPqjILIoiYHgi0FSH28tUh+ZUJ6zPxvSkQvZPvs0vHSlni57mj+czGoZdgMAi45IeWSG7DFy82haZ3YSXwxntJKT/zL4AnhjOfcR/2uyWa51gD9W1F94hMzrvcW4HyNJ/GRLfgCAmMtMn0fqAQAAAABJRU5ErkJggg==')
        this.fg = PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXgAAAAsCAMAAABYK1PBAAAAsVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+3mHKcAAAAOnRSTlMAA/oJ9gcZ8hLu5TcWDuLpxt7CM5lQKWGdvqS5yyTaVtRKMFotILSBes+vkV5FjJXXczyHqmNAbR1om5U/2QAABHFJREFUeNrtmm1bEkEUQMsMIUGBJFCEktY2Qywxre3//7Bm7svcmQvDy7YW2pztgz5kQ+fAunuHF4lEIpFIJBKJRCKReMq8rJQX/ylxI69X8KoiVq3x9FtFnEYktoR6qx7SDKn9Ac2QusKs7VgVazeqxOxqq2JUGfxpuARGwDtHBkyYtwGHWxD+5ITJALfcCLkEfhpULwmk28SaPI5mbZj0AmKWrDqjZFLczS0PhpnlAukx75mPzDXRV9x79BXXxEfmPdNjaOGZ5cEwt0g16uQCURvp4ifRPUqmEM1iWRSzYeeX5ZJYtMpO2SUZBF1FUfyw3Bo+AzlyB9wgU+IrcRIyUKiH+aemxA2CK+QIrn1rgKdjnhYkpF5cietgGwrDUVwR7iE5pIWkWG3dumbNIpkUi2H0y3ZBrRELWlEqGUWVaJCFnSHfLV+AT8iQOBW6SLvraEfpOvjLU2FI0FK4LjyFMwQDQjRMhY2oDqfpQxcXhYpID8ohMTiFrRB3b7TXmzXwjJqtZFMaHINhq9i+couC9ea5dWvNoleWSkJZpHN2jlxZPiDfgDHR8ThyvOHDfLmU4O8QnaOOY9wZI7gaLX1lOUdcPQ5FgTgOlrFdbJU85yRFYd8pJgf0wBpGmo2BKaBErVk36mPeW7VRdjgXzfAyBseiGA2jXicXzLJWdko2WaEYOxYaAQeNg6Xsb4n84IGH+edDjh1+P6xFjbgOp8EuHAWTYA/JATXgzSEp5ofZqNYS89p79tC7LsBznoNlkIyOfcPkF+yiWydWG43Z27PHCn7Jwd/JoVAPh19GMKvDU4g103lcGKwCTagI9YA3CdTAGNAiz6FEcd17yCLmX75qZhdFPh2QZrCMkp1iMezr1WK10pgwtrYzSK+w0EIYP4n0cDkgBrTgFINpXlxkzVfLxL9uXc7v786GbfCMmkWyKBbDodu9XVJYXYvFMMuSeDkkBqaAEu3h2d39/LL1epn4+mh2ezK8GnesbXTte37mhsvj1whKYAXboDO+Gg5uZ6N6CfHea5uW2qmzxF8G/+8iwpnf39tWfPxUE57NpQTGEHbvnF09sXO/PvMvOdXcwKmmml+ujWPJse6a5Yn02FskvOrB1zJS6pdr+cvJdonLyX17LAAvm40o6y4OLI4os/pysrH+crJd9nJSbqAm4Q1UX91ATZfeQJ2WuoFq2D/xG6h9OQz+twr1sPouegMFy1d4AzVVN1D98AZqwjdQ60cGEzcymEVHBrk/MpCJATXBN4k/MjjfeGTAvTRvIhwt0vEZL44MWCrhjQzw5Ut2eWagRgZ5dGQwcyODiRoZVDgk6z3mkEzGXnysoisHctp9IkOyrcbCWGOjsTBNhcuPhU8UA416vOxYGIf5m42F0fEWY+FnsBFy/xw3Qirb+mNo52/t1l+2auvvcDuiW39gk1jY+mN2YOuvTA9O8nKTze66pvlYm92iUli/2Q3/jZ3Y7K744x1w/IOPd+DCz+DjHZb0gaZEIpFIJBKJRCKRSDwGvwG+2jGjSxX5dwAAAABJRU5ErkJggg==')
        this.bg.anchor.set(0.5)
        this.fg.anchor.set(0.5)
        this.bg.tint = tint.bg
        this.fg.tint = tint.fg
        this.bg.name = 'bg'
        this.fg.name = 'fg'
        this.addChild(this.bg, this.fg)

        this.x = w * (i + 1 - length / 2)
        this.y = h * ((cur - 1) + (next - cur) / 2)
        this.scale.x = Math.sqrt(Math.pow(w, 2) + Math.pow(h * (next - cur), 2)) / width
        this.rotation = Math.atan(h * (next - cur) / w)
    }

}

// Panel
class Panel extends Container {

    constructor({
        container,
        x,
        y
    }) {
        super({ container, x, y })
        this.name = 'panel'

        this.panel = new PIXI.spine.Spine(PIXI.utils.resources.panel.spineData)
        this.panel.name = 'spine'
        this.panel.state.setAnimation(0, 'idle', true)
        this.addChild(this.panel)
        
        this.labels = new Sprite({
            container: this,
            texture: 'panel_root',
            name: 'labels'
        })

        this.buttons = new Buttons({ container: this, y: 0.06 })
        this.balance = new Balance({ container: this, y: 0.061 })
    }

}

class Buttons extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })
        this.name = 'buttons'

        this.config = defaultsDeep(config, defaultButtonsConfig)

        this.items = []
        this.createBalanceControl('level')
        this.createBalanceControl('value')

        this.createButton('auto')
        this.createButton('max')
        this.createButton('stop')
        this.createButton('spin')

    }

    createButton(name) {
        this[name] = new Button(Object.assign({
            container: this,
            texture: name
        }, this.config[name]))
        this[name].name = name
        this.items.push(this[name])
    }

    createBalanceControl(name) {
        this[name] = {}
        this[name].plus = new Button({
            container: this,
            texture: 'plus',
            x: this.config[name].x + this.config[name].delta * 0.5,
            y: this.config[name].y
        })
        this[name].plus.name = `${name}_plus`
        this[name].minus = new Button({
            container: this,
            texture: 'minus',
            x: this.config[name].x - this.config[name].delta * 0.5,
            y: this.config[name].y
        })
        this[name].minus.name = `${name}_minus`
        this.items.push(this[name].minus, this[name].plus)
    }

    enableAll() {
        this.items.forEach(button => button.enable())
    }

    disableAll() {
        this.items.forEach(button => button.disable())
    }

    disableBalance() {
        this.max.disable()
        this.level.minus.disable()
        this.level.plus.disable()
        this.value.minus.disable()
        this.value.plus.disable()
    }

    enableBalance() {
        this.max.enable()
        this.level.minus.enable()
        this.level.plus.enable()
        this.value.minus.enable()
        this.value.plus.enable()
    }

}

class Balance extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })
        this.name = 'balance'

        this.config = defaultsDeep(config, defaultBalanceConfig)

        this.items = []
        for (const prop in this.config) {
            if (this.config.hasOwnProperty(prop) && prop !== 'style') {
                const field = this.config[prop]
                this[prop] = new BalanceText(Object.assign({
                    container: this,
                    style: this.config.style
                }, field))
                this[prop].name = prop
                this.items.push(this[prop])
            }
        }

    }

}

class Machine extends Container {

    constructor({
        container,
        x,
        y
    }) {
        super({ container, x, y })
        this.name = 'machine'

        // Machine BG
        this.bg = new PIXI.extras.TilingSprite(
            PIXI.utils.TextureCache['tile'],
            256 * 5,
            240 * 3
        )
        this.bg.anchor.set(0.5)
        this.bg.name = 'bg'
        this.addChild(this.bg)

        this.lines = new Lines({ container: this })

        // Screen with elements
        this.screen = new Screen({
            container: this,
            config: {
                amount: 5,
                dir: 'down',

                loop: {
                    amount: 20,
                    time: 0.5
                },

                roll: {
                    normal: 1,
                    fast: 1.5
                },

                log: {
                    screen: false,
                    wheel: false,
                    el: false
                }
            },
            dt: 0.075
        })
        this.screen.addMask()

        // Machine frame
        this.frame = new Sprite({
            container: this,
            texture: 'frame',
            name: 'frame'
        })

        // Machine Logo
        this.logo = new PIXI.spine.Spine(PIXI.utils.resources.logo.spineData)
        this.logo.name = 'logo'
        this.logo.state.setAnimation(0, 'idle', true)
        this.logo.y = -0.343 * GAME_HEIGHT
        this.addChild(this.logo)

        // Panel with Buttons and Balance
        this.panel = new Panel({ container: this, y: 0.35 })

        // Win Numbers
        this.numbers = new Numbers({ container: this })

        // Win Table
        this.table = new WinTable({ container: this })

    }

}

export {
    Machine,
    Balance,
    Buttons,
    Panel
}