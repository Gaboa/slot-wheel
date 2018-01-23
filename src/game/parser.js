class ParserManager {

    constructor({
        game
    }) {
        this.game = game
        this.state = game.state
        this.data = game.data
    }

    init(res) {
        this.data.sid = res.SessionID
        this.data.lines = res.Lines.map(line => line.map(el => ({ x: el.X, y: el.Y })))
        this.data.symbols = res.Symbols.map(s => ({ name: s.Name.toLowerCase(), symbol: Number(s.Symbol) }))
        this.data.screen = res.FirstScreen.map(r => r.map(el => ({ type: this.game.state.settings.isLowQuality ? 'static' : 'spine', el })))

        this.data.balance.currency = this.currency(res.Balance.Currency)

        this.data.balance.level.arr = res.Balance.BetLevel
        this.data.balance.level.current = res.Balance.BetLevel[0]
        this.data.balance.level.index = 0
        this.data.balance.value.arr = res.Balance.CoinValue
        this.data.balance.value.current = res.Balance.CoinValue[0]
        this.data.balance.value.index = 0

        this.data.balance.coin.sum = res.Balance.ScoreCoins
        this.data.balance.coin.bet = this.data.lines.length * this.data.balance.level.current
        this.data.balance.coin.win = 0
        this.data.balance.cash.sum = res.Balance.ScoreCents / 100
        this.data.balance.cash.bet = this.data.balance.coin.bet * this.data.balance.value.current / 100
        this.data.balance.cash.win = 0

        this.fr(res.FreeRounds)
        this.roll(res.LastResult)
    }

    fr(data) {
        if (!data) return null
        this.data.balance.level.index = this.data.balance.level.arr.indexOf(data.BetLevel[0])
        this.data.balance.value.index = this.data.balance.value.arr.indexOf(data.CoinValue[0])

        this.data.fr.count = data.countFR - data.playedFR
        this.data.fr.win.coin = data.FRWinCoins
        this.data.fr.win.cash = data.FRWinCents / 100
    }
    
    roll(res) {
        if (!res) return null        
        this.data.screen = res.Screen.map(r => r.map(el => ({ type: this.game.state.settings.isLowQuality ? 'static' : 'spine', el })))
        
        this.state.mode = res.Mode
        this.state.next = res.NextMode

        // Win Lines
        if (res.WinLines) {
            this.data.win.lines = res.WinLines.map(l => ({ number: l.Line, amount: l.Count, win: l.Win }))
            this.data.balance.coin.win = res.Balance.TotalWinCoins
            this.data.balance.cash.win = res.Balance.TotalWinCents / 100
        }

        if (this.data.balance.level.index !== this.data.balance.level.arr.indexOf(res.Balance.BetLevel))
            this.data.balance.level.index = this.data.balance.level.arr.indexOf(res.Balance.BetLevel)
        if (this.data.balance.value.index !== this.data.balance.value.arr.indexOf(res.Balance.CoinValue))
            this.data.balance.value.index = this.data.balance.value.arr.indexOf(res.Balance.CoinValue)

        this.data.balance.coin.sum = res.Balance.ScoreCoins
        this.data.balance.cash.sum = res.Balance.ScoreCents / 100

        this.fs(res)
        this.fr(res.FreeRounds)
    }

    fs(res) {
        if (res.FsBonus) {
            this.data.fs.count.current = res.FsBonus.CountFS
            this.data.fs.count.win = res.FreeSpinsWin
            this.data.fs.level = res.FsBonus.Level
            this.data.fs.win.coin = res.FsBonus.TotalFSWinCoins
            this.data.fs.win.cash = res.FsBonus.TotalFSWinCents / 100
            this.data.fs.bonus.coin = res.FsBonus.BonusWinCoins
            this.data.fs.bonus.cash = res.FsBonus.BonusWinCents / 100
        }
        else {
            if (res.FreeSpinsWin) this.data.fs.count.current = res.FreeSpinsWin
            if (res.NextMode.indexOf('fsBonus') !== -1) this.data.fs.multi = +res.NextMode.slice(-1) + 1
        }
    }

    currency(value) {
        switch (value.toUpperCase()) {
            case 'USD':
                return '$'
            case 'CNS':
                return '$'
            case 'EUR':
                return '€'
            case 'UAH':
                return '₴'
            case 'RUB':
                return '₽'
            default:
                return str
        }
    }

}

export { ParserManager }