import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';

function App() {
  const [token, setToken] = useState(null);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={token ? <Navigate to="/home" /> : <Login setToken={setToken} />} 
        />
        <Route 
          path="/home" 
          element={token ? <Home token={token} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/register" 
          element={<Register />} 
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
