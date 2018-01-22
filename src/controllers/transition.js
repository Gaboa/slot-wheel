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
        this.transition.render(this.data)
    }

    disable() {
        this.subs.forEach(s => s.unsubscribe()) 
    }

}