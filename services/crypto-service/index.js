const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORTA = process.env.PORT;

// Endpoint para converter criptomoedas
app.get('/convert', async (req, res) => {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
        return res.status(400).send('Parâmetros "from", "to" e "amount" são necessários.');
    }

    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: from,
                vs_currencies: to
            }
        });

        if (response.data[from] && response.data[from][to]) {
            const rate = response.data[from][to];
            const convertedAmount = rate * amount;
            res.json({ from, to, amount, convertedAmount, rate });
        } else {
            res.status(404).send('Moeda não encontrada.');
        }
    } catch (error) {
        res.status(500).send('Erro ao converter criptomoeda.');
    }
});

app.listen(PORTA, () => {
    console.log(`Crypto service rodando na porta ${PORTA}`);
});