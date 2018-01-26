import defaultsDeep from 'lodash.defaultsdeep'
import { TweenMax } from 'gsap'
import { Observable, Subject } from 'rxjs'
import { Container, Sprite, Spine, BalanceText } from "../utils"
import { Screen, Numbers, Lines, Element, Panel } from "./index"

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

const defaultMachineConfig = {
    bg: true,
    lines: true,
    screen: true,
    frame: true,
    logo: true,
    panel: true,
    numbers: true,
    table: true
}

class Machine extends Container {

    constructor({
        container,
        x,
        y,
        config = {}
    }) {
        super(arguments[0])
        this.name = 'machine'
        this.config = defaultsDeep(config, defaultMachineConfig)
        
        // Machine BG
        if (this.config.bg)
        this.bg = new Sprite({
            container: this,
            y: 0.0213,
            texture: 'machine_bg',
            name: 'bg'
        })
        // this.bg = new PIXI.extras.TilingSprite(
        //     PIXI.utils.TextureCache['tile'],
        //     EL_WIDTH  * 5,
        //     EL_HEIGHT * 3
        // )
        // this.bg.anchor.set(0.5)
        // this.bg.name = 'bg'
        // this.addChild(this.bg)

        if (this.config.lines)        
        this.lines = new Lines({
            container: this,
            y: 0.0213,            
            config: { lines: this.config.lines }
        })

        // Screen with elements
        if (this.config.screen)        
        this.screen = new Screen({
            container: this,
            y: 0.0213,
            config: {
                amount: 5,
                dir: 'down',

                lines: this.config.lines,

                el: {
                    Element,
                    width:  EL_WIDTH,
                    height: EL_HEIGHT,
                    symbols: this.config.symbols
                },

                start: {
                    amount: 10,
                    time: 0.8
                },

                loop: {
                    amount: 10,
                    time: 0.45
                },

                end: {
                    amount: 10,
                    time: 1
                },

                roll: {
                    normal: 1,
                    fast: 2.5
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
        if (this.config.frame)        
        this.frame = new Sprite({
            container: this,
            texture: 'frame',
            name: 'frame'
        })

        // Machine Logo
        if (this.config.logo)        
        // this.logo = new Spine({
        //     container: this,
        //     name: 'logo',
        //     anim: { track: 0, name: 'idle', repeat: true },
        //     y: -0.343
        // })

        // Panel with Buttons and Balance
        if (this.config.panel)        
        this.panel = new Panel({
            container: this,
            y: 0.4389,
            config: {
                balance: {
                    style: {
                        fontFamily: 'Oswald, Arial, Helvetica',
                        fill: '#ffec82',
                        fontSize: 36,
                        fontWeight: 600
                    },
                    sum: {
                        x: 0.28
                    },
                    value: {
                        x: 0.177
                    },
                    level: {
                        x: -0.163
                    },
                    lines: {
                        x: -0.234
                    },
                    bet: {
                        x: -0.298
                    }
                },
                buttons: {
                    max: {
                        x: 0.0734,
                        y: -1
                    },
                    auto: {
                        x: -0.0734,
                        y: -1
                    },
                    level: {
                        x: -0.1635,
                        y: 0.015,
                        delta: 0.051,
                        progress: {
                            x: -0.1795,
                            y: 0.033,
                            w: 0.032552
                        }
                    },
                    value: {
                        x: 0.175,
                        y: 0.015,
                        delta: 0.074,
                        progress: {
                            x: 0.1475,
                            y: 0.033,
                            w: 0.0546875
                        }
                    },
                }
            }
        })

        // Win Numbers
        if (this.config.numbers)        
        this.numbers = new Numbers({
            container: this,
            y: 0.0213, 
            config: {
                left: {
                    x: -0.368,
                    pattern: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    positions: [{ x: 0.0229, y: -0.2 }, { x: 0.014, y: -0.1555 }, { x: 0.00677, y: -0.1111 }, { x: 0.002, y: -0.0666 }, { x: 0, y: -0.0222 }, { x: 0, y: 0.0222 }, { x: 0.002, y: 0.0666 }, { x: 0.00677, y: 0.1111 }, { x: 0.014, y: 0.1555 }, { x: 0.0229, y: 0.2 }],
                    size: 35
                },
                right: {
                    x: 0.368,
                    pattern: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                    positions: [{ x: -0.0229, y: -0.2 }, { x: -0.014, y: -0.1555 }, { x: -0.00677, y: -0.1111 }, { x: -0.002, y: -0.0666 }, { x: 0, y: -0.0222 }, { x: 0, y: 0.0222 }, { x: -0.002, y: 0.0666 }, { x: -0.00677, y: 0.1111 }, { x: -0.014, y: 0.1555 }, { x: -0.0229, y: 0.2 }],
                    size: 35
                }
            }
        })

        // Win Table
        if (this.config.table)        
        this.table = new WinTable({
            container: this,
            y: 0.0213
        })

    }

}

export {
    Machine,
    WinTable
}