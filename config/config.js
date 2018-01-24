module.exports = {
    // URL params. change gameName in buildURL and gameURL
    "serviceURL": "https://frontqa.bossgs.net/service",
    "buildURL": "/gamebuilds/themoney/",
    "devURL": "/games/themoney/",
    "version": "1_0",
    "major": "1",
    "prodDir": "prod",

    // Modes
    "modes": [
        {
            "name": "root", "mode": "themoney"
        },
        {
            "name": "fs", "mode": "themoneyfs"
        }
    ]
};