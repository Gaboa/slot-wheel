import defaultsDeep from 'lodash.defaultsdeep'

import {
    Spine,
    Container
} from '../utils'

import { 
    Collector
} from './collector'

const defaultConfig = {

    views: [
        'collector',
        'spine'
    ],

    collector: {
        Constructor: Collector,
        general: {
            name: 'collector',
            y: -0.042,
            x: 0.007
        },
        mobile:{
            y: -0.0375
        }
    },

    spine: {
        Constructor: Spine,
        general: {
            name: 'logo',
            anim: { track: 0, name: 'idle', repeat: true }
        }
    }

}


class Logo extends Container {

    constructor({
        container,
        x,
        y,
        config
    }){
        super({
            container,
            x,
            y 
        })

        this.config = defaultsDeep(config, defaultConfig)

        this.config.views
            .forEach(view => this.addView(this.config[view]))

    }

    addView(item) {
        this[item.general.name] = new item.Constructor(Object.assign( 
            {container: this}, 
            item.general, 
            item[GAME_DEVICE]))
        return this[item.general.name]
    }

    showCollector() {
        this.logo.state.setAnimation( 0,  'open', false )
        this.logo.state.addAnimation( 0,  'idle_fs', true )
    }

    closeCollector() {
        this.logo.state.setAnimation(0, 'close', false )
        this.logo.state.addAnimation( 0, 'idle', true )
    }

} 

export { Logo }