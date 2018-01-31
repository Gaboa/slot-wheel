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
            y: -0.042
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
        this.spine.setAnimation({ track: 0, animation: 'open', loop: false })
        this.spine.addAnimation({ track: 0, animation: 'idle_fs', loop: true })
    }

    closeCollector() {
        this.spine.setAnimation({ track: 0, animation: 'close', loop: false })
        this.spine.addAnimation({ track: 0, animation: 'idle', loop: true })
    }

} 

export { Logo }