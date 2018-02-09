import defaultsDeep from 'lodash.defaultsdeep'
import { WinController } from './win'

export class FSWinController extends WinController{
    constructor({
        game,
        config
    }){
        super({
            game,
            config
        })
    }

    enable(){
        super.enable()
        if(this.config.animal)  
        this.subs.push(
        this.animalAnimSub = this.data.win.lines$
        .filter(e => e)
        .filter(e => this.state.mode !== 'root')
        .sample(this.state.isRolling$.filter(e => !e))
        .filter(e => e.some(line => line.number === -1))
        .subscribe(lines => 
            this.game.root.fs.animal.state.setAnimation(0, 'win', false)
        ))
    }

} 
