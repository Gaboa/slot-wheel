import defaultsDeep from 'lodash.defaultsdeep'
import { Container, Graphics, Text, ScalingButton, BalanceText } from "../utils"
import { TweenMax } from 'gsap'

// TODO: Refactor change modes for fotter balance

const defaultConfig = {

    desktop: {
        bg: {
            top: {
                height: 0.034,
                color: 0x000000,
                alpha: 0.4
            },
            bottom: {
                height: 0.034,
                color: 0x000000,
                alpha: 0.6
            }
        },
        time: {
            x: 0.475,
            style: {
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: 24,
                fontWeight: 'lighter',
                fill: ['#ffffff', '#B2B2B2'],
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 8,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 1,
            }
        },
        buttons: {
            position: 'bottom',
            amount: 6,
            start: 0.013,
            delta: 0.026,
            home: {
                index: 0,
                texture: 'home',
                visible: true
            },
            settings: {
                index: 1,
                texture: 'settings',
                visible: true
            },
            info: {
                index: 2,
                texture: 'info',
                visible: true
            },
            sound: {
                index: 3,
                texture: 'sound',
                visible: true
            },
            fast: {
                index: 4,
                texture: 'fast',
                visible: true
            },
            fullscreen: {
                index: 5,
                texture: 'fullscreen',
                visible: true
            },
        },
        balance: {
            top: {
                delta: 0.1,
                style: {},
                left: {
                    x: -0.5,
                    text: 0,
                    fixed: 0,
                    prefix: 'Coins: ',
                },
                right: {
                    x: 0.5,
                    text: 0,
                    fixed: 0,
                    prefix: 'Bet: ',
                }
            },
            bottom: {
                delta: 0.1,
                style: {},
                left: {
                    x: -1,
                    text: 0,
                    fixed: 2,
                    prefix: 'Cash: ',
                    suffix: ' $'
                },
                center: {
                    x: 0,
                    text: 0,
                    fixed: 2,
                    prefix: 'Bet: ',
                    suffix: ' $'
                },
                right: {
                    x: 1,
                    text: 0,
                    fixed: 2,
                    prefix: 'Win: ',
                    suffix: ' $'
                }
            }
        }
    },

    mobile: {
        bg: {
            top: {
                height: 0.05,
                color: 0x000000,
                alpha: 0.4
            },
            bottom: {
                height: 0.05,
                color: 0x000000,
                alpha: 0.6
            }
        },
        time: {
            x: 0.475,
            style: {
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: 16,
                fontWeight: 'lighter',
                fill: ['#ffffff', '#B2B2B2'],
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 8,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 1,
            }
        },
        buttons: {
            position: 'middle',
            amount: 1,
            start: 0.033,
            delta: 0,
            home: {
                index: 0,
                texture: 'home',
                startScale: 1.5,
                finalScale: 1.9,
                visible: true
            },
            settings: {
                index: 1,
                texture: 'settings',
                visible: false
            },
            sound: {
                index: 2,
                texture: 'sound',
                visible: false
            },
            fast: {
                index: 3,
                texture: 'fast',
                visible: false
            },
            info: {
                index: 4,
                texture: 'home',
                visible: false
            },
            fullscreen: {
                index: 5,
                texture: 'fullscreen',
                visible: false
            },
        },
        balance: {
            top: {
                delta: 0.1,
                style: { fontSize: 29 },
                frSum: {
                    x: -0.5,
                    text: 0,
                    fixed: 0,
                    prefix: 'Coins: ',
                },
                sum: {
                    x: -0.5,
                    text: 0,
                    fixed: 0,
                    prefix: 'Coins: ',
                },
                bet: {
                    x: 0.5,
                    text: 0,
                    fixed: 0,
                    prefix: 'Bet: ',
                },
                win: {
                    x: 0.5,
                    text: 0,
                    fixed: 0,
                    prefix: 'Win: ',
                },
                total: {
                    x: -0.5,
                    text: 0,
                    fixed: 0,
                    prefix: 'Total Win: ',
                },
            },
            bottom: {
                delta: 0.1,
                style: { fontSize: 25 },
                frCount: {
                    x: -1,
                    text: 0,
                    fixed: 0,
                    prefix: 'Free Rounds: ',
                    suffix: ''
                },
                sum: {
                    x: -1,
                    text: 0,
                    fixed: 2,
                    prefix: 'Cash: ',
                    suffix: ' $'
                },
                bet: {
                    x: 0,
                    text: 0,
                    fixed: 2,
                    prefix: 'Bet: ',
                    suffix: ' $'
                },
                win: {
                    x: 1,
                    text: 0,
                    fixed: 2,
                    prefix: 'Win: ',
                    suffix: ' $'
                },
                frWin: {
                    x: 1,
                    text: 0,
                    fixed: 2,
                    prefix: 'Total Win: ',
                    suffix: ' $'
                },
            }
        }
    }

}

