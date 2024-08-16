import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importe o hook useNavigate
import './Register.css';
import logo from '../assets/EasyCoinN.png';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  // Inicialize o hook useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register', {
                username,
                password,
            });
            alert('Registrado com sucesso');
            navigate('/login');  // Navega para a tela de login
        } catch (error) {
            console.error('Erro ao registrar usuário', error);
            alert('Erro ao Registrar');
        }
    };

    const handleBack = () => {
        navigate('/login');  // Navega para a tela de login ao clicar no botão "Voltar"
    };

    return (
        <div className="register-container">
            <img src={logo} alt="Logo" className="register-logo" />
            <h1>Registrar</h1>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="register-button">Registrar</button>
                <button type="button" className="register-button" onClick={handleBack}>Voltar</button>
            </form>
        </div>
    );
};

export default Register;
