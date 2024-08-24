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

        console.log('Token recebido na Home:', token);

        const fetchCurrencies = async () => {
            try {
                const response = await axios.get('https://api.exchangeratesapi.io/latest', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCurrencies(Object.keys(response.data.rates));
            } catch (error) {
                console.error('Erro ao buscar moedas:', error);
            }
        };

        const fetchCryptoCurrencies = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/list', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCryptoCurrencies(response.data.map(coin => coin.id));
            } catch (error) {
                console.error('Erro ao buscar criptomoedas:', error);
            }
        };

        fetchCurrencies();
        fetchCryptoCurrencies();
    }, [token]);

    const handleConvert = async () => {
        try {
            const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=${selectedCurrency}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const rate = response.data.rates[selectedCrypto.toUpperCase()];
            setConvertedAmount(rate);
        } catch (error) {
            console.error('Erro ao converter moeda:', error);
        }
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
                <option value="">Selecione uma Criptomoeda</option>
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
