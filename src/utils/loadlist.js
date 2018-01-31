const preload = [
    { name: 'preload_bg',    url: 'preload/bg.jpg' },
    { name: 'preload_bar',   url: 'preload/bar.png' },
    { name: 'preload_light', url: 'preload/light.png' },
    { url: 'preload/preload.json' }
]

const common = [
    { url: 'machine/elements/elements.json' },
            
    { name: 'jack',   url: 'machine/elements/jack.json' },
    { name: 'queen',  url: 'machine/elements/queen.json' },
    { name: 'king',   url: 'machine/elements/king.json' },
    { name: 'ace',    url: 'machine/elements/ace.json' },
    { name: 'rabbit', url: 'machine/elements/rabbit.json' },
    { name: 'mouse',  url: 'machine/elements/mouse.json' },
    { name: 'owl',    url: 'machine/elements/owl.json' },
    { name: 'cat',    url: 'machine/elements/cat.json' },
    { name: 'wild',   url: 'machine/elements/wild.json' },
    { name: 'bonus',  url: 'machine/elements/bonus.json' },
    { name: 'pig',    url: 'machine/elements/pig.json' },

    { url: 'footer/buttons.json' },
    { url: 'machine/numbers.json' },
    
    { name: 'logo',       url: 'machine/logo.json' },
    { name: 'splash',     url: 'machine/splash.json' },

    { name: 'tile',       url: 'machine/tile.png' },
    { name: 'frame',      url: 'machine/frame.png' },
    { name: 'win_table',  url: 'machine/win_table.png' },
    { name: 'win_circle', url: 'machine/win_circle.png' },

    //transition
    { name: 'transition', url:'transition/transition.json'},
    //{ url: 'preload/preload.json' },

    // fs
    { name: 'count_fs', url: 'fs/count_fs.png' },
    { name: 'multi_fs', url: 'fs/multi_fs.png' },
    { name: 'bitmap', url:'transition/bitmap-export.xml'},
    { name: 'fs_collector', url:'transition/logo.json'},
]

const mobile = [
    { url: 'mobile/buttons.json' },
    { url: 'mobile/settings.json' },
]

const desktop = [
    { url: 'machine/buttons.json' },
    { name: 'panel',      url: 'machine/panel.json' },
    { name: 'spin',       url: 'machine/button.json' },
    { name: 'panel_root', url: 'machine/panel_root.png' },
    { name: 'panel_fs',   url: 'machine/panel_fs.png' }
]

const sprites = [
    // Music
    { name: 'init', start: '0.00.000', end: '0.28.804', loop: true, type: 'music', volume: 0.25 },
    { name: 'main', start: '0.28.804', end: '1.18.360', loop: true, type: 'music', volume: 0.35 },
    { name: 'fs',   start: '1.18.360', end: '1.52.250', loop: true, type: 'music' },
    { name: 'in',   start: '1.52.250', end: '2.01.852', loop: true, type: 'music' },
    { name: 'out',  start: '2.01.852', end: '2.11.467', loop: true, type: 'music' },
    // Effects
    { name: 'wheel', start: '2.11.467', end: '2.14.475', type: 'effects' },
    { name: 'win_1', start: '2.14.475', end: '2.16.407', type: 'effects' },
    { name: 'win_2', start: '2.16.407', end: '2.18.346', type: 'effects' },
    { name: 'click_1', start: '2.18.346', end: '2.18.598', type: 'effects' },
    { name: 'click_2', start: '2.18.598', end: '2.18.875', type: 'effects' },
    // Thunders
    { name: 'el_1', start: '2.18.875', end: '2.19.012', type: 'effects' },
    { name: 'el_2', start: '2.19.012', end: '2.19.150', type: 'effects' },
    { name: 'el_3', start: '2.19.150', end: '2.19.287', type: 'effects' },
    // Animals
    { name: 'cat_show',    start: '2.19.287', end: '2.21.649', type: 'effects' },
    { name: 'cat_win',     start: '2.21.649', end: '2.23.979', type: 'effects' },
    { name: 'mouse_show',  start: '2.23.979', end: '2.26.283', type: 'effects' },
    { name: 'mouse_win',   start: '2.26.283', end: '2.28.999', type: 'effects' },
    { name: 'owl_show',    start: '2.28.999', end: '2.29.941', type: 'effects' },
    { name: 'owl_win',     start: '2.29.941', end: '2.32.893', type: 'effects' },
    { name: 'pig_oink',    start: '2.32.893', end: '2.32.976', type: 'effects' },
    { name: 'pig_1',       start: '2.32.976', end: '2.33.184', type: 'effects' },
    { name: 'pig_2',       start: '2.33.184', end: '2.33.426', type: 'effects' },
    { name: 'rabbit_show', start: '2.33.426', end: '2.34.419', type: 'effects' },
    { name: 'rabbit_win',  start: '2.34.419', end: '2.23.979', type: 'effects' },
]

export {
    preload,
    common,
    mobile,
    desktop,
    sprites
}