import React, { useState } from 'react';
import './FormaPagamento.css';
import logo from '../assets/EasyCoinN.png';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

const FormaPagamento = () => {
    const navigate = useNavigate();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Pix');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [redirectAfterModal, setRedirectAfterModal] = useState(false);

    const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const handleSelectClick = async () => {
        const userId = localStorage.getItem('userId'); 
        const token = localStorage.getItem('token'); 

        try {
            const response = await fetch('http://localhost:5000/updateplan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: userId,
                    plan: 2 
                })
            });

            if (response.ok) {
                setModalMessage(`Plano Pro ativado com sucesso! Forma de pagamento: ${selectedPaymentMethod}`);
                setShowModal(true);
                setRedirectAfterModal(true); 
                localStorage.setItem('currentPlan', 'Pro'); 
            } else {
                setModalMessage("Erro ao ativar o plano Pro. Tente novamente.");
                setShowModal(true);
            }
        } catch (error) {
            console.error('Erro ao atualizar o plano:', error);
            setModalMessage("Erro ao atualizar o plano. Tente novamente mais tarde.");
            setShowModal(true);
        }
    };

    const handleBackClick = () => {
        navigate('/plano');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (redirectAfterModal) {
            navigate('/home');
        }
    };

    return (
        <div className="payment-container">
            <Modal show={showModal} message={modalMessage} onClose={handleCloseModal} />
            <img src={logo} alt="EasyCoin Logo" className="logo" />
            <h2>Pagamento</h2>
            <div className="payment-amount">Valor: R$20,00 mensais</div>
            
            <div className="payment-method">
                <div className="pag-options">
                    <label className='plano-option'>
                        <input
                            type="radio"
                            value="Pix"
                            className='pay-radio-input'
                            checked={selectedPaymentMethod === 'Pix'}
                            onChange={handlePaymentMethodChange}
                        />
                        Pix
                    </label>
                    <label className='plano-option'>
                        <input
                            type="radio"
                            value="Cartão de Crédito"
                            className='pay-radio-input'
                            checked={selectedPaymentMethod === 'Cartão de Crédito'}
                            onChange={handlePaymentMethodChange}
                        />
                        Cartão de Crédito
                    </label>
                    <label className="plano-option">
                        <input
                            type="radio"
                            value="Cartão de Débito"
                            className='pay-radio-input'
                            checked={selectedPaymentMethod === 'Cartão de Débito'}
                            onChange={handlePaymentMethodChange}
                        />
                        Cartão de Débito
                    </label>
                </div>
            </div>
            
            <button onClick={handleSelectClick} className="select-button">
                Selecionar
            </button>
            <button onClick={handleBackClick} className="back-button">
                Voltar
            </button>
        </div>
    );
};

export default FormaPagamento;
