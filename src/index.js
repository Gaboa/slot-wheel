import './index.css'
import * as PIXI from 'pixi.js'
import 'pixi-spine'
import Vue from 'vue' 
import defaultsDeep from 'lodash.defaultsdeep'

import { Game } from './game'
import { Preload, Root } from './levels'
//import Info from './components/vue-components/Info'
import Settings from './components/vue-components/Settings'

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

window.game = game

const info = document.createElement('div')
info.setAttribute('id', 'info')
document.getElementById('app').appendChild(info)

// const settings = document.createElement('div')
// settings.setAttribute('id', 'settings')
// document.getElementById('app').appendChild(settings)

// game -> init -> game.data.info -> new Info(game.data.info)

// const defaultInfoData = {
//     //visible: true,
//     pages: [
//         {
//             index: 0,
//             header: 'The payout table for major game symbols',
//             body: {
//                 grid: {
//                     gridTemplateColumns: '25% 25% 25% 25%',
//                     gridTemplateRows: '50% 50%',
//                     alignItems: 'center'
//                 },
//                 cards: [
//                     {
//                         index: 0,
//                         type: 'image-table',
//                         description: {
//                              position: null,
//                                  image: {
//                                      src: 'src/img/info/clubs.png'
//                                  },
//                                  table: {
//                                     rows: ['Clubs',3,3,4,5,5,10]
//                                  }

//                         }
                       
//                     },
//                     {
//                         index: 1,
//                         type: 'image-table',
//                         description: {
//                             position:null,
//                             image: {
//                                 src: 'src/img/info/heart.png'
//                             },
//                             table: {
//                                 rows:  ['Heart', 3,3,4,5,5,10]
//                             }

//                         }

//                     },
//                      {
//                          index: 2,
//                          type: 'image-table',
//                          description: {
//                              position: null,
//                              image: {
//                                  src: 'src/img/info/spade.png'
//                              },
//                              table: {
//                                 rows:  ['Spade',3,3,4,5,5,10]
//                              }

//                          }

//                     },
//                       {
//                           index: 3,
//                           type: 'image-table',
//                           description: {
//                               position: null,
//                               image: {
//                                   src: 'src/img/info/tambourine.png'
//                               },
//                               table: {
//                                 rows:  ['Tambourine', 3,3,4,5,5,10]
//                               }

//                           }

//                     },
//                        {
//                            index: 4,
//                            type: 'image-table',
//                            description: {
//                                position: null,
//                                image: {
//                                    src: 'src/img/info/parrot.png'
//                                },
//                                table: {
//                                 rows:  ['Parrot',3,3,4,5,5,10]
//                                }

//                            }

//                     },
//                         {
//                             index: 5,
//                             type: 'image-table',
//                             description: {
//                                 position: null,
//                                 image: {
//                                     src: 'src/img/info/hat.png'
//                                 },
//                                 table: {
//                                     rows:  ['Hat', 3,3,4,5,5,10]
//                                 }

//                             }

//                     },
//                          {
//                              index: 6,
//                              type: 'image-table',
//                              description: {
//                                  position: null,
//                                  image: {
//                                      src: 'src/img/info/anchor.png'
//                                  },
//                                  table: {
//                                     rows:  ['Anchor', 3,3,4,5,5,10]
//                                  }

//                              }

//                     },
//                           {
//                               index: 7,
//                               type: 'image-table',
//                               description: {
//                                   position: null,
//                                   image: {
//                                       src: 'src/img/info/fish.png'
//                                   },
//                                   table: {
//                                     rows:  ['Fish', 3,3,4,5,5,10]
//                                   }

//                               }

//                           },
//                 ]
//             },
//             footer: [
//                 'Wins on bet line are payed only when you get a succession from the leftmost reel to the rightmost reel.',
//                 'Bet on the winning line is multiplied by the multiplier of the winning symbols.',
//                 'Malfunction Voids all pays and plays.'
//             ]
//         },
//         {
//             index: 1,
//             header: 'Freespins bonus game',
//             body: {
//                 grid: {
//                     gridTemplateRows: '33.33% 33.33% 33.33%',
//                     gridTemplateColumns: '50% 50%',
//                 },
//                 cards: [
//                     {
//                         type: 'image-instance',
//                         index: 0,
//                         description: {
//                             position: {
//                                 rows: [1, 4],
//                                 columns: [1, 2]
//                             },
//                             image: {
//                                 src: 'src/img/info/cannon.png'
//                             }
//                         }
                        
//                     },
//                     {
//                         type: 'text-description',
//                         index: 1,
//                         description: {
//                             position: {
//                                 rows: [1, 1],
//                                 columns: [2, 2]
//                             },
//                             content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
//                             in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
//                             Different amount of gifts increases multiplier(x6 maximum).`
//                         }
                        
