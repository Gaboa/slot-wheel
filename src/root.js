import defaultsDeep from 'lodash.defaultsdeep'
import { Subject, Observable } from 'rxjs'
import {

    Container,
    Sprite,
    Darkness,

    Machine,
    Footer,
    MobileButtons,
    MobileMenu,
    Info,
    Settings,

    BalanceController,
    FooterBalanceController,
    DesktopBalanceController,
    FooterButtonsController,
    PanelButtonsController,
    MachineController,
    MobileButtonsController,
    MobileMenuController,
    RootController,
    WinController,
    AutoplayController,

    FRDesktopBalanceController,
    FRFooterBalanceController,
    MobileFRRootController,
    DesktopFRRootController
} from '../COREv3'

// TODO: Create balance bindings for different modes ( FS FR Bonus )
// TODO: Check index switching bug in Screen

class MobileRoot extends Container {

    constructor({
        game,
        config
    }) {
        super({ container: game.stage, x: 0.5, y: 0.5 })

        this.game  = game
        this.data  = game.data
        this.state = game.state

        this.bg = new Sprite({
            container: this,
            texture: 'preload_bg',
            name: 'bg'
        })

        this.machine = new Machine({
            container: this,
            x: -0.1,
            y: -0.01,
            scale: 1.07,
			views: ['bg', 'lines', 'screen', 'frame', 'logo', 'numbers', 'table'],
			lines: {
				data: game.data.lines
			},
			screen: {
				config: {
					el: {
						symbols: game.data.symbols,
                        width: EL_WIDTH,
                        height: EL_HEIGHT
					}
				}
			}
        })

        this.buttons = new MobileButtons({
            container: this,
            x: 0.375,
            y: -0.02
        })

        this.footer = new Footer({
            container: this
        })

        this.menu = new MobileMenu({
            container: this
        })

        this.darkness = new Darkness({
            container: this,
            autoHide:  true
        })

        document.querySelectorAll('.darkness__hidden').forEach(el => el.remove())
        this.info = new Info({})
        this.settings = new Settings({})

        this.game.audio.play('main')

        setTimeout(() => this.enable(), 0)
        // setTimeout(() => this.enableFR(), 0)
    }

    enable() {
        // Balance
        this.balanceCtrl     = new BalanceController({ game: this.game })
        this.balanceRootCtrl = new FooterBalanceController({ game: this.game })
        // Buttons
        this.footerCtrl  = new FooterButtonsController({ game: this.game, config: {
            fullscreen: false,
            settings:   false,
            sound: false,
            info:  false,
            fast:  false,
        }})
        this.buttonsCtrl = new MobileButtonsController({ game: this.game })
        this.menuCtrl    = new MobileMenuController({ game: this.game })
        // Logic
        this.machineCtrl = new MachineController({ game: this.game, config: {
            lines: {
                show: false,
                hide: false
            }
        }})        
        this.ctrl = new RootController({ game: this.game, config: {
            idle: {
                footer: {
                    enable: false,
                    disable: false
                }
            }
        }})
        this.winCtrl  = new WinController({ game: this.game })
        this.autoCtrl = new AutoplayController({ game: this.game })
    }

    enableFR() {
        this.balanceCtrl     = new BalanceController({ game: this.game })
        this.balanceRootCtrl = new FRFooterBalanceController({ game: this.game })
        this.footerCtrl  = new FooterButtonsController({ game: this.game, config: {
            fullscreen: false,
            settings:   false,
            sound: false,
            info:  false,
            fast:  false,
        }})
        this.buttonsCtrl = new MobileButtonsController({ game: this.game })
        this.menuCtrl    = new MobileMenuController({ game: this.game })
        // Logic
        this.machineCtrl = new MachineController({ game: this.game, config: {
            screen: {
                start: {
                    balance: false
                }
            },
            lines: {
                show: false,
                hide: false
            }
        }})

        this.ctrl = new MobileFRRootController({ game: this.game,
            config: {
                idle: {
                    buttons: {
                        enable: false
                    },
                    footer: {
                        enable: false,
                        disable: false
                    }
                }
            }
        })

        this.winCtrl  = new WinController({ game: this.game })
        this.autoCtrl = new AutoplayController({ game: this.game })
    }

    disable() {
        this.balanceCtrl.disable()
        this.balanceRootCtrl.disable()
        this.footerCtrl.disable()
        this.buttonsCtrl.disable()
        this.machineCtrl.disable()        
        this.ctrl.disable()
        this.winCtrl.disable()
        this.autoCtrl.disable()
    }

    remove() {
        this.disable()
        this.destroy()
    }

}

/**
 * Создает новый рут для десктопа
 * @constructor
 */
class DesktopRoot extends Container {

