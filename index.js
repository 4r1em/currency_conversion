const request = require('request');
const url = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'
const express = require('express');
const app = new express();
const currency = ["UAH", "RUR", "USD", "EUR"];
const uah = "UAH";

app.use(express.json());

app.post('/currency', async (req, res) => {

    const sell = req.body.sell;
    const buy = req.body.buy;
    const money = req.body.money;
    const findCurrency = (buy == uah) ? sell : buy;

    if (!+money || !money) return res.send("Enter the amount");
    if (!currency.includes(sell) || !currency.includes(buy) || !sell || !buy) {
        return res.send(`Enter the currency from this list ${currency}`);
    };
    if (buy === sell) return res.send("You cannot change the same currencies");

    if (buy !== uah && sell !== uah) return res.send("You must buy or sell UAH");


    await request({ url: url, json: true }, async (err, { body }) => {
        const cash = body.find(item => item.ccy == findCurrency);
        const sum = (buy == uah) ? cash.buy * money : money / cash.sale;
        return res.send(`${sum}`);
    })
})

app.listen(3020, () => {
    console.log('Server run')
})