//                     },
//                     {
//                         type: 'list-image',
//                         index: 2,
//                         description: {
//                             position: {
//                                 rows: [2, 2],
//                                 columns: [2, 2]
//                             },
//                             content: [
//                                 '2 Gifts = x3 multiplier',
//                                 '2 Gifts = x3 multiplier',
//                                 '2 Gifts = x3 multiplier',
//                                 '2 Gifts = x3 multiplier',
//                                 '2 Gifts = x3 multiplier',
//                             ],
//                             image: {
//                                 src: 'src/img/info/small_cannon.png'
//                             }
//                         }
                        
//                     },
//                     {
//                         type: 'image-list',
//                         index: 3,
//                         description: {
//                             position: {
//                                 rows: [3, 3],
//                                 columns: [2, 2]
//                             },
//                             image:{
//                                 src: 'src/img/info/small_cannon.png'
//                             },
//                             content: [
//                                 'x3 = +20 Free spins',
//                                 'x3 = +20 Free spins',
//                                 'x3 = +20 Free spins',
//                             ]
//                         }
//                     }
//                 ]
//             },
//             footer: [
//                 'Wins on bet line are payed only when you get a succession from the leftmost reel to the rightmost reel.',
//                 'Bet on the winning line is multiplied by the multiplier of the winning symbols.',
//                 'Malfunction Voids all pays and plays.'
//             ]
//         },
//         {
//             index:2,
//             header: 'Bonus symbols',
//             body: {
//                 grid: {
//                     gridTemplateRows: '50% 50%',
//                     gridTemplateColumns: '50% 50%',
//                     alignItems: 'center'
//                 },
//                 cards: [
//                     {
//                         index: 0,
//                         type: 'image-text',
//                         description: {
//                             position: {
//                                 rows: [1,3],
//                                 columns: [1, 1]
//                             },
//                             image: {
//                                 src: 'src/img/info/skull.png'
//                             },
//                             content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
//                             in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
//                             Different amount of gifts increases multiplier(x6 maximum).Starts by 3, 4,
//                              5 Krampus bonus symbols. Every Krampus symbol 
//                             in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree`
//                         }
                        
//                     },
//                     {
//                         type: 'image-text',
//                         index: 1,
//                         description: {
//                             position: {
//                                 rows: [1, 1],
//                                 columns: [2, 2]
//                             },
//                             image: {
//                                 src: 'src/img/info/ship.png'
//                             },
//                             content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
//                             in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
//                             Different amount of gifts increases multiplier(x6 maximum).Starts by 3, 4,
//                              5 Krampus bonus symbols.`
//                         }
                       
//                     },
//                     {
//                         type: 'image-text',
//                         index: 2,
//                         description: {
//                             position: {
//                                 rows: [2, 2],
//                                 columns: [2, 2]
//                             },
//                             image: {
//                                 src: 'src/img/info/chest.png'
//                             },
//                             content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
//                             in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
//                             Different amount of gifts increases multiplier(x6 maximum).Starts by 3, 4,
//                              5 Krampus bonus symbols.`
//                         }
                        
//                     },
//                 ]
//             },
//             footer: [
//                 'Wins on bet line are payed only when you get a succession from the leftmost reel to the rightmost reel.',
//                 'Bet on the winning line is multiplied by the multiplier of the winning symbols.',
//                 'Malfunction Voids all pays and plays.'
//             ]
//         },
//         {
//             index:3,
//             header: 'Winning bet lines',
//             body: {
//                 grid: {
//                     gridTemplateRows: '50% 50%',
//                     gridTemplateColumns: '19% 19% 19% 19% 19%',
//                     gridColumnGap:'1.25%',
//                 },
//                 cards: [
//                     {
//                         type: 'win-line',
//                         index: 1,
//                         description: {
//                             index: 1,
//                             position: null,
//                             image: {
//                                 src: 'src/img/info/mini.png'
//                             },
//                             rows: 3,
//                             columns: 5,
//                             scheme: [10, 11, 12, 13, 14]
//                         }
                        
//                     },
//                     {
//                         type: 'win-line',
//                         index: 2,
//                         description: {
//                             position: null,
//                             index: 2,
//                             image: {
//                                 src: 'src/img/info/mini.png'
//                             },
//                             rows: 3,
//                             columns: 5,
//                             scheme: [10, 11, 12, 13, 14]
//                         }
                        
//                     },
//                     {
//                         type: 'win-line',
//                         index: 3,
//                         description: {
//                             position: null,
//                             index: 3,
//                             image: {
//                                 src: 'src/img/info/mini.png'
//                             },
//                             rows: 3,
//                             columns: 5,
//                             scheme: [0, 1, 2, 3, 4]
//                         }
                        
