const request = require('request');
const url = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'
const express = require('express');
const app = new express()

app.use(express.json());


// Возможные валюты USD RUR EUR

app.post('/curse', async (req, res) => {
    await request({ url: url, json: true }, async (err, { body }) => {
        if (req.body[0].sell.length == 0 || req.body[0].buy.length == 0) res.send("Need valuta")
        else if (req.body[0].sell || req.body[0].sell == 'BTC') res.send('УСТАЛ ДУМАТЬ')
        else if (req.body[0].sell == 'UAH') {
            let cashBuy = body.find(item => {
                if (item.ccy == req.body[0].buy) {
                    return item
                }
            })
            if (!cashBuy) res.send(`Нет такой валюты ${req.body[0].buy}`)
            if (cashBuy) {
                let exchange = req.body[0].mon / cashBuy['buy']
                res.send(`Buy = ${exchange} ${cashBuy['ccy']}`)
            }
        } else if (req.body[0].sell == 'USD' || 'EUR' || 'RUR') {
            let cashSell = body.find(item => {
                if (item.ccy == req.body[0].sell) {
                    return item
                }
            })
            if (!cashSell) res.send(`Нет такой валюты ${req.body[0].sell}`)
            if (cashSell) {
                let exchange = req.body[0].mon * cashSell['buy']
                res.send(`Sell = ${exchange} UAH`)
            }
        }
    })

})



app.listen(3012, () => {
    console.log('server run')
})