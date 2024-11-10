import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import logo from '../assets/EasyCoinN.png';
import Modal from './Modal';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [redirectAfterModal, setRedirectAfterModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setModalMessage('Por favor, preencha todos os campos.');
            setShowModal(true);
            return;
        }

        try {
            await axios.post('http://localhost:5000/register', {
                username,
                password,
            });
            setModalMessage('Registrado com sucesso!');
            setShowModal(true);
            setRedirectAfterModal(true);
        } catch (error) {
            console.error('Erro ao registrar usuário', error);
            setModalMessage('Erro ao Registrar. Tente novamente.');
            setShowModal(true);
        }
    };

    const handleBack = () => {
        navigate('/login');
    };

    useEffect(() => {
        if (showModal && redirectAfterModal) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 2000); 

            return () => clearTimeout(timer);
        }
    }, [showModal, redirectAfterModal, navigate]);

    return (
        <div className="register-container">
            <Modal show={showModal} message={modalMessage} onClose={() => setShowModal(false)} />
            <img src={logo} alt="Logo" className="register-logo" />
            <h1>Registrar</h1>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="register-button">Registrar</button>
                <button type="button" className="register-button" onClick={handleBack}>Voltar</button>
            </form>
        </div>
    );
};

export default Register;
