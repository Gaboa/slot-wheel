import 'url-search-params-polyfill'
import { Subject } from 'rxjs'
import axios from 'axios'

// TODO: Add methods for handling errors

class RequestManager {

    constructor({
        url,
        mode,
        debug = { active: false }
    }) {
        this.url   = url
        this.mode  = mode
        this.debug = debug

        this.getSearchParams()
        this.getLocalParams()
        this.$ = new Subject()
    }

    // Params
    getSearchParams() {
        this.searchString = window.location.href.split('?').slice(1).join()
        this.search = new URLSearchParams(this.searchString)

        this.restore = this.search.get('restore')
        this.mode = this.search.get('mode') || this.mode
        this.devSid = `dev_${Math.round(Math.random() * 10000)}`
        this.sid = this.search.get('sid') || this.devSid
    }

    getLocalParams() {
        if (localStorage.getItem('forcedSid'))
            this.sid = localStorage.getItem('forcedSid')
        localStorage.removeItem('forcedSid')
    }

    // Requests
    send({
        url,
        type,
        timeout = 5000
    }) {
        axios.get(url, { timeout })
            .then(response => {
                this.$.next({ type, data: response.data })
            })
            .catch(error => {
                this.$.next({ type, data: error.data || error })
            })
    }

    sendDebug() {
        const debugURL = `https://frontqa.bossgs.net/casino/api.php?uId=${this.debug.userID}&pid=anothergames&game=${this.debug.game}&demo=0&show=0&getGameUrl`
        axios.get(debugURL)
            .then(response => {
                this.sid = response.data.split('?')[1].split('&')[0].split('=')[1]
                console.log(`This is debug mode.\nSession ID = ${this.sid}.\nGame = ${this.debug.game}.\nUser = ${this.debug.userID}.`)
                this.sendInitialize()
            })
    }

    sendRestore() {
        const restoreURL = `${this.url}/_Restore/${this.sid}/${this.mode}/${this.restore}`
        console.log(`This is restore mode.\nName of save = ${this.restore}.`)
        this.send({
            url: restoreURL,
            type: 'INIT',
            timeout: 10000
        })
    }

    sendInit() {
        if (this.debug.active) {
            this.sendDebug()
        } else if (this.restore) {
            this.sendRestore()
        } else {
            this.sendInitialize()
        }
    }

    sendInitialize() {
        const initURL = `${this.url}/_Initialise/${this.sid}/${this.mode}`
        this.send({
            url: initURL,
            type: 'INIT',
            timeout: 10000
        })
    }

    sendRoll({
        level,
        value,
        index = 0
    }) {
        const rollURL = `${this.url}/_Roll/${this.sid}/${level}/${value}/${index}`
        this.send({
            url: rollURL,
            type: 'ROLL'
        })
    }

    sendLogout() {
        const logoutURL = `${this.url}/_Logout/${this.sid}`
        this.send({
            url: logoutURL,
            type: 'LOGOUT'
        })
    }

    sendPing() {
        const pingURL = `${this.url}/_Ping/${this.sid}`
        this.send({
            url: pingURL,
            type: 'PING'
        })
    }

    save(name) {
        const saveURL = `${this.url}/_CacheSession/${this.sid}/${name}`
        this.send({
            url: saveURL,
            type: 'SAVE'
        })
    }

}

export { RequestManager }
export default RequestManager
