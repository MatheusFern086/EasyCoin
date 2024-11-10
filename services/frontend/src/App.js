import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import Plano from './components/Plano';
import FormaPagamento from './components/FormaPagamento';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('Token armazenado:', storedToken);
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={token ? <Navigate to="/home" /> : <Login setToken={setToken} />} 
        />
        <Route 
          path="/home" 
          element={token ? <Home token={token} setToken={setToken} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/register" 
          element={<Register />} 
        />
        <Route 
          path="/plano" 
          element={<Plano />} 
        />
        <Route 
          path="/formaPagamento" 
          element={<FormaPagamento />} 
        />
        <Route 
          path="*" 
          element={<Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
