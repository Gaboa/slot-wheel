import defaultsDeep from 'lodash.defaultsdeep'
import { Preload, DesktopRoot, MobileRoot } from '../levels'
import { preload, common, desktop, mobile } from '../utils'

const defaultGameConfig = {
    init: true,
    roll: true,
    leave: true,
    preload: {
        level: true,
        logic: true
    },
    constructors: {
        Preload,
        DesktopRoot,
        MobileRoot
    },
    load: {
        preload,
        common,
        desktop,
        mobile
    }
}

class GameController {
    
    constructor({
        game,
        config,
        autoEnable = true
    }) {
        this.game = game
        this.config = defaultsDeep(config, defaultGameConfig)

        if (autoEnable)
            this.enable()
    }

    enable() {
        this.subs = []

        if (this.config.init)
        this.subs.push(
        this.parseInitSub = this.game.request.$
            .filter(e => e.type === 'INIT')
            .subscribe(res => game.parser.init(res.data)))

        if (this.config.roll)
        this.subs.push(
        this.parseRollSub = this.game.request.$
            .filter(e => e.type === 'ROLL')
            .subscribe(res => game.parser.roll(res.data)))

        if (this.config.leave)
        this.subs.push(
        this.leaveSub = this.game.device.$
            .filter(e => e.type === 'LEAVE')
            .subscribe(res => game.request.sendLogout()))
        
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe())
    }

    preload() {

        if (this.config.preload.level)
        this.game.preload = new this.config.constructors.Preload({
            game: this.game,
            base: `img/${GAME_RES}`,
            config: this.config.load
        })

        if (this.config.preload.logic)
        this.game.preload.$
            .filter(e => e === 'REMOVED').take(1)
            .subscribe(e => GAME_DEVICE === 'mobile'
                ? this.game.root = new this.config.constructors.MobileRoot({ game: this.game })
                : this.game.root = new this.config.constructors.DesktopRoot({ game: this.game }))

    }

    changeMode({
        res,
        device
    }) {

        // Clear old session
        this.game.root.remove()
        this.game.loader.reset()
        PIXI.utils.clearTextureCache()

        // Params res and device
        this.game.device.isMobile = () => device === 'mobile' ? true : false
        this.game.device.config[device] = res

        // Change Global Params
        this.game.device.setGlobalParams()
        this.game.renderer.resize(GAME_WIDTH, GAME_HEIGHT)
        this.game.view.width = GAME_WIDTH
        this.game.view.height = GAME_HEIGHT
        this.game.device.setAspectMode()

        // New preload level
        this.preload()

    }

}
export { GameController }