import './index.css'
import * as PIXI from 'pixi.js'
import 'pixi-spine'
import Vue from 'vue' 

import { Game } from './game'
import { Preload, Root } from './levels'
import Info from './components/vue-components/Info'

const game = new Game({
    id: '#app',
    fps: 60,

    device: {},

    request: {
        url: 'https://frontqa.bossgs.net/service',
        mode: 'animalssteam',
        debug: {
            active: false,
            userID: 18,
            game: 'animalssteam'
        }
    }
})

const info = document.createElement('div')
info.setAttribute('id', 'info')
document.getElementById('app').appendChild(info)

window.game = game

// game -> init -> game.data.info -> new Info(game.data.info)

const defaultInfoData = {
    pages: [
        {
            header: 'The payout table for major game symbols',
            body: {
                grid: {
                    rows: 2,
                    column: 4
                },
                cards: [
                    {
                        type: 'image-table',
                        position: {
                            rows: [1],
                            columns: [1]
                        },
                        image: {
                            src: 'image.png/base64'
                        },
                        table: {
                            name: 'Jack',
                            rows: [
                                [3,3],
                                [4,5],
                                [5, 10]
                            ]
                        }

                    }
                ]
            },
            footer: [
                'Wins on bet line are payed only when you get a succession from the leftmost reel to the rightmost reel.',
                'Bet on the winning line is multiplied by the multiplier of the winning symbols.',
                'Malfunction Voids all pays and plays.'
            ]
        },
        {
            header: 'Freespins bonus game',
            body: {
                grid: {
                    rows: 3,
                    column: 2
                },
                cards: [
                    {
                        type: 'image',
                        position: {
                            rows: [1,2],
                            column: 1
                        },
                        image: {
                            src: 'image.png/base64'
                        }
                    },
                    {
                        type: 'text',
                        position: {
                            rows: [1],
                            columns: [2]
                        },
                        content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
                        in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
                        Different amount of gifts increases multiplier(x6 maximum).`
                    },
                    {
                        type: 'list-image',
                        position: {
                            rows: [2],
                            columns: [2]
                        },
                        content: [
                            '2 Gifts = x3 multiplier',
                            '2 Gifts = x3 multiplier',
                            '2 Gifts = x3 multiplier',
                            '2 Gifts = x3 multiplier',
                            '2 Gifts = x3 multiplier',
                        ],
                        image: {
                            src:''
                        }
                    },
                    {
                        type: 'image-list',
                        position: {
                            rows: [3],
                            columns: [2]
                        },
                        image:{
                            src: ''
                        },
                        content: [
                            'x3 = +20 Free spins',
                            'x3 = +20 Free spins',
                            'x3 = +20 Free spins',
                        ]
                    }
                ]
            },
            footer: [
                'Wins on bet line are payed only when you get a succession from the leftmost reel to the rightmost reel.',
                'Bet on the winning line is multiplied by the multiplier of the winning symbols.',
                'Malfunction Voids all pays and plays.'
            ]
        },
        {
            header: 'Bonus symbols',
            body: {
                grid: {
                    rows: 2,
                    column: 2
                },
                cards: [
                    {
                        type: 'image-text',
                        position: {
                            rows: [1,2],
                            column: 1
                        },
                        image: {
                            src: 'image.png/base64'
                        },
                        content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
                        in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
                        Different amount of gifts increases multiplier(x6 maximum).Starts by 3, 4,
                         5 Krampus bonus symbols. Every Krampus symbol 
                        in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree`
                    },
                    {
                        type: 'image-text',
                        position: {
                            rows: [1],
                            columns: [2]
                        },
                        image: {
                            src: 'image.png/base64'
                        },
                        content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
                        in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
                        Different amount of gifts increases multiplier(x6 maximum).Starts by 3, 4,
                         5 Krampus bonus symbols.`
                    },
                    {
                        type: 'image-text',
                        position: {
                            rows: [2],
                            columns: [2]
                        },
                        image: {
                            src: 'image.png/base64'
                        },
                        content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
                        in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
                        Different amount of gifts increases multiplier(x6 maximum).Starts by 3, 4,
                         5 Krampus bonus symbols.`
                    },
                ]
            },
            footer: [
                'Wins on bet line are payed only when you get a succession from the leftmost reel to the rightmost reel.',
                'Bet on the winning line is multiplied by the multiplier of the winning symbols.',
                'Malfunction Voids all pays and plays.'
            ]
        },
        {
            header: 'Bonus symbols',
            body: {
                grid: {
                    rows: 2,
                    column: 2
                },
                cards: [
                    {
                        type: 'image-text',
                        position: {
                            rows: [1,2],
                            column: 1
                        },
                        image: {
                            src: 'image.png/base64'
                        },
                        content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
                        in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
                        Different amount of gifts increases multiplier(x6 maximum).Starts by 3, 4,
                         5 Krampus bonus symbols. Every Krampus symbol 
                        in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree`
                    },
                    {
                        type: 'image-text',
                        position: {
                            rows: [1],
                            columns: [2]
                        },
                        image: {
                            src: 'image.png/base64'
                        },
                        content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
                        in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
                        Different amount of gifts increases multiplier(x6 maximum).Starts by 3, 4,
                         5 Krampus bonus symbols.`
                    },
                    {
                        type: 'image-text',
                        position: {
                            rows: [2],
                            columns: [2]
                        },
                        image: {
                            src: 'image.png/base64'
                        },
                        content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
                        in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
                        Different amount of gifts increases multiplier(x6 maximum).Starts by 3, 4,
                         5 Krampus bonus symbols.`
                    },
                ]
            },
            footer: [
                'Wins on bet line are payed only when you get a succession from the leftmost reel to the rightmost reel.',
                'Bet on the winning line is multiplied by the multiplier of the winning symbols.',
                'Malfunction Voids all pays and plays.'
            ]
        },
        {
            header: 'Winning bet lines',
            body: {
                grid: {
                    rows: 2,
                    column: 4
                },
                cards: [
                    {
                        type: 'win-line',
                        position: {
                            rows: [1],
                            columns: [1]
                        },
                        image: {
                            src: 'image.png/base64'
                        },
                        rows: 3,
                        columns: 5,
                        scheme: [[2,1], [2,2], [2,3], [2,4], [2,5]]
                    },
                ]
            },
            footer: [
                'Wins on bet line are payed only when you get a succession from the leftmost reel to the rightmost reel.',
                'Bet on the winning line is multiplied by the multiplier of the winning symbols.',
                'Malfunction Voids all pays and plays.'
            ]
        },
        {
            header: 'You can use hotkeys',
            body: {
                grid: {
                    rows: 2,
                    column: 3
                },
                cards: [
                    {
                        type: 'image',
                        position: {
                            rows: [2],
                            column: [1,2,3]
                        },
                        image: {
                            src: 'image.png/base64'
                        },
                    },
                    
                ]
            },
            footer: [
                'Wins on bet line are payed only when you get a succession from the leftmost reel to the rightmost reel.',
                'Bet on the winning line is multiplied by the multiplier of the winning symbols.',
                'Malfunction Voids all pays and plays.'
            ]
        },



        // { type: 'some', grid: 4, header: 'some', cards: [
        //     { type: 'img+table', pos: { x: 0, y: 0 }, imgSrc: '', rows: [
        //         'one',
        //         'two'
        //     ] }
        // ], footer: [] }
    ]
}

new Vue({
    el: '#info',
    data () {
        return {
            info : defaultInfoData
        }
    },
    render(h){
        return h (Info, 
            {props: {
                info: this.info
            }}
        )
    }
})

game.level = new Preload({
    game,
    base: `src/img/${GAME_RES}`,
    config: {
        preload: [
            { name: 'preload_bg',    url: 'preload/bg.jpg' },
            { name: 'preload_bar',   url: 'preload/bar.png' },
            { name: 'preload_light', url: 'preload/light.png' },
            { url: 'preload/preload.json' }
        ],
        common: [
            { url: 'machine/elements/elements.json' },
            
            { name: 'jack', url: 'machine/elements/jack.json' },
            { name: 'queen', url: 'machine/elements/queen.json' },
            { name: 'king', url: 'machine/elements/king.json' },
            { name: 'ace', url: 'machine/elements/ace.json' },
            { name: 'rabbit', url: 'machine/elements/rabbit.json' },
            { name: 'mouse', url: 'machine/elements/mouse.json' },
            { name: 'owl', url: 'machine/elements/owl.json' },
            { name: 'cat', url: 'machine/elements/cat.json' },
            { name: 'wild', url: 'machine/elements/wild.json' },
            { name: 'bonus', url: 'machine/elements/bonus.json' },
            { name: 'pig', url: 'machine/elements/pig.json' },
            
            { url: 'footer/buttons.json' },
            { url: 'machine/buttons.json' },
            { name: 'tile', url: 'machine/tile.png' },
            { name: 'frame', url: 'machine/frame.png' },
            { name: 'panel_root', url: 'machine/panel_root.png' },
            { name: 'panel_fs', url: 'machine/panel_fs.png' },
            { name: 'win_table', url: 'machine/win_table.png' },
            { name: 'win_circle', url: 'machine/win_circle.png' },
            { name: 'logo', url: 'machine/logo.json' },
            { name: 'panel', url: 'machine/panel.json' },
            { name: 'spin', url: 'machine/button.json' }
        ]
    }
})

game.request.$
    .filter(e => e.type === 'INIT')
    .subscribe(res => game.parser.init(res.data))

game.request.$
    .filter(e => e.type === 'ROLL')
    .subscribe(res => game.parser.roll(res.data))

game.device.$
    .filter(e => e.type === 'LEAVE')
    .subscribe(res => game.request.sendLogout())

game.level.$
    .filter(e => e === 'REMOVED').take(1)
    .subscribe(e => game.level = new Root({ game }))

// Experiment with resolution changing
// setTimeout(() => {
//     GAME_RES = 'hd'
//     GAME_WIDTH = 1280
//     GAME_HEIGHT = 720
//     game.renderer.resize(1280, 720)
//     game.level.removeLevel()
//     game.loader.reset()
//     PIXI.utils.clearTextureCache()
//     game.level = new Preload({
//         game,
//         base: `src/img/${GAME_RES}`,
//         config: {
//             preload: [
//                 { name: 'preload_bg', url: 'preload/bg.jpg' },
//                 { name: 'preload_bar', url: 'preload/bar.png' },
//                 { name: 'preload_light', url: 'preload/light.png' },
//                 { url: 'preload/preload.json' }
//             ],
//             common: [
//                 { url: 'machine/elements/elements.json' },

//                 { name: 'jack', url: 'machine/elements/jack.json' },
//                 { name: 'queen', url: 'machine/elements/queen.json' },
//                 { name: 'king', url: 'machine/elements/king.json' },
//                 { name: 'ace', url: 'machine/elements/ace.json' },
//                 { name: 'rabbit', url: 'machine/elements/rabbit.json' },
//                 { name: 'mouse', url: 'machine/elements/mouse.json' },
//                 { name: 'owl', url: 'machine/elements/owl.json' },
//                 { name: 'cat', url: 'machine/elements/cat.json' },
//                 { name: 'wild', url: 'machine/elements/wild.json' },
//                 { name: 'bonus', url: 'machine/elements/bonus.json' },
//                 { name: 'pig', url: 'machine/elements/pig.json' },

//                 { url: 'footer/buttons.json' },
//                 { url: 'machine/buttons.json' },
//                 { name: 'tile', url: 'machine/tile.png' },
//                 { name: 'frame', url: 'machine/frame.png' },
//                 { name: 'panel_root', url: 'machine/panel_root.png' },
//                 { name: 'panel_fs', url: 'machine/panel_fs.png' },
//                 { name: 'win_table', url: 'machine/win_table.png' },
//                 { name: 'win_circle', url: 'machine/win_circle.png' },
//                 { name: 'logo', url: 'machine/logo.json' },
//                 { name: 'panel', url: 'machine/panel.json' },
//                 { name: 'spin', url: 'machine/button.json' }
//             ]
//         }
//     })

//     game.level.$
//         .filter(e => e === 'REMOVED').take(1)
//         .subscribe(e => game.level = new Root({ game }))
// }, 10000)