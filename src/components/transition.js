import defaultsDeep from 'lodash.defaultsdeep'
import { Subject } from 'rxjs'
import { TweenMax } from 'gsap'
import { Container, Sprite, Light, Darkness, JumpingButton, BitmapText, Emitter, Spine } from '../utils'

const defaultConfig = {
    fs:{
        in: {
            views: [
                'darkness',
                'bg',
                'animal',
                'title',
                'count',
                'multi',
                'button'
            ],
            darkness: {
                Constructor: Darkness,
                general:{
                    autoShow: true,
                    autoHide: false,
                },
                desktop: {
                    x: 0,
                    y: 0,
                },
                mobile: {
                    x: 0,
                    y: -0.01,
                }
                                      
            },
            bg: {
                Constructor: Sprite,
                general:{
                    name: 'bg',
                    texture: 'popup',
                    alpha: 1
                },
                desktop: {
                    x: 0,
                    y: 0.046
                },
                mobile: {
                    x: 0,
                    y:0.046
                
                }
            },
            animal: {
                Constructor: Sprite,
                general:{
                    name: 'animal',
                    texture: 'static_owl',
                    alpha: 1,
                    scale: 2
                },
                desktop: {
                    x: 0,
                    y: 0
                },
                mobile: {
                    x: 0,
                    y: -0
                }
            },
            title: {
                Constructor: Sprite,
                general:{
                    texture: 'bonus_game',
                    name: 'title',
                },
                desktop: {
                    x: 0,
                    y: -0.2981,
                },
                mobile: {
                    x: 0,
                    y: -0.2981,
                }              
            },
            button: {
                Constructor: JumpingButton,
                general:{
                    texture: "preload_button",
                    name: 'button',
                    tweenY: 0.4037,
                    startScale: 0.85,
                    endScale: 1.15,
                },
                desktop: {
                    x: 0,
                    y: 0.4,
                },
                mobile: {
                    x: 0,
                    y:0.4,
                }
            },
            count: {
                Constructor: BitmapText,
                general:{
                    fontName: 'Transition',
                    fontSize:45,
                    name: 'count',
                    scale: 1,
                    tweenTime: 0.5,
                    text: '20'
                },
                desktop: {
                    x: -0.1859,
                    y: 0.012,
                   
                },
                mobile: {
                    x: -0.1859,
                    y: 0.012,
                    fontSize:85,
                }
            },
            multi: {
                Constructor: BitmapText,
                general:{
                    fontName: 'Transition',
                    fontSize: 45,
                    name: 'multi',
                    scale: 1,
                    tweenTime: 0.5,
                    text: 'X2'
                },
                desktop: {
                    x: 0.175,
                    y: 0.012,
                },
                mobile: {
                    x: 0.175,
                    y: 0.012,
                    fontSize:85,
                },
                tween: {
                    time: 0.2,
                    options: {
                        alpha: 0.8
                    }
                }
            },
            
        },
        out: {
            views: [
                'darkness',
                'emitter',
                'title',
                'pig',
                'win',
                'button'
            ],
            darkness: {
                Constructor: Darkness,
                general:{
                    autoShow: true,
                    autoHide: false,
                },
                desktop: {
                    x: 0,
                    y: 0,
                },
                mobile: {
                    x: 0,
                    y: -0.01,
                }
                                      
            },
            emitter: {
                Constructor: Emitter,
                general:{
                    name: 'emitter',
                    textures: ['cheese'],
                    data: {
                        scale: { start: 1, end:1, minimumScaleMultiplier:0.5 },
                        color: { start:'ffffff', end:'ffffff' },
                        speed: { start:200, end:250 },
                        startRotation: { min:80, max:100 },
                        rotationSpeed: { min:-200, max:200 },
                        lifetime: { min:5.5, max:6 },
                        blendMode:'normal',           
                        frequency: 0.08,
                        maxParticles: 100,
                        pos: { x:0, y:0 },
                        addAtBack:true,
                        spawnType:'rect',
                    }
                },
                desktop:{
                    x:0,
                    y:0,
                },
                mobile:{
                    x:0,
                    y:0
                }
            },
            pig: {
                Constructor: Spine,
                general:{
                    name: 'pig',
                    anim: {
                        track:0,
                        name:'win2',
                        repeat: true
                    },
                },
                desktop: {
                    x: 0,
                    y: 0
                },
                mobile: {
                    x: 0,
                    y: 0
                }
            },
            title: {
                Constructor: Sprite,
                general:{
                    texture: 'big_win',
                    name: 'topTitle',
                },
                desktop: {
                    x: 0,
                    y: -0.2981,
                },
                mobile: {
                    x: 0,
                    y: -0.197,
                }              
            },
            button:{
                Constructor: JumpingButton,
                general:{
                    texture: "preload_button",
                    name: 'button',
                    tweenY: 0.4037,
                    startScale: 0.85,
                    endScale: 1.15,
                },
                desktop: {
                    x: 0,
                    y: 0.4,
                },
                mobile: {
                    x: 0,
                    y: 0.350,
                }
            },
            win: {
                Constructor: BitmapText,
                general:{
                    fontName: 'Transition',
                    fontSize: 100,
                    name: 'win',
                    scale: 1,
                    tweenTime: 0.5,
                    text: '0',
                    start: 0,
                    end: 0
                },
                desktop: {
                    x: 0,
                    y: 0,
                },
                mobile: {
                    x: 0,
                    y: 0.04861,
                }
            },
            
        },
    }
}

export class Transition extends Container {
    
    constructor({
        container,
        x = 0.5,
        y = 0.5,
        config
    }){
        super({ container, x, y })
        this.config = defaultsDeep(config, defaultConfig)
        
        this.timeline = new TimelineMax()
        this.$ = new Subject()

    }

    render(config, mode = 'fs', state = 'in') {
        
        this.config = defaultsDeep(config, this.config)
        this.part = this.config[mode][state]

        this.part.views
            .forEach(view => this.addView(this.part[view]))
        this.part.views
            .forEach(view => this.addTween(this.part[view]))
        
        this.enable()
    }

    enable() {
        this.$.next({ type: 'CREATED' })
        if (this.button)
            this.button.$.subscribe(next => this.$.next({ type: 'CONTINUE_CLICKED', val: next }))
    }

    addView(item) {
        if (Array.isArray(item)) 
            item.forEach(child => this.addView(child))
        else this.addItem(item)
    }

    addItem(item) {
        this[item.general.name] = new item.Constructor(Object.assign( 
            {container: this}, 
            item.general, 
            item[GAME_DEVICE]))
        return this[item.general.name]
    }

    addTween(item) {
        if (Array.isArray(item)) 
            item.forEach(child => this.addTween(child))
        else this.addSingleTween(item)
    }

    addSingleTween(item) {
        if(item.tween)
            this.timeline.add(TweenMax.to(this[item.general.name], item.tween.time, item.tween.options))
    }

    remove(){
        this.$.next({ type: 'REMOVED' })
        this.removeChildren()
    }
}