//                     },
//                     {
//                         type: 'win-line',
//                         index: 4,
//                         description: {
//                             position: null,
//                             index: 4,
//                             image: {
//                                 src: 'src/img/info/mini.png'
//                             },
//                             rows: 3,
//                             columns: 5,
//                             scheme: [5, 6, 7, 8, 9]
//                         }
                        
//                     },
//                     {
//                         type: 'win-line',
//                         index: 5,
//                         description: {
//                             position: null,
//                             index: 5,
//                             image: {
//                                 src: 'src/img/info/mini.png'
//                             },
//                             rows: 3,
//                             columns: 5,
//                             scheme: [0, 11, 6, 5, 8]
//                         }
                        
//                     },
//                     {
//                         type: 'win-line',
//                         index: 6,
//                         description: {
//                             index: 6,
//                             position: null,
//                             image: {
//                                 src: 'src/img/info/mini.png'
//                             },
//                             rows: 3,
//                             columns: 5,
//                             scheme: [0, 11, 6, 5, 8]
//                         }
                        
//                     },
//                     {
//                         type: 'win-line',
//                         index: 7,
//                         description: {
//                             index: 7,
//                             position: null,
//                             image: {
//                                 src: 'src/img/info/mini.png'
//                             },
//                             rows: 3,
//                             columns: 5,
//                             scheme: [0, 11, 6, 5, 8]
//                         }
                        
//                     },
//                     {
//                         type: 'win-line',
//                         index: 8,
//                         description: {
//                             position: null,
//                             index: 8,
//                             image: {
//                                 src: 'src/img/info/mini.png'
//                             },
//                             rows: 3,
//                             columns: 5,
//                             scheme: [0, 11, 6, 5, 8]
//                         }
                        
//                     },
//                     {
//                         type: 'win-line',
//                         index: 9,
//                         description: {
//                             position: null,
//                             index: 9,
//                             image: {
//                                 src: 'src/img/info/mini.png'
//                             },
//                             rows: 3,
//                             columns: 5,
//                             scheme: [0, 11, 6, 5, 8]
//                         }
                        
//                     },
//                     {
//                         type: 'win-line',
//                         index: 10,
//                         description: {
//                             index: 10,
//                             position: null,
//                             image: {
//                                 src: 'src/img/info/mini.png'
//                             },
//                             rows: 3,
//                             columns: 5,
//                             scheme: [0, 11, 6, 5, 8]
//                         }
                        
//                     },
//                 ]
//             },
//             footer: [
//                 'Wins on bet line are payed only when you get a succession from the leftmost reel to the rightmost reel.',
//                 'Bet on the winning line is multiplied by the multiplier of the winning symbols.',
//                 'Malfunction Voids all pays and plays.'
//             ]
//         },
//         {
//             index: 4,
//             header: 'You can use hotkeys',
//             body: {
//                 grid: {
//                     gridTemplateRows: '50% 50%',
//                     gridTemplateColumns: '100%'
//                 },
//                 cards: [
//                     {
//                         type: 'image-instance',
//                         index: 0,
//                         description: {
//                             position: null,
//                             image: {
//                                 src: 'src/img/info/control.png'
//                             },
//                         }
                        
//                     },
//                     {
//                         type: 'image-instance',
//                         index:1,
//                         description: {
//                             position: null,
//                             image: {
//                                 src: 'src/img/info/panel.png'
//                             },
//                         }
//                     },
                    
//                 ]
//             },
//             footer: [
//                 'Wins on bet line are payed only when you get a succession from the leftmost reel to the rightmost reel.',
//                 'Bet on the winning line is multiplied by the multiplier of the winning symbols.',
//                 'Malfunction Voids all pays and plays.'
//             ]
//         },
//     ]
// }

// class InfoConstr {

//     constructor({
//         config
//     }) {

//         this.config = config
//         this.visible = true

//         const self = this

//         this.vm = new Vue({
//             el: '#info',
//             data () {
//                 return {
//                     info: self.config,
//                     visible: self.visible
//                 }
//             },
//             render(h){
//                 return h (Info, 
//                     {props: {
//                         info: this.info,
//                         visible: this.visible
//                     }}
//                 )
//             }
//         })

//     }

//     open() {
//         this.vm.visible = true
//     }
    
//     close() {
//         this.vm.visible = false
//     }

// }

// game.info = new InfoConstr({
//     config: defaultInfoData
// })



// new Vue({
//     el: '#settings',
//     data () {
//         return {}
//     },
//     render(h){
//         return h (Settings)
//     }
// })

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