//{type: 'start', name: 'bird', source: this}
//{type: 'stop', name: 'bird', source: this}
//{type: 'update', name: 'bird', source: this, frame: 25}
//{type: 'complete', name: 'bird', source: this}
//{type: 'loop', name: 'bird', source: this}


import {Subject} from 'rxjs';

class SpriteAnimation extends PIXI.extras.AnimatedSprite {
    static getTextures(name, frames) {
        let textureArray = [];

        for (let i = 0; i < frames; i++) {
            let imageName = `${name}${i}`;
            let texture = PIXI.Texture.fromImage(imageName);
            textureArray.push(texture);
        };

        return textureArray;
    }

    constructor({
        container,
        name,
        frames,
        x = 0,
        y = 0,
        speed,
        loop = false,
        autoStart = true
    }) {
        super(SpriteAnimation.getTextures(name, frames));

        this.x = x;
        this.y = y;
        this.container = container;
        this.animationSpeed = speed;
        this.loop = loop;
        this.name = name;
        this.$ = new Subject();

        this.container.addChild(this);

        if (autoStart) {
            this.play();
        }


        this.onLoop = () => {
            this.$.next({type: 'loop', name: this.name, source: this})
        };

        this.onComplete = () => {
            this.$.next({type: 'complete', name: this.name, source: this})
        };

        this.onFrameChange = (frame) => {
            this.$.next({type: 'update', name: this.name, source: this, frame: frame})
        };
    }

    start() {
        this.$.next({type: 'start', source: this, name: this.name});

        if(this.loop) {
            super.play();
        } else {
            this.gotoAndPlay(0);
        }
    }

    stop() {
        super.stop();

        this.$ && this.$.next({type: 'stop', name: this.name, source: this})
    }
}

export {SpriteAnimation}