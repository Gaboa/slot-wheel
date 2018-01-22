import Vue from 'vue' 
import Info from './vue-components/Info'
import {Subject} from 'rxjs'

const defaultInfoData = {
    pages: [
        {
            index: 0,
            header: 'The payout table for major game symbols',
            body: {
                grid: {
                    gridTemplateColumns: '25% 25% 25% 25%',
                    gridTemplateRows: '50% 50%',
                    alignItems: 'center'
                },
                cards: [
                    {
                        index: 0,
                        type: 'image-table',
                        description: {
                             position: null,
                                 image: {
                                     src: 'src/img/info/clubs.png'
                                 },
                                 table: {
                                    rows: ['Clubs',3,4,5,6,7,10]
                                 }

                        }
                       
                    },
                    {
                        index: 1,
                        type: 'image-table',
                        description: {
                            position:null,
                            image: {
                                src: 'src/img/info/heart.png'
                            },
                            table: {
                                rows:  ['Heart',3,4,5,6,7,10]
                            }

                        }

                    },
                     {
                         index: 2,
                         type: 'image-table',
                         description: {
                             position: null,
                             image: {
                                 src: 'src/img/info/spade.png'
                             },
                             table: {
                                rows:  ['Spade',3,4,5,6,7,10]
                             }

                         }

                    },
                      {
                          index: 3,
                          type: 'image-table',
                          description: {
                              position: null,
                              image: {
                                  src: 'src/img/info/tambourine.png'
                              },
                              table: {
                                rows:  ['Tambourine',3,4,5,6,7,10]
                              }

                          }

                    },
                       {
                           index: 4,
                           type: 'image-table',
                           description: {
                               position: null,
                               image: {
                                   src: 'src/img/info/parrot.png'
                               },
                               table: {
                                rows:  ['Parrot',3,4,5,6,7,10]
                               }

                           }

                    },
                        {
                            index: 5,
                            type: 'image-table',
                            description: {
                                position: null,
                                image: {
                                    src: 'src/img/info/hat.png'
                                },
                                table: {
                                    rows:  ['Hat',3,4,5,6,7,10]
                                }

                            }

                    },
                         {
                             index: 6,
                             type: 'image-table',
                             description: {
                                 position: null,
                                 image: {
                                     src: 'src/img/info/anchor.png'
                                 },
                                 table: {
                                    rows:  ['Anchor',3,4,5,6,7,10]
                                 }

                             }

                    },
                          {
                              index: 7,
                              type: 'image-table',
                              description: {
                                  position: null,
                                  image: {
                                      src: 'src/img/info/fish.png'
                                  },
                                  table: {
                                    rows:  ['Fish',3,4,5,6,7,10]
                                  }

                              }

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
            index: 1,
            header: 'Freespins bonus game',
            body: {
                grid: {
                    gridTemplateRows: '33.33% 33.33% 33.33%',
                    gridTemplateColumns: '50% 50%',
                },
                cards: [
                    {
                        type: 'image-instance',
                        index: 0,
                        description: {
                            position: {
                                rows: [1, 4],
                                columns: [1, 2]
                            },
                            image: {
                                src: 'src/img/info/cannon.png'
                            }
                        }
                        
                    },
                    {
                        type: 'text-description',
                        index: 1,
                        description: {
                            position: {
                                rows: [1, 1],
                                columns: [2, 2]
                            },
                            content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
                            in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
                            Different amount of gifts increases multiplier(x6 maximum).`
                        }
                        
                    },
                    {
                        type: 'list-image',
                        index: 2,
                        description: {
                            position: {
                                rows: [2, 2],
                                columns: [2, 2]
                            },
                            content: [
                                '2 Gifts = x3 multiplier',
                                '3 Gifts = x4 multiplier',
                                '4 Gifts = x5 multiplier',
                                '5 Gifts = x6 multiplier',
                                '6 Gifts = x7 multiplier',
                            ],
                            image: {
                                src: 'src/img/info/small_cannon.png'
                            }
                        }
                        
                    },
                    {
                        type: 'image-list',
                        index: 3,
                        description: {
                            position: {
                                rows: [3, 3],
                                columns: [2, 2]
                            },
                            image:{
                                src: 'src/img/info/small_cannon.png'
                            },
                            content: [
                                'x3 = +21 Free spins',
                                'x3 = +22 Free spins',
                                'x3 = +23 Free spins',
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
            index:2,
            header: 'Bonus symbols',
            body: {
                grid: {
                    gridTemplateRows: '50% 50%',
                    gridTemplateColumns: '50% 50%',
                    alignItems: 'center'
                },
                cards: [
                    {
                        index: 0,
                        type: 'image-text',
                        description: {
                            position: {
                                rows: [1,3],
                                columns: [1, 1]
                            },
                            image: {
                                src: 'src/img/info/skull.png'
                            },
                            content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
                            in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
                            Different amount of gifts increases multiplier(x6 maximum).Starts by 3, 4,
                             5 Krampus bonus symbols. Every Krampus symbol 
                            in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree`
                        }
                        
                    },
                    {
                        type: 'image-text',
                        index: 1,
                        description: {
                            position: {
                                rows: [1, 1],
                                columns: [2, 2]
                            },
                            image: {
                                src: 'src/img/info/ship.png'
                            },
                            content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
                            in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
                            Different amount of gifts increases multiplier(x6 maximum).Starts by 3, 4,
                             5 Krampus bonus symbols.`
                        }
                       
                    },
                    {
                        type: 'image-text',
                        index: 2,
                        description: {
                            position: {
                                rows: [2, 2],
                                columns: [2, 2]
                            },
                            image: {
                                src: 'src/img/info/chest.png'
                            },
                            content: `Starts by 3, 4, 5 Krampus bonus symbols. Every Krampus symbol 
                            in FS bonus game gives +1 free spin and collects 1 gift from the X-mas tree. 
                            Different amount of gifts increases multiplier(x6 maximum).Starts by 3, 4,
                             5 Krampus bonus symbols.`
                        }
                        
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
            index:3,
            header: 'Winning bet lines',
            body: {
                grid: {
                    gridTemplateRows: '50% 50%',
                    gridTemplateColumns: '19% 19% 19% 19% 19%',
                    gridColumnGap:'1.25%',
                },
                cards: [
                    {
                        type: 'win-line',
                        index: 1,
                        description: {
                            index: 1,
                            position: null,
                            image: {
                                src: 'src/img/info/mini.png'
                            },
                            rows: 3,
                            columns: 5,
                            scheme: [10, 11, 12, 13, 14]
                        }
                        
                    },
                    {
                        type: 'win-line',
                        index: 2,
                        description: {
                            position: null,
                            index: 2,
                            image: {
                                src: 'src/img/info/mini.png'
                            },
                            rows: 3,
                            columns: 5,
                            scheme: [10, 11, 12, 13, 14]
                        }
                        
                    },
                    {
                        type: 'win-line',
                        index: 3,
                        description: {
                            position: null,
                            index: 3,
                            image: {
                                src: 'src/img/info/mini.png'
                            },
                            rows: 3,
                            columns: 5,
                            scheme: [0, 1, 2, 3, 4]
                        }
                        
                    },
                    {
                        type: 'win-line',
                        index: 4,
                        description: {
                            position: null,
                            index: 4,
                            image: {
                                src: 'src/img/info/mini.png'
                            },
                            rows: 3,
                            columns: 5,
                            scheme: [5, 6, 7, 8, 9]
                        }
                        
                    },
                    {
                        type: 'win-line',
                        index: 5,
                        description: {
                            position: null,
                            index: 5,
                            image: {
                                src: 'src/img/info/mini.png'
                            },
                            rows: 3,
                            columns: 5,
                            scheme: [0, 11, 6, 5, 8]
                        }
                        
                    },
                    {
                        type: 'win-line',
                        index: 6,
                        description: {
                            index: 6,
                            position: null,
                            image: {
                                src: 'src/img/info/mini.png'
                            },
                            rows: 3,
                            columns: 5,
                            scheme: [0, 11, 6, 5, 8]
                        }
                        
                    },
                    {
                        type: 'win-line',
                        index: 7,
                        description: {
                            index: 7,
                            position: null,
                            image: {
                                src: 'src/img/info/mini.png'
                            },
                            rows: 3,
                            columns: 5,
                            scheme: [0, 11, 6, 5, 8]
                        }
                        
                    },
                    {
                        type: 'win-line',
                        index: 8,
                        description: {
                            position: null,
                            index: 8,
                            image: {
                                src: 'src/img/info/mini.png'
                            },
                            rows: 3,
                            columns: 5,
                            scheme: [0, 11, 6, 5, 8]
                        }
                        
                    },
                    {
                        type: 'win-line',
                        index: 9,
                        description: {
                            position: null,
                            index: 9,
                            image: {
                                src: 'src/img/info/mini.png'
                            },
                            rows: 3,
                            columns: 5,
                            scheme: [0, 11, 6, 5, 8]
                        }
                        
                    },
                    {
                        type: 'win-line',
                        index: 10,
                        description: {
                            index: 10,
                            position: null,
                            image: {
                                src: 'src/img/info/mini.png'
                            },
                            rows: 3,
                            columns: 5,
                            scheme: [0, 11, 6, 5, 8]
                        }
                        
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
            index: 4,
            header: 'You can use hotkeys',
            body: {
                grid: {
                    gridTemplateRows: '50% 50%',
                    gridTemplateColumns: '100%'
                },
                cards: [
                    {
                        type: 'image-instance',
                        index: 0,
                        description: {
                            position: null,
                            image: {
                                src: 'src/img/info/control.png'
                            },
                        }
                        
                    },
                    {
                        type: 'image-instance',
                        index:1,
                        description: {
                            position: null,
                            image: {
                                src: 'src/img/info/panel.png'
                            },
                        }
                    },
                    
                ]
            },
            footer: [
                'Wins on bet line are payed only when you get a succession from the leftmost reel to the rightmost reel.',
                'Bet on the winning line is multiplied by the multiplier of the winning symbols.',
                'Malfunction Voids all pays and plays.'
            ]
        },
    ]
}

export default class InfoController {

    constructor({
    }) {

        this.config = defaultInfoData
        this.visible = false
        this.$ = new Subject()

        const self = this

        this.vm = new Vue({
            el: '#info',
            data () {
                return {
                    info: self.config,
                    visible: self.visible,
                }
            },

            mounted(){
                this.$on('close_info', val => {
                    self.close()
                    console.log(val)
                    self.$.next(val)
                })
                this.$on('page_changes', val => {
                    console.log(val)
                    self.$.next(val)
                })
            },

            render(h){
                return h (Info, 
                    {props: {
                        info: this.info,
                        visible: this.visible,
                    }}
                )
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
