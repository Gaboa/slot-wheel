import defaultsDeep from 'lodash.defaultsdeep'
import { Container, Sprite, Light, Darkness, JumpingButton } from '../utils'
import { Subject } from 'rxjs'

export class BitmapText extends PIXI.Container {
    constructor({
        container,
        x = 0,
        y = 0,
        text,
        scale = 1,
        tweenTime = 0.5,
        font = 'bitmap'
    }) {
        super();
        this.container = container;
        this.x = x;
        this.y = y;
        this.textScale = scale;
        this.text = text;
        this.font = font;
        this.tweenTime = tweenTime;

        this.writeText(this.text);

        this.container.addChild(this);
    }
    writeText(text) {
        this.removeChildren();
        this.textArray = String(text).split('');
        this.textArray.forEach(char => {
            let sprite = new Sprite({
                container: this,
                texture: `${this.font}_${char}`,
                x: this.width,
                anchor: 0
            });
            sprite.scale.x = this.textScale;
            sprite.scale.y = this.textScale;
        });
        this.pivot.x = this.width * 0.5;
        this.pivot.y = this.height * 0.5;
    }
    tweenText(newText) {
        this.text = parseInt(this.text, 10);
        this.tween = TweenMax.to(this, this.tweenTime, {
            text: newText,
            roundProps: 'text',
            onUpdate: () => this.writeText(this.text),
            callbackScope: this
        });
    }
}

const defaultConfig = {
    fs:{
        in: {
            bg:{
                active: true,
                Constructor: Sprite,
                general:{
                    name: 'bg',
                    texture: 'bg',
                    scale: 2.2,
                    true: 0,
                    alpha: 0
                },
                desktop: {
                    x: 0,
                    y: 0
                },
                mobile: {
                    x: 0,
                    y: 0
                },
                tween:{
                    time: 0.5,
                    options: {
                        alpha: 1
                    }
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
            darkness: {
                active: false,
                Constructor: Darkness,
                general:{
                    autoShow: false,
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
            topTitle: {
                active: true,
                Constructor: Sprite,
                general:{
                    texture: 'you_win',
                    name: 'topTitle',
                },
                desktop: {
                    x: 0,
                    y: -0.197,
                },
                mobile: {
                    x: 0,
                    y: -0.197,
                }              
            },
            bottomTitle: {
                active: true,
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
                    texture: 'continue',
                    name: 'button',
                    tweenY: 0.35,
                    startScale: 0.85,
                    endScale: 1.15,
                },
                desktop: {
                    x: 0,
                    y: 0.350,
                },
                mobile: {
                    x: 0,
                    y: 0.350,
                }
            },
            count: {
                active: true,
                Constructor: BitmapText,
                general:{
                    font: 'ts',
                    name: 'count',
                    scale: 1,
                    tweenTime: 0.5,
                    text: 0
                },
                desktop: {
                    x: 0,
                    y: -0.05555 * 1080,
                },
                mobile: {
                    x: 0,
                    y: -0.1,
                }
            },
            characters:[
                {
                    krampus: {
                        active: true,
                        Constructor: Sprite,
                        general:{
                            name: 'krampus',
                            texture: 'gifted_krampus',
                            alpha: 0
                        },
                        desktop: {
                            x: 0.289,
                            y: -0.113
                        },
                        mobile: {
                            x: 0.289,
                            y: -0.113
                        },
                        tween:{
                            time: 0.2,
                            options: {
                                alpha: 1,
                                onStart:() => {
                                    
                                }
                            }
                        }
                    }
                },
                {
                    tree: {
                        active: true,
                        Constructor: Sprite,
                        general:{
                            name: 'tree',
                            texture: 'half-naked_tree',
                        },
                        desktop: {
                            x: -0.288,
                            y: -0.113
                        },
                        mobile: {
                            x: -0.288,
                            y: -0.113
                        }
                    }    
                }
            ]
        },
        out:{
            bg:{
                active: true,
                Constructor: Sprite,
                general:{
                    name: 'bg',
                    texture: 'bg',
                    scale: 2.2,
                    true: 0,
                    alpha: 0
                },
                desktop: {
                    x: 0,
                    y: 0
                },
                mobile: {
                    x: 0,
                    y: 0
                },
                tween:{
                    time: 2,
                    options: {
                        alpha: 1
                    }
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
            darkness: {
                active: false,
                Constructor: Darkness,
                general:{
                    autoShow: false,
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
            topTitle: {
                active: true,
                Constructor: Sprite,
                general:{
                    texture: 'you_won',
                    name: 'topTitle',
                },
                desktop: {
                    x: 0,
                    y: -0.197,
                },
                mobile: {
                    x: 0,
                    y: -0.197,
                }              
            },
            bottomTitle: {
                active: true,
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
                    texture: 'continue',
                    name: 'button',
                    tweenY: 0.35,
                    startScale: 0.85,
                    endScale: 1.15,
                },
                desktop: {
                    x: 0,
                    y: 0.350,
                },
                mobile: {
                    x: 0,
                    y: 0.350,
                }
            },
            count: {
                active: true,
                Constructor: BitmapText,
                general:{
                    font: 'ts',
                    name: 'count',
                    scale: 1,
                    tweenTime: 0.5,
                    text: 0
                },
                desktop: {
                    x: 0,
                    y: -0.05555 * 1080,
                },
                mobile: {
                    x: 0,
                    y: -0.1,
                }
            },
            characters:[
                {
                    krampus: {
                        active: true,
                        Constructor: Sprite,
                        general:{
                            name: 'krampus',
                            texture: 'gifted_krampus',
                            alpha: 0
                        },
                        desktop: {
                            x: 0.289,
                            y: -0.113
                        },
                        mobile: {
                            x: 0.289,
                            y: -0.113
                        },
                        tween:{
                            time: 0.2,
                            options: {
                                alpha: 1,
                                onStart:() => {
                                    console.log(1)
                                }
                            }
                        }
                    }
                },
                {
                    tree: {
                        active: true,
                        Constructor: Sprite,
                        general:{
                            name: 'tree',
                            texture: 'half-naked_tree',
                        },
                        desktop: {
                            x: -0.288,
                            y: -0.113
                        },
                        mobile: {
                            x: -0.288,
                            y: -0.113
                        }
                    }    
                }
            ]
        }
    }
}

export class Transition extends Container{
    constructor({
        container,
        x = 0.5,
        y = 0.5,
        config
    }){
        super({ container, x, y })

        this.timeline = new TimelineMax()
        this.$ = new Subject()
        this.config = defaultsDeep(defaultConfig, config)

    }



    // mode, amount, next will be taken from data arg
    render(data){
        
        let { mode, next, count } = {mode: 'root', next: 'fs', count: 20}
        let conf;

        if(mode === 'root' && next !== 'root'){
            conf = this.config[next].in
        }
        if(mode !== 'root' && next === 'root'){
            conf = this.config[next].out
        }

        for(let item in conf){
            this.addView(conf[item])
        }
        
        this.turnOnStreams()

        this.startTweens(conf, count)

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

    startTweens(conf, amount){
        for(let item in conf){
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
        this.timeline.add(() => this.tweenCounter(amount))
        this.timeline.add(() => { this.$.next({ type: 'SHOWED' })})
    }

    tweenCounter(amount){
        this.count.tweenText(amount)
    }

    addSingleTween(item){
        if(item.tween){
            this.timeline.add(
                TweenMax.to(this[item.general.name], item.tween.time, item.tween.options)
            )
        }
    }

    remove(){
        this.$.next({ type: 'REMOVED' })
        this.removeChildren()
    }
}