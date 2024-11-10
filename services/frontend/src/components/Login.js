import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../assets/EasyCoinN.png';
import Modal from './Modal';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setModalMessage('Por favor, preencha todos os campos.');
            setShowModal(true);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });
            const { token, userId } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            setToken(token);

            navigate('/home');
        } catch (error) {
            console.error('Erro de login:', error);
            setModalMessage('Credenciais inválidas.');
            setShowModal(true);
        }
    };

    useEffect(() => {
        if (!showModal) {
            setModalMessage('');
        }
    }, [showModal]);

    return (
        <div className="login-container">
            <Modal show={showModal} message={modalMessage} onClose={() => setShowModal(false)} />
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Logo" className="login-logo" />
                <h1>Login</h1>
                <input
                    type="text"
                    placeholder="E-mail"
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
