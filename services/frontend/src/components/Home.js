import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; 
import logo from '../assets/EasyCoinN.png';
import { Link, useNavigate } from 'react-router-dom';

const Home = ({ token, setToken }) => {
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [cryptoCurrencies, setCryptoCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [selectedCrypto, setSelectedCrypto] = useState('');
    const [amount, setAmount] = useState('');
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [conversionType, setConversionType] = useState('moeda'); 
    
    useEffect(() => {
        console.log('Token atual:', token);
        
        if (!token) {
            navigate('/login'); 
        } else {
            const fetchUserPlan = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/plan', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log('Plano do usuário:', response.data.plan);
                    setPlan(response.data.plan);
                } catch (error) {
                    console.error('Erro ao buscar o plano do usuário:', error);
                    setPlan('Free');
                }
            };

            const fetchCurrencies = async () => {
                try {
                    const apiKey = 'e695db0faff3464aad5697e7dcf62364'; 
                    const response = await axios.get(`https://openexchangerates.org/api/currencies.json?app_id=${apiKey}`);
                    
                    if (response.data) {
                        const currencyArray = Object.entries(response.data); 
                        setCurrencies(currencyArray); // Agora você tem um array com siglas e nomes
                    } else {
                        console.error('A resposta da API não contém os dados esperados.');
                    }
                } catch (error) {
                    console.error('Erro ao buscar as moedas:', error);
                }
            };

            const fetchCryptoCurrencies = async () => {
                try {
                    const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
                    if (response.data) {
                        setCryptoCurrencies(response.data.map(coin => coin.id));
                    } else {
                        console.error('A resposta da API não contém os dados esperados.');
                    }
                } catch (error) {
                    console.error('Erro ao buscar as criptomoedas:', error);
                }
            };

            fetchUserPlan();
            fetchCurrencies();
            fetchCryptoCurrencies();
        }
    }, [token, navigate]);

    const handleConvert = async () => {
        try {
            let rate;
            if (conversionType === 'moeda') {
                const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=${selectedCurrency}`);
                rate = response.data.rates[selectedCrypto.toUpperCase()];
            } else if (conversionType === 'cripto') {
                const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto}&vs_currencies=usd`);
                rate = response.data[selectedCrypto].usd;
            }
            setConvertedAmount(rate * amount);
        } catch (error) {
            console.error('Erro ao converter:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);                   
        navigate('/login', { replace: true });
    };

    if (!plan) {
        return <div>Carregando plano...</div>;
    }

    return (
        <div className="home-container">
            <div>
                <img src={logo} alt="EasyCoin Logo" className="logo" />
                <h1>Conversor de Moedas</h1>
                <p>Conversões restantes: {plan === 'Free' ? '3' : '∞'}</p>

                <div className="conversion-type">
                    <label className="radio-label">
                        <input 
                            type="radio" 
                            value="moeda" 
                            checked={conversionType === 'moeda'} 
                            onChange={() => setConversionType('moeda')} 
                            className="radio-input"
                        />
                        Moedas Físicas
                    </label>
                    <label className="radio-label">
                        <input 
                            type="radio" 
                            value="cripto" 
                            checked={conversionType === 'cripto'} 
                            onChange={() => setConversionType('cripto')} 
                            className="radio-input"
                        />
                        Criptomoedas
                    </label>
                </div>

                {conversionType === 'moeda' && (
                    <select 
                        onChange={(e) => setSelectedCurrency(e.target.value)} 
                        className="input-field dropdown-fixed"
                    >
                        <option value="">Selecione uma Moeda</option>
                        {currencies.map(([code, name]) => (
                            <option key={code} value={code}>
                                {code} - {name}
                            </option>
                        ))}
                    </select>
                )}

                {conversionType === 'cripto' && (
                    <select 
                        onChange={(e) => setSelectedCrypto(e.target.value)} 
                        className="input-field dropdown-fixed"
                    >
                        <option value="">Selecione uma Criptomoeda</option>
                        {cryptoCurrencies.map((crypto) => (
                            <option key={crypto} value={crypto}>
                                {crypto}
                            </option>
                        ))}
                    </select>
                )}

                <input 
                    type="number" 
                    placeholder="Digite o valor a ser convertido" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    className="input-field" 
                />

                {convertedAmount !== null && (
                    <div className="converted-amount">
                        <label>Valor Convertido: {convertedAmount.toFixed(2)}</label>
                    </div>
                )}

                <button onClick={handleConvert} className="convert-button">
                    Converter
                </button>

                <button onClick={handleLogout} className="convert-button">
                    Sair
                </button>

                {plan === 'Free' && (
                    <p>
                        <Link to="/plano" className="plan-link">
                            Seja Pro e Converta ilimitadamente
                        </Link>
                    </p>
                )}

                {plan === 'Pro' && (
                    <p>
                        <Link to="/plano" className="plan-link">
                            Cancelar Plano Pro
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Home;
