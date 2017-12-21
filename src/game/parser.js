// TODO: Add methods for parsing init data
// TODO: Add methods for parsing saved data
// TODO: Add methods for parsing roll data

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
        this.data.screen = res.FirstScreen.map(r => r.map(el => ({ type: 'static', el })))

        this.data.balance.currency = this.currency(res.Balance.Currency)

        this.data.balance.level.arr = res.Balance.CoinValue
        this.data.balance.level.current = res.Balance.CoinValue[0]
        this.data.balance.level.index = 0
        this.data.balance.value.arr = res.Balance.BetLevel
        this.data.balance.value.current = res.Balance.BetLevel[0]
        this.data.balance.value.index = 0

        this.data.balance.coin.sum = res.Balance.ScoreCoins
        this.data.balance.coin.bet = this.data.lines.length * this.data.balance.level.current
        this.data.balance.coin.win = 0
        this.data.balance.cash.sum = res.Balance.ScoreCents / 100
        this.data.balance.cash.bet = this.data.balance.coin.bet * this.data.balance.value.current / 100
        this.data.balance.cash.win = 0

        this.last(res.LastResult)
    }
    
    roll(res) {
        this.data.screen = res.Screen.map(r => r.map(el => ({ type: 'static', el })))
        
    }

    last() {

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