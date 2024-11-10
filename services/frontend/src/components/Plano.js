import React, { useState } from 'react';
import './Plano.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/EasyCoinN.png';

const Plano = () => {
    const [selectedPlan, setSelectedPlan] = useState('Pro');
    const navigate = useNavigate();

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
                    alert(`Plano ${selectedPlan} selecionado com sucesso!`);
                    // Atualiza o plano atual armazenado localmente
                    localStorage.setItem('currentPlan', selectedPlan);
                    navigate('/home'); 
                } else {
                    alert('Erro ao selecionar o plano. Tente novamente.');
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar o plano:', error);
            alert('Erro ao atualizar o plano. Tente novamente mais tarde.');
        }
    };

    const handleBack = () => {
        navigate('/home');
    };

    return (
        <div className="plano-container">
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