class BG extends Graphics {

    constructor({
        container,
        x,
        y,
        height,
        color,
        alpha,
        name
    }) {
        super({ container, x, y })

        this.beginFill(color, alpha)
        this.drawRect(0, 0, GAME_WIDTH, height * GAME_HEIGHT)
        this.endFill()
        this.pivot.set(this.width * 0.5, this.height * 0.5)
        this.name = name
    }

}

class Time extends Text {

    constructor({
        container,
        x = 0,
        y = 0,
        style
    }) {
        let currentTime = Time.getTime()
        super({
            container,
            x,
            y,
            text: `${currentTime.hours} : ${currentTime.minutes}`,
            style
        })

        this.name = 'time'

        this.hours = currentTime.hours
        this.minutes = currentTime.minutes

        TweenMax.ticker.addEventListener('tick', this.update.bind(this))
    }

    update() {
        let time = Time.getTime()

        if (this.hours !== time.hours
        || this.minutes !== time.minutes) {

            this.hours = time.hours
            this.minutes = time.minutes

            this.text = `${this.hours} : ${this.minutes}`
        }
    }

    static getTime() {
        let hours   = new Date().getHours()
        let minutes = new Date().getMinutes()

        hours = (hours < 10) ? `0${hours}` : hours
        minutes = (minutes < 10) ? `0${minutes}` : minutes

        return {
            hours,
            minutes
        }
    }

}

class Buttons extends Container {

    constructor({
        container,
        x = 0,
        y = 0,
        config
    }) {
        super({ container, x, y })

        this.config = config
        this.name = 'buttons'
        this.setCoords()

        for (let button in this.config) {
            if (this.config.hasOwnProperty(button) && typeof this.config[button] === 'object') {
                let current = this.config[button]

                this[button] = new ScalingButton({
                    container: this,
                    texture: current.texture,
                    startScale: current.startScale,
                    finalScale: current.finalScale,
                    x: this.coords[current.index],
                    visible: current.visible
                })

            }
        }

    }

    setCoords() {
        this.coords = [this.config.start]
        for (let i = 1; i < this.config.amount; i++)
            this.coords.push(this.coords[i - 1] + this.config.delta)
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

        this.config = config
        this.name = 'balance'        

        for (let part in this.config) {
            if (this.config.hasOwnProperty(part)) {
                let current = this.config[part]

                this.addChild(
                    this[part] = new Container({
                        container: this,
                        x: current.x,
                        y: current.y,
                        name: part
                    })
                )

                for (let item in current) {
                    if (current.hasOwnProperty(item) && typeof current[item] === 'object' && item !== 'style') {
                        let balance = current[item]

                        this[part][item] = new BalanceText({
                            container: this[part],
                            x: current.delta * balance.x,
                            text: balance.text,
                            fixed: balance.fixed,
                            prefix: balance.prefix,
                            suffix: balance.suffix,
                            style: current.style,
                            name: item
                        })

                    }
                }

            }
        }
    }

    // Refactore modes changes

