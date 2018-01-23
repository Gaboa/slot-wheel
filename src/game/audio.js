// {type: 'start', name: 'init', source: this, volume: 1}
// {type: 'stop', name: 'init', source: this}
// {type: 'complete', name: 'init', source: this}
// {type: 'fadeStart', name: 'init', source: this, startVolume: 0, endVolume: 0.6}
// {type: 'fadeEnd', name: 'init', source: this}

import { Howl } from 'howler'
import { Subject, Observable } from 'rxjs'

class AudioManager {

    constructor({
        src,
        sprites
    }){
        this.sprites = sprites
        this._volume = 1

        this.Howler = new Howl({
            src: src,
            mute: true,
            sprite: this.parseSprites()
        })

        this.$ = new Subject()   
        
        this.Howler.once('load', () => {
            this.createGroups()
            setTimeout(() => {
                this.Howler.mute(false)
                this.volume = this._volume
                this[`${ this._muted ? '' : 'un' }muteAll`]()
                this.$.next({ type: 'LOAD', state: 'COMPLETE' })
            }, 0)
        })

    }

    createGroups() {
        this.music   = this.createGroup('music', true)
        this.effects = this.createGroup('effects', false)
    }

    createGroup(type, isStopPrevious) {
        let typeSprites = this.sprites.filter(sound => sound.type === type)

        return new SoundGroup({
            howler: this.Howler,
            sprites: typeSprites,
            isStopPrevious: isStopPrevious,
            stream: this.$
        })
    }

    parseSprites() {
        let parsed = {}

        this.sprites.forEach(sprite => {
            let start = this.parseTime(sprite.start)
            let end = this.parseTime(sprite.end)
            let duration = end - start - 10
            let loop = sprite.loop
            let name = sprite.name

            parsed[name] = [start, duration, loop]
        })

        return parsed
    }

    parseTime(value) {
        let splited = value.split('.')
        let minutes = parseInt(splited[0] * 60 * 1000)
        let seconds = parseInt(splited[1] * 1000)
        let ms = parseInt(splited[2])

        return minutes + seconds + ms
    }

    set volume(value) {
        this._volume = value
        if (this.music && this.effects) {
            this.music.volume = value
            this.effects.volume = value
        }
    }

    get volume() {
        return this._volume
    }

    muteMusic() {
        if (this.music)        
        this.music.mute()
    }

    unmuteMusic() {
        if (this.music)
        this.music.unmute()
    }

    muteEffects() {
        if (this.effects)        
        this.effects.mute()
    }

    unmuteEffects() {
        if (this.effects)        
        this.effects.unmute()
    }

    play(name) {
        if(this.music.has(name))
            this.music.play(name)
        
        if(this.effects.has(name))
            this.effects.play(name)
    }

    fade({name, from, to, duration}) {
        if(this.music.has(name))
            this.music.fade({name, from, to, duration})

        if(this.effects.has(name))
            this.effects.fade({name, from, to, duration})
    }

    stop(value) {
        if(this.music.has(value))
            this.music.stop(value)

        if(this.effects.has(value))
            this.effects.stop(value)
    }

    muteAll() {
        if (this.music && this.effects) {
            this.muteMusic()
            this.muteEffects()
        }
        else this._muted = true
    }

    unmuteAll() {
        if (this.music && this.effects) {
            this.unmuteMusic()
            this.unmuteEffects()
        }    
        else this._muted = false            
    }
}

class SoundGroup {

    constructor({
        howler,
        sprites,
        stream,
        isStopPrevious = false,
    }) {
        this.howler = howler
        this.sprites = sprites
        this.isStopPrevious = isStopPrevious
        this.$ = stream
        this.sounds = []

        this.createSoundsInstances()
    }

    createSoundsInstances() {
        let howler = this.howler;
        this.sprites.forEach(sprite => {
            let sound = new SoundInstance({
                howler: this.howler,
                name: sprite.name,
                volume: sprite.volume,
                loop: sprite.loop,
                stream: this.$
            })

            this[sprite.name] = sound
            this.sounds.push(sound)
        })
    }

    play(value) {
        if(this.isStopPrevious) this.stopPrevious(value)

        this[value].play()
    }

    stopPrevious(value) {
        if (this.currentMusic) this.currentMusic.stop()

        this.currentMusic = this[value]
    }

    stop(value) {
        this[value].stop()
    }

    mute() {
        this.sounds.forEach(sound => sound.mute())
    }
    
    unmute() {
        this.sounds.forEach(sound => sound.unmute())
    }

    fade({ name, from, to, duration }) {
        this[name].fade(from, to, duration)
    }

    has(value) {
        return this[value] !== undefined
    }

    set volume(value) {
        this.sounds.forEach(sound => sound.volume = value)
    }
}

class SoundInstance {
    constructor({
        howler,
        name,
        stream,
        volume = 1
    }) {
        this.howler = howler
        this.maxVolume = volume
        this.id = howler.play(name)
        this.$ = stream
        this.name = name
        
        this.volume = 1
        
        setTimeout(() => this.stop(), 0)
        this.howler.on('fade', (id => {
            if(id === this.id)
                this.$.next({type: 'fadeEnd', name: this.name, source: this})
        }))
    }

    play() {
        this.howler.play(this.id)

        this.$.next({type: 'start', name: this.name, source: this, volume: this.volume})
    }

    stop() {
        this.howler.stop(this.id)

        this.$.next({type: 'stop', name: this.name, source: this})
    }

    mute() {
        this.howler.mute(true, this.id)
    }

    unmute() {
        this.howler.mute(false, this.id)
    }

    set volume(value) {
        let volume = this.maxVolume * value

        this._volume = volume
        this.howler.volume(volume, this.id)
    }

    get volume() {
        return this._volume
    }

    fade(from, to, duration) {
        this.howler.fade(from, to, duration, this.id)

        this.$.next({type: 'fadeStart', name: this.name, source: this, startVolume: from, endVolume: to})
    }
}

export { AudioManager }