const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const cors = require('cors');
app.use(cors()); 
const PORTA = process.env.PORT;

const apiKey = process.env.OPEN_EXCHANGE_API_KEY ; 

// Endpoint para converter moedas tradicionais
app.get('/convert', async (req, res) => {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
        return res.status(400).send('Parâmetros "from", "to" e "amount" são necessários.');
    }

    try {
        const response = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${apiKey}`);
        console.log('Resposta da API OpenExchangeRates:', response.data);

        const rates = response.data.rates;
        const rateFrom = rates[from.toUpperCase()];
        const rateTo = rates[to.toUpperCase()];

        if (!rateFrom) {
            console.error(`Moeda de origem não encontrada: ${from}`);
            return res.status(404).send('Moeda de origem não encontrada.');
        }

        if (!rateTo) {
            console.error(`Moeda de destino não encontrada: ${to}`);
            return res.status(404).send('Moeda de destino não encontrada.');
        }

        const convertedAmount = (amount / rateFrom) * rateTo;
        res.json({ from, to, amount, convertedAmount, rate: rateTo });
    } catch (error) {
        console.error('Erro ao converter moeda:', error);
        res.status(500).send('Erro ao converter moeda.');
    }
});

app.listen(PORTA, () => {
    console.log(`Currency service rodando na porta ${PORTA}`);
});
