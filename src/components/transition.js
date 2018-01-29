import defaultsDeep from 'lodash.defaultsdeep'
import { Container, Sprite, Light, Darkness, JumpingButton, BitmapText, Emitter, Spine } from '../utils'
import { Subject } from 'rxjs'
import { TweenMax } from 'gsap';


const defaultConfig = {
    fs:{
        in: {
            darkness: {
                active: true,
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
                    y: -0,
                }
                                      
            },
            emitter: {
                active: false,
                Constructor: Emitter,
                general:{
                    name: 'emitter',
                    textures: ['cheese'],
                    data: {
                        scale:
                            {start: 1, end:1, minimumScaleMultiplier:0.5},
                        color:
                            {start:'ffffff',end:'ffffff'},
                        speed:
                            {start:200, end:250},
                        startRotation:
                            {min:80,max:100},
                        rotationSpeed:
                            {min:-200,max:200},
                        lifetime:
                            {min:5.5,max:6},
                        blendMode:'normal',           
                        frequency: 0.08,
                        maxParticles: 100,
                        pos:
                            {x:0,y:0},
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
            bg:{
                active: true,
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
            light: {
                active: false,
                Constructor: Light,
                general:{
                    texture: 'preload_light',
                    name: 'light',
                    alpha: 0.4,
                },
                desktop: {
                    x: 0,
                    y: -0.1,
                },
                mobile: {
                    x: 0,
                    y: -0.1,
                }
                               
            },
            characters:[
                {
                    animal:{
                        active: true,
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
                    }
                }
            ],
            topTitle: {
                active: true,
                Constructor: Sprite,
                general:{
                    texture: 'bonus_game',
                    name: 'topTitle',
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
            bottomTitle: {
                active: false,
                Constructor: Sprite,
                general:{
                    texture: 'big_win',
                    name: 'bottomTitle',
                },
                desktop: {
                    x: 0,
                    y: 0.087,
                },
                mobile: {
                    x: 0,
                    y: 0.087,
                }
            },
            button:{
                active: true,
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
                active: true,
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
                active: true,
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
                }
            },
            
        },
        out: {
            darkness: {
                active: true,
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
                    y: -0.1,
                }
                                      
            },
            emitter: {
                active: true,
                Constructor: Emitter,
                general:{
                    name: 'emitter',
                    textures: ['cheese'],
                    data: {
                        scale:
                            {start: 1, end:1, minimumScaleMultiplier:0.5},
                        color:
                            {start:'ffffff',end:'ffffff'},
                        speed:
                            {start:200, end:250},
                        startRotation:
                            {min:80,max:100},
                        rotationSpeed:
                            {min:-200,max:200},
                        lifetime:
                            {min:5.5,max:6},
                        blendMode:'normal',           
                        frequency: 0.08,
                        maxParticles: 100,
                        pos:
                            {x:0,y:0},
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
            bg:{
                active: false,
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
                    x: 0.289,
                    y: -0.113
                
                }
            },
            light: {
                active: false,
                Constructor: Light,
                general:{
                    texture: 'preload_light',
                    name: 'light',
                    alpha: 0.4,
                },
                desktop: {
                    x: 0,
                    y: -0.1,
                },
                mobile: {
                    x: 0,
                    y: -0.1,
                }
                               
            },
            characters:[
                {
                    animal:{
                        active: true,
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
                    }
                }
            ],
            topTitle: {
                active: true,
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
            bottomTitle: {
                active: false,
                Constructor: Sprite,
                general:{
                    texture: 'big_win',
                    name: 'bottomTitle',
                },
                desktop: {
                    x: 0,
                    y: 0.087,
                },
                mobile: {
                    x: 0,
                    y: 0.087,
                }
            },
            button:{
                active: true,
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
                active: true,
                Constructor: BitmapText,
                general:{
                    fontName: 'Transition',
                    fontSize: 100,
                    name: 'count',
                    scale: 1,
                    tweenTime: 0.5,
                    text: '0'
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

        
        this.timeline = new TimelineMax()
        this.$ = new Subject()
        this.config = defaultsDeep(config, defaultConfig)
        this.map = {
            multi : []
        }

    }

    // mode, amount, next will be taken from data arg
    render(data){
        let { mode, next, config} = data
        console.log(config)
        let conf;

        if(mode === 'root' && next !== 'root'){
            conf = defaultsDeep(config[next].in, this.config[next].in) 
        }
        if(mode !== 'root' && next === 'root'){
            conf = defaultsDeep(config[mode].out, this.config[mode].out) 
            //conf = this.config[next].out
        }

        for(let item in conf){
            this.addView(conf[item])
        }
        
        this.turnOnStreams()

        this.startTweens(conf, data.win)

    }

    turnOnStreams(){
        this.$.next({ type: 'CREATED' })
        if(this.button){
            this.button.$.subscribe(next => {
                this.$.next({type: 'CONTINUE_CLICKED', val: next})
            })
        }
    }

    addView(item){
        if(Array.isArray(item)){
            item.forEach(child => {
                for(let item in child){
                    this.addView(child[item])
                }
            })
        }
        if(item.active){
            this.addSingleItem(item)
        }
    }

    addSingleItem(item){
        this[item.general.name] = new item.Constructor(Object.assign( 
            {container: this}, 
            item.general, 
            item[GAME_DEVICE]) );
        return this[item.general.name]
    }

    startTweens(conf, win){
        for(let item in conf){
            if(conf[item].active){
                if(Array.isArray(conf[item])){
                    conf[item].forEach(child => {
                        for(let item in child){
                            this.addSingleTween(child[item])
                        }
                    })
                } else {
                    this.addSingleTween(conf[item])
                }
            }
            
        }
        this.additionalTweens(win)
    }

    additionalTweens(win = 0){
        if(win){
            this.timeline.addCallback(this.tweenCounter, '+=0.2' , [win+''], this)
        }
        this.timeline.addCallback( () => { this.$.next({ type: 'SHOWED' })}, '+=0.1' )
    }

    addSingleTween(item){
        if(item.tween){
            this.timeline.add(
                TweenMax.to(this[item.general.name], item.tween.time, item.tween.options)
            )
        }
    }

    tweenCounter(amount){
        this.win.tweenText(amount)
    }

    remove(){
        this.$.next({ type: 'REMOVED' })
        this.removeChildren()
    }
}