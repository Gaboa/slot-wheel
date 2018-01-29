export class TransitionController{
    
    constructor({
        game,
        config,
        autoEnable = true
    }){
        this.game = game;
        this.transition = this.game.root.transition;
        this.config = config;
        this.autoEnable = autoEnable;

        this.data  = game.data
        this.state = game.state
        this.subs = []
        
        if(this.autoEnable){
            this.enable()
        }
    }

    enable(){
        this.subs.push(
            this.transitionSub = this.transition.$
                .subscribe( n => {
                    console.log(n)
                }),

            this.transitionBtnSub = this.transition.$
                .filter(n => n.type === 'CONTINUE_CLICKED')
                .subscribe(n => {
                    this.state.isTransition = false
                    this.data.mode = this.data.next
                    this.transition.remove()
                })
        )  
    }


    draw(){
        let state = {
            count: 15, //free spins
            multi: 4,
            level: 4, //after fs ends
            //win: 10000, // after fs ends
            maxMulti: 10,
            maxCount: 20,
            map:{
                3: 'cheese',
                4: 'coffee',
                5: 'carrot'
            }
        }
        this.transition.render({
            mode: 'root', 
            next: 'fs',
            win: state.win, 
            config: {
                fs:{
                    in:{
                        darkness:{},
                        bg:{},
                        count:{
                            general:{
                                text: `X${state.count}` 
                            }
                        },
                        multi:{
                            general:{
                                text: `X${state.multi}` 
                            }
                        },
                        characters:[
                            {
                                animal:{
                                    general:{
                                        texture: state.multi < state.maxMulti ? 'static_cat' : 'static_rabbit'
                                    }
                                }
                            }
                        ]
                    },
                    out:{
                        darkness:{},
                        emitter:{
                            general:{
                                textures:[state.map[state.multi]]
                            }
                        },
                        topTitle:{
                            general:{
                                texture: state.multi === state.maxMulti ? 'big_win' : 'total_win'
                            }
                        },
                    }
                }
            }
        })
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe()) 
    }

}