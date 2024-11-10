import React, { useState, useEffect } from 'react';
import './Plano.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/EasyCoinN.png';
import Modal from './Modal';

const Plano = () => {
    const [selectedPlan, setSelectedPlan] = useState('Pro');
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState('');
    const [redirectAfterModal, setRedirectAfterModal] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handlePlanSelection = (e) => {
        setSelectedPlan(e.target.value);
    };

    const handleSelect = async () => {
        const userId = localStorage.getItem('userId'); 
        const token = localStorage.getItem('token'); 

        // Verifica o plano atual do usuário
        const currentPlan = localStorage.getItem('currentPlan'); 

        try {
            if (currentPlan === 'Free' && selectedPlan === 'Pro') {
                navigate('/formapagamento');
            } else {
                // Caso contrário, atualiza o plano diretamente
                const response = await fetch('http://localhost:5000/updateplan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id: userId,
                        plan: selectedPlan === 'Free' ? 1 : 2
                    })
                });

                if (response.ok) {
                    setModalMessage(`Plano ${selectedPlan} selecionado com sucesso!`);
                    setShowModal(true);
                    setRedirectAfterModal(true);

                    // Atualiza o plano atual armazenado localmente
                    localStorage.setItem('currentPlan', selectedPlan);
                } else {
                    setModalMessage('Erro ao selecionar o plano. Tente novamente.');
                    setShowModal(true);
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar o plano:', error);
            setModalMessage('Erro ao atualizar o plano. Tente novamente mais tarde.');
            setShowModal(true);
        }
    };

    const handleBack = () => {
        navigate('/home');
    };

    useEffect(() => {
        if (showModal && redirectAfterModal) {
            const timer = setTimeout(() => {
                navigate('/home');
            }, 2000); 

            return () => clearTimeout(timer); 
        }
    }, [showModal, redirectAfterModal, navigate]);

    return (
        <div className="plano-container">
            <Modal show={showModal} message={modalMessage} onClose={() => setShowModal(false)} />
            <img src={logo} alt="EasyCoin Logo" className="plano-logo" />
            <h1>Selecione seu plano</h1>

            <div className="plano-options">
                <label className={`plano-option ${selectedPlan === 'Free' ? 'active' : ''}`}>
                    <input 
                        type="radio" 
                        name="plan" 
                        value="Free" 
                        className="radio-input"
                        checked={selectedPlan === 'Free'}
                        onChange={handlePlanSelection} 
                    />
                    Free - R$ 0,00 Mensais
                </label>
                <label className={`plano-option ${selectedPlan === 'Pro' ? 'active' : ''}`}>
                    <input 
                        type="radio" 
                        name="plan" 
                        value="Pro" 
                        className="radio-input"
                        checked={selectedPlan === 'Pro'}
                        onChange={handlePlanSelection} 
                    />
                    Pro - R$ 20,00 Mensais
                </label>
            </div>

            <button className="select-button" onClick={handleSelect}>Selecionar</button>
            <button className="back-button" onClick={handleBack}>Voltar</button>
        </div>
    );
};

export default Plano;