    setCurrency(cur) {
        this.bottom.left.suffix   = ` ${cur}`
        this.bottom.center.suffix = ` ${cur}`
        this.bottom.right.suffix  = ` ${cur}`
    }

    changeModeTo(newMode, tween = true) {
        switch (newMode) {
            case 'fs':
                this.top.visible = true
                this.changeModeToFS(tween)
                break
            case 'mobile':
                this.top.visible = true
                this.changeModeToMobile(tween)
                break
            case 'desktop':
                this.top.visible = false
                this.changeBottomMode()
                break
            default:
        }
    }

    changeTopToMobile() {
        this.top.win.visible = false;
        this.top.total.visible = false;
        this.top.bet.visible = true;
        if (game.state.isFR) {
            this.top.frSum.visible = true;
            this.top.sum.visible = false;
        } else {
            this.top.frSum.visible = false;
            this.top.sum.visible = true;
        }
    }

    changeTopToFS() {
        this.top.win.visible = true;
        this.top.bet.visible = false;
        this.top.sum.visible = false;
        if (game.state.isFR) {
            this.top.total.visible = false;
        } else {
            this.top.total.visible = true;
        }
    }

    changeModeToFS(tween) {
        if (tween) {
            this.timeline = new TimelineLite();
            this.timeline
                .to(this.top, 0.3, {
                    alpha: 0,
                    onComplete: () => {
                        this.changeTopToFS()
                        this.changeBottomMode()
                    }
                })
                .to(this.top, 0.3, {
                    alpha: 1
                });
        } else {
            this.changeTopToFS()
            this.changeBottomMode()
        }
    }

    changeModeToMobile(tween) {
        if (tween) {
            this.timeline = new TimelineLite();
            this.timeline
                .to(this.top, 0.3, {
                    alpha: 0,
                    onComplete: () => {
                        this.changeTopToMobile()
                        this.changeBottomMode()
                    }
                })
                .to(this.top, 0.3, {
                    alpha: 1
                });
        } else {
            this.changeTopToMobile()
            this.changeBottomMode()
        }
    }

    changeBottomMode() {
        if (game.state.isFR) {
            this.bottom.frCount.visible = true
            this.bottom.frWin.visible = true

            this.bottom.sum.visible = false
            this.bottom.win.visible = false
        } else {
            this.bottom.frCount.visible = false
            this.bottom.frWin.visible = false

            this.bottom.sum.visible = true
            this.bottom.win.visible = true
        }
    }

}

class Footer extends Container {

    constructor({
        container,
        x,
        y,
        config
    }) {
        super({ container, x, y })

        this.config = defaultsDeep(config, defaultConfig)[GAME_DEVICE]
        this.name = 'footer'

        // Metrics for y
        this.y = this.y || ( 0.5 - this.config.bg.top.height - this.config.bg.bottom.height) * GAME_HEIGHT
        this.topY = this.config.bg.top.height / 2
        this.bottomY = this.config.bg.top.height + this.config.bg.bottom.height / 2
        this.middleY = (this.topY + this.bottomY) / 2

        // BG
        this.bg = {}
        this.bg.top = new BG(Object.assign({
            container: this,
            y: this.topY,
            name: 'top'
        }, this.config.bg.top))
        this.bg.bottom = new BG(Object.assign({
            container: this,
            y: this.bottomY,
            name: 'bottom'            
        }, this.config.bg.bottom))

        // Time
        this.time = new Time(Object.assign({
            container: this,
            y: this.bottomY
        }, this.config.time))

        // Buttons
        this.buttons = new Buttons({
            container: this,
            x: -0.5,
            y: this[`${this.config.buttons.position}Y`],
            config: this.config.buttons
        })

        // Balance
        this.balance = new Balance({
            container: this,
            y: this[`${this.config.balance.position}Y`],
            config: defaultsDeep({
                top:    { y: this.topY },
                bottom: { y: this.bottomY }
            }, this.config.balance)
        })

    }

}

export { Footer }
