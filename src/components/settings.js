import { Subject } from 'rxjs'
import Vue from 'vue' 
import Settings from './vue-components/Settings'

export default class SettingsController {

    constructor({
    }) {
        this.$ = new Subject()
        this.visible = false

        this.keys = [
            'mode_changed', 'sound_changed', 
            'music_changed', 'effects_changed',
            'speed_changed', 'bonusStopsAutoPlay_changed', 
            'stopIfCashLess_changed', 'stopIfCashGreater_changed'
        ]

        const self = this

        this.vm = new Vue({
            el: '#settings',
            data () {
                return {
                    visible: self.visible,
                    volume: 50,
                    isMusic: true,
                    isEffects: false,
                    isFast: false,
                    activeMode: 'fullhd',
                    bonusStopsAutoPlay: true,
                    stopIfCashLess: true,
                    stopIfCashGreater: true
                }
            },

            mounted(){
                self.keys.forEach(key => {
                    this.$on(`${key}`, obj => {
                        this[obj.key] = obj.val
                        console.log(obj)
                        self.$.next(obj)
                    })
                })
            },

            render(h){
                return h (Settings, {
                    props: {
                        visible: this.visible,
                        volume: this.volume,
                        isMusic: this.isMusic,
                        isEffects: this.isEffects,
                        isFast: this.isFast,
                        activeMode: this.activeMode,
                        bonusStopsAutoPlay: this.bonusStopsAutoPlay,
                        stopIfCashLess: this.stopIfCashLess,
                        stopIfCashGreater: this.stopIfCashGreater
                    }
                })
            }
        })
    }

    open() {
        this.vm.visible = true
    }
    
    close() {
        this.vm.visible = false
    }

}
