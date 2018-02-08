import defaultsDeep from 'lodash.defaultsdeep';
import { TweenMax } from 'gsap';
import { Subject } from 'rxjs';

const defaultConfigMod = {
    name: 'pig', 
    coordsMap:{
        0: {x: -0.072, y: -0.4166},
        1: {x: -0.0364, y: -0.4166},
        2: {x: 0, y: -0.4166},
        3: {x: 0.0364, y: -0.4166},
        4: {x: 0.072, y: -0.4166},
    },
}

export class ElModifier{
    constructor(config){
        this.config = defaultsDeep(config, defaultConfigMod)
        this.index = 0
        this.wm = new WeakMap()
    }

    start(elements, lv){
        elements.forEach(el => {
            this.saveOldCoordsAndParent(el)
            this.updateCoordsAndParent(el)
            this.changeSkin(el[this.config.name], this.config.skin)
            this.flyTo(el, lv)
        })
    }

    saveOldCoordsAndParent(el){
        let oldData = {}
        oldData.x =  el.position.x
        oldData.y =  el.position.y
        oldData.parent = el.parent
        this.wm.set(el, oldData)
    }

    updateCoordsAndParent(el){
        let newPos = this.config.machine.toLocal(this.config.machine.position, el)
        el.setParent(this.config.machine)
        el.x = newPos.x - this.config.machine.x
        el.y = newPos.y - this.config.machine.y 
    }

    changeSkin(el, skin){
        el.skeleton.setSkinByName(`${skin}`);
        el.skeleton.setSlotsToSetupPose();
    }

    flyTo(el, lv){
        this.updatedOldCoords = {}
        this.updatedOldCoords.x = el[this.config.name].position.x
        this.updatedOldCoords.y = el[this.config.name].position.y

        TweenMax.to(el[this.config.name], 0.5, {
            x: this.config.coordsMap[this.index].x * GAME_WIDTH - el.x,
            y: this.config.coordsMap[this.index].y * GAME_HEIGHT - el.y,
            onComplete: () => {
                this.config.stream.next({type: 'START_LEVEL'})
                this.changeSkin(el[this.config.name], 0)
                this.flyBack(el)
                if(this.index === 4){
                    this.index = 0
                } else {
                    this.index++
                }
            }
        })
    }

    restoreOldCoords(el){
        el.setParent(this.wm.get(el).parent)
        el.x = this.wm.get(el).x
        el.y = this.wm.get(el).y
    }

    flyBack(el){
        TweenMax.to(el[this.config.name], 0.5, {
            x: this.updatedOldCoords.x,
            y: this.updatedOldCoords.y,
            onComplete: () => {
                this.restoreOldCoords(el)
                this.wm.delete(el)
            }
        })
    }
}

const defaultConfig = {
    level: true,
    win: true,
    skins:{
        empty : 0,
        carrot: 1,
        coffee: 2,
        money : 3,
        cheese: 4
    },
    map:{
        2: 1,
        3: 4,
        4: 2,
        5: 3,
    },
    anim: {type: 'spine', el: '11'},
    startLevel: true
}

export class FSCollectorController{
    constructor({ 
        game, 
        config, 
        autoEnable = true
    }){
        this.game = game
        this.state = this.game.state
        this.data = this.game.data
        this.$ = new Subject()

        this.config = defaultsDeep(config, defaultConfig)
        this.elsMod = new ElModifier({
            machine: this.game.root.machine, 
            skin: this.config.map[this.game.data.fs.multi],
            //collector: this.game.root.machine.logo.collector,
            stream: this.$
        }) 

        if(autoEnable) this.enable()
    }

    enable(){
        this.subs = []

        if(this.config.level)
        this.subs.push(
            this.levelSub = this.data.fs.level.current$
            .sample(this.state.isRolling$.filter(e => !e))
            .subscribe( e => {
                if(e === this.current) return
                else this.current = e
                this.els = this.game.root.machine.screen.getElementsWithAnim(this.config.anim)
                this.elsMod.start(this.els, e) 
            })
        )

        if(this.config.win)
        this.subs.push(
            this.showWinSub = this.game.root.machine.logo.collector.$
            .filter(e => e.type === 'SHOW_WIN_STARTS')
            .subscribe(e => {
                this.game.root.machine.logo.collector.win.show(this.data.fs.bonus.coin)
                this.game.root.machine.logo.collector.win.tl.eventCallback('onComplete', this.game.root.machine.logo.collector.$.next({type: 'SHOW_WIN_ENDS'}), [])
            })
        )

        if(this.config.startLevel)
        this.subs.push(
            this.startLevSub = this.$
            .filter(e => e.type === 'START_LEVEL')
            .subscribe(e => {
                this.game.root.machine.logo.collector.level(this.data.fs.level.current)
            })

        )
    }

    disable(){
        this.subs.forEach(sub => sub.unsubscribe())
    }
}

