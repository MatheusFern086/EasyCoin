const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
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
        console.log('Resposta da API:', response.data); // Verifique o formato da resposta
        if (response.data && response.data.rates) {
            const rates = response.data.rates;
            const rateFrom = rates[from.toUpperCase()];
            const rateTo = rates[to.toUpperCase()];
    
            if (!rateFrom || !rateTo) {
                return res.status(404).send('Moeda não encontrada.');
            }
    
            const convertedAmount = (amount / rateFrom) * rateTo;
            res.json({ from, to, amount, convertedAmount, rate: rateTo });
        } else {
            console.error('A resposta da API não contém os dados esperados.');
            res.status(500).send('Erro na resposta da API.');
        }
    } catch (error) {
        console.error('Erro ao converter moeda:', error);
        res.status(500).send('Erro ao converter moeda.');
    }
});

app.listen(PORTA, () => {
    console.log(`Currency service rodando na porta ${PORTA}`);
});
