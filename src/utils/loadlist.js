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

export {
    preload,
    common,
    mobile,
    desktop
}