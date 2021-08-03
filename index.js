const request = require('request');
const url = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'
const express = require('express');
const app = new express()
const currse = ["UAH", "RUR", "USD", "EUR"]

app.use(express.json());


app.post('/curse', async (req, res) => {

    const sell = req.body[0].sell
    const buy = req.body[0].buy
    const mon = req.body[0].mon

    if (!+mon || !mon) res.send("Введите сумму")
    if (!currse.includes(sell) || !currse.includes(buy) || sell.length == 0 || buy.length == 0) {
        res.send(`Введите валюту с этого списка ${currse}`)
    }

    await request({ url: url, json: true }, async (err, { body }) => {
        if (sell == 'UAH') {
            let cashBuy = body.find(item => {
                if (item.ccy == buy) {
                    return item
                }
            })
            if (cashBuy) {
                let exchange = mon / cashBuy['buy']
                res.send(`Buy = ${exchange} ${cashBuy['ccy']}`)
            }
        } else if (sell == 'USD' || sell == 'EUR' || sell == 'RUR') {
            let cashSell = body.find(item => {
                if (item.ccy == sell) {
                    return item
                }
            })
            if (cashSell) {
                let exchange = mon * cashSell['buy']
                res.send(`Sell = ${exchange} UAH`)
            }
        }
    })

})



app.listen(3012, () => {
    console.log('server run')
})