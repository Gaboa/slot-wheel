import defaultsDeep from 'lodash.defaultsdeep'
import { BehaviorSubject } from 'rxjs'

// TODO: Add method for entering fullscreen on iOS
// TODO: Add scale mode for HD desktop version for more fullscreen variant

const defaultConfig = {
    fullhd: {
        width:  1920,
        height: 1080,
        fix: 1,
        el: {
            width:  256,
            height: 240
        }
    },
    hd: {
        width:  1280,
        height: 720,
        fix: 2/3,
        el: {
            width:  168,
            height: 160
        }
    },
    mobile: 'hd',
    desktop: 'fullhd',
    mode: 'aspect', // We have two modes: aspect and fullscreen
    view: null,
    renderer: null
}

class DeviceManager {
    
    constructor(config) {
        this.config = defaultsDeep(config, defaultConfig)

        this.enableStreams()
        this.setGlobalParams()
        this.setScaleMode()
        this.setOrientation()
        this.setTabLeave()
        this.setTabVisible()
    }

    setGlobalParams() {
        if (this.isMobile()) {
            window.SCALE_FIX   = this.config[this.config.mobile].fix
            window.GAME_WIDTH  = this.config[this.config.mobile].width
            window.GAME_HEIGHT = this.config[this.config.mobile].height
            window.EL_WIDTH    = this.config[this.config.mobile].el.width
            window.EL_HEIGHT   = this.config[this.config.mobile].el.height
            window.GAME_DEVICE = 'mobile'
            window.GAME_RES    = this.config.mobile
        }
        else {
            window.SCALE_FIX   = this.config[this.config.desktop].fix
            window.GAME_WIDTH  = this.config[this.config.desktop].width
            window.GAME_HEIGHT = this.config[this.config.desktop].height
            window.EL_WIDTH    = this.config[this.config.desktop].el.width
            window.EL_HEIGHT   = this.config[this.config.desktop].el.height
            window.GAME_DEVICE = 'desktop'
            window.GAME_RES    = this.config.desktop
        }
    }
    
    setScaleMode() {
        if (this.config.mode === 'fullscreen') {
            this.setFullscreenMode()
            window.addEventListener('resize', this.setFullscreenMode.bind(this))
        }
        if (this.config.mode === 'aspect') {
            this.setAspectMode()
            window.addEventListener('resize', this.setAspectMode.bind(this))
        }
    }
    
    setFullscreenMode() {
        if (!this.config.renderer) return null
        this.config.renderer.resize(window.innerWidth, window.innerHeight)
        window.GAME_WIDTH  = window.innerWidth
        window.GAME_HEIGHT = window.innerHeight
        this.$.next({ from: 'DEVICE', type: 'RESIZE', width: window.GAME_WIDTH, height: window.GAME_HEIGHT })
    }

    setAspectMode() {
        if (!this.config.view) return null
        
        let windowW = window.innerWidth
        let windowH = window.innerHeight

        let scaleX = windowW / GAME_WIDTH
        let scaleY = windowH / GAME_HEIGHT

        this.scale = Math.min(scaleX, scaleY)
        if (this.scale < 1) this.scale = 1

        this.config.view.style.transform = `scale(${this.scale}, ${this.scale})`
    }

    setOrientation() {
        this.$.next({ from: 'DEVICE', type: 'ORIENTATION',  value: screen.orientation.type.split('-')[0] })
        window.addEventListener('orientationchange', e => {
            this.$.next({ from: 'DEVICE', type: 'ORIENTATION',  value: screen.orientation.type.split('-')[0] })
        })
    }
    
    setTabLeave() {
        window.addEventListener('beforeunload', e => {
            this.$.next({ from: 'DEVICE', type: 'LEAVE' })
        })
    }

    setTabVisible() {
        let hidden, visibilityChange
        if (typeof document.hidden !== 'undefined') {
            hidden = 'hidden'
            visibilityChange = 'visibilitychange'
        } else if (typeof document.msHidden !== 'undefined') {
            hidden = 'msHidden'
            visibilityChange = 'msvisibilitychange'
        } else if (typeof document.webkitHidden !== 'undefined') {
            hidden = 'webkitHidden'
            visibilityChange = 'webkitvisibilitychange'
        }

        document.addEventListener(visibilityChange, e => {
            this.$.next({ from: 'DEVICE', type: 'VISIBLE', value: !document[hidden] })
        })
    }

    enableStreams() {
        this.$ = new BehaviorSubject()
    }

    disableStreams() {
        this.$.complete()
    }

    isMobile() {
        return (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) return true; else return false })(navigator.userAgent || navigator.vendor || window.opera)
    }

    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    }

    enterFullscreen() {
        if (this.isIOS()) return null
        if (this.config.view.requestFullScreen)
            this.config.view.requestFullScreen()
        else if (this.config.view.mozRequestFullScreen)
            this.config.view.mozRequestFullScreen()
        else if (this.config.view.webkitRequestFullScreen)
            this.config.view.webkitRequestFullScreen()
        this.$.next({ from: 'DEVICE', mode: 'FULLSCREEN', state: 'start' })
    }
    
    cancelFullscreen() {
        if (this.isIOS()) return null
        if (document.cancelFullScreen)
            document.cancelFullScreen()
        else if (document.mozCancelFullScreen)
            document.mozCancelFullScreen()
        else if (document.webkitCancelFullScreen)
            document.webkitCancelFullScreen()
        this.$.next({ from: 'DEVICE', mode: 'FULLSCREEN', state: 'end' })
    }

}

export { DeviceManager }