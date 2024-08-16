import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';
import logo from '../assets/EasyCoinN.png';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });
            setToken(response.headers['authorization']);
        } catch (error) {
            console.error('Senha inválida');
        }
    };

    return (
        <div className="login-container">
            
            <form onSubmit={handleSubmit}>
            <img src={logo} alt="Logo" className="login-logo" />
            <h1>Login</h1>
                <input
                    type="text"
                    placeholder="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                />
                <button type="submit" className="login-button">Login</button>
            </form>
            <p>Não tem cadastro? <Link to="/register" className="register-link">Registre-se aqui</Link></p>
        </div>
    );
};

export default Login;