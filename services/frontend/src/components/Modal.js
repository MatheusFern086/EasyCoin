import React from 'react';
import './Modal.css';

const Modal = ({ show, message, onClose }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p className='text-message'>{message}</p>
                <button className="modal-buttom" onClick={onClose}>Ok</button>
            </div>
        </div>
    );
};

export default Modal;
