import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const Home = ({ token }) => {
    const [currencies, setCurrencies] = useState([]);
    const [cryptoCurrencies, setCryptoCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [selectedCrypto, setSelectedCrypto] = useState('');
    const [convertedAmount, setConvertedAmount] = useState(null);

    useEffect(() => {
        const fetchCurrencies = async () => {
            const response = await axios.get('https://api.exchangeratesapi.io/latest');
            setCurrencies(Object.keys(response.data.rates));
        };

        const fetchCryptoCurrencies = async () => {
            const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
            setCryptoCurrencies(response.data.map(coin => coin.id));
        };

        fetchCurrencies();
        fetchCryptoCurrencies();
    }, []);

    const handleConvert = async () => {
        const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=${selectedCurrency}`);
        const rate = response.data.rates[selectedCrypto.toUpperCase()];
        setConvertedAmount(rate);
    };

    return (
        <div className="home-container">
            <h1>Conversor de Moedas</h1>
            <select onChange={(e) => setSelectedCurrency(e.target.value)}>
                <option value="">Selecione uma Moeda</option>
                {currencies.map((currency) => (
                    <option key={currency} value={currency}>{currency}</option>
                ))}
            </select>

            <select onChange={(e) => setSelectedCrypto(e.target.value)}>
                <option value="">Selecione uma Cryptomoeda</option>
                {cryptoCurrencies.map((crypto) => (
                    <option key={crypto} value={crypto}>{crypto}</option>
                ))}
            </select>

            <button onClick={handleConvert}>Converter</button>

            {convertedAmount && (
                <p>Valor Convertido: {convertedAmount}</p>
            )}
        </div>
    );
};

export default Home;