    constructor({
        game,
        config
    }) {
        super({ container: game.stage, x: 0.5, y: 0.5 })
		// super()
		// game.stage.addChild(this)
		// this.x = 1920 * 0.5
		// this.y = 1080 * 0.5

		var squareFar = new PIXI.Sprite(PIXI.Texture.WHITE);
		squareFar.tint = 0xff0000;
		squareFar.factor = 0.5;
		squareFar.anchor.set(0.5);
		squareFar.position.set(GAME_WIDTH / 2, -400);
		game.stage.addChild(squareFar)
		this.sqr = squareFar

        this.game  = game
        this.data  = game.data
        this.state = game.state

        this.bg = new Sprite({
            container: this,
            texture: 'preload_bg',
            name: 'bg'
        })

		// this.proj = new PIXI.projection.Container2d();
        // this.proj.x = 1920 * 0.5
        // this.proj.y = 1080 * 0.5
        // this.addChild(this.proj)

        this.machine = new Machine({
            container: this,
            y: -0.05,
            lines: {
                data: game.data.lines
            },
            screen: {
                config: {
                	lines: game.data.lines,
                    el: {
                        symbols: game.data.symbols,
						width: EL_WIDTH,
						height: EL_HEIGHT
                    }
                }
            }
        })

		// TweenMax.ticker.addEventListener('tick', () => {
		// 	this.machine.screen.elements.forEach((c, index) => {
		// 		let container = c
		//
		// 		let sqr = this.sqr
		//
		// 		container.proj.clear();
		// 		container.updateTransform();
		//
		// 		let pos = container.toLocal(sqr.position);
		// 		pos.y = -pos.y;
		// 		pos.x = -pos.x;
		//
		// 		if(c.nocon) {
		//
		// 		} else {
		// 			container.proj.setAxisY(pos, -sqr.factor);
		// 		}
		//
		// 	})
		//
		// })

		// this.interactive = true
		// this.addListener("pointermove", (e) => {
		// 	let sqr = this.sqr
		// 	sqr.x = e.data.global.x
		// })

		// this.addFans()

        this.footer = new Footer({
            container: this
        })

        this.darkness = new Darkness({
            container: this,
            autoHide:  true
        })

        document.querySelectorAll('.darkness__hidden').forEach(el => el.remove())
        this.info = new Info({})
        this.settings = new Settings({})

        // this.game.audio.play('main')

        setTimeout(() => this.enable(), 0)
        // setTimeout(() => this.enableFR(), 0)
    }

    /** Добавляет фанатов*/
    addFans() {
    	this.fan1 = new Sprite({
			container: this,
			texture: 'fans',
			scale: 0.8
		})

		this.fan2 = new Sprite({
			container: this,
			texture: 'fans',
			y: 100,
			scale: 0.9
		})

		this.fan3 = new Sprite({
			container: this,
			texture: 'fans',
			y: 200
		})

		let items = [this.fan1, this.fan2, this.fan3]

		TweenMax.ticker.addEventListener('tick', () => {
			items.forEach(c => {
				let sqr = this.sqr

				c.proj.clear();
				c.updateTransform();

				let pos = c.toLocal(sqr.position);
				pos.y = -pos.y;
				pos.x = -pos.x;

				if(c.nocon) {

				} else {
					c.proj.setAxisY(pos, -sqr.factor);
				}
			})
		})
	}

	/** Прчет фанатов*/
	hideFans() {
		TweenMax.to(this.fan1.scale, 2, {y: 0.2, x: 1})
		TweenMax.to(this.fan2.scale, 2, {y: 0.2, x: 1})
		TweenMax.to(this.fan3.scale, 2, {y: 0.2, x: 1})
	}

	/** Показывает фанатов*/
	showFans() {
		TweenMax.to(this.fan1.scale, 2, {y: 0.8, x: 0.8})
		TweenMax.to(this.fan2.scale, 2, {y: 0.9, x: 0.9})
		TweenMax.to(this.fan3.scale, 2, {y: 1, x: 1})
	}

	/** Активирует основные контроллера*/
    enable() {
        // Balance
        this.commonBalanceCtrl  = new BalanceController({ game: this.game })
        this.desktopBalanceCtrl = new DesktopBalanceController({ game: this.game })
        this.footerBalanceCtrl  = new FooterBalanceController({ game: this.game, 
            config: {coin: { bet: false, sum: { idle: false, end: false }}
        }})
        // Buttons
        this.footerCtrl = new FooterButtonsController({ game: this.game })
        this.panelCtrl  = new PanelButtonsController({ game: this.game })
        // Logic
        this.machineCtrl = new MachineController({ game: this.game })
        this.ctrl = new RootController({ game: this.game })
        this.winCtrl = new WinController({ game: this.game })
        this.autoCtrl = new AutoplayController({ game: this.game })
    }

	/** Активирует контроллера для фрираундов*/
    enableFR () {
        // Balance
        this.commonBalanceCtrl  = new BalanceController({ game: this.game })
        this.desktopBalanceCtrl = new FRDesktopBalanceController({ game: this.game })
        this.footerBalanceCtrl  = new FRFooterBalanceController({ game: this.game,
            config: {coin: { bet: false, sum: { idle: false, end: false }},
            frConfig: { win: { coin: false } }
        }})
        // Buttons
        this.footerCtrl = new FooterButtonsController({ game: this.game })
        this.panelCtrl  = new PanelButtonsController({ game: this.game,
            config: {
                level: {
                    min: false,
                    max: false,
                    plus: false,
                    minus: false
                },
                value: {
                    min: false,
                    max: false,
                    plus: false,
                    minus: false
                },
                max: false
            }})
        // Logic
        this.machineCtrl = new MachineController({ game: this.game, config: { screen: { start: { balance: false }}} })
        this.ctrl = new DesktopFRRootController({ game: this.game, config: {idle: {buttons: {enable: false}}} })
        this.winCtrl = new WinController({ game: this.game })
        this.autoCtrl = new AutoplayController({ game: this.game })
    }

	/**
	 * Деактивирует все контроллера
	 * @access package-private
	 * */
    disable() {
        this.commonBalanceCtrl.disable()
        this.desktopBalanceCtrl.disable()
        this.footerBalanceCtrl.disable()
        this.footerCtrl.disable()
        this.panelCtrl.disable()
        this.machineCtrl.disable()
        this.ctrl.disable()
        this.winCtrl.disable()
        this.autoCtrl.disable()
    }

	/** Удаляет уровень*/
    remove() {
        this.disable()
        this.destroy()
    }

}



export { DesktopRoot, MobileRoot }