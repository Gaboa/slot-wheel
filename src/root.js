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
            config: {
                symbols: game.data.symbols,
                lines:   game.data.lines,
                panel:   false
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

class DesktopRoot extends Container {

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
            y: -0.05,
            config: {
                lines:   game.data.lines,
                symbols: game.data.symbols
            }
        })

        this.footer = new Footer({
            container: this
        })
        this.footer.bg.top.visible = false
        this.footer.balance.top.visible = false

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

    remove() {
        this.disable()
        this.destroy()
    }

}



export { DesktopRoot, MobileRoot }