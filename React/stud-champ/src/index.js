import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './pages/homePage/HomePage';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './security/AuthProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

ReactDOM.render(
    <Router>
        <AuthProvider>
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </AuthProvider>
    </Router>,
    document.getElementById('root')
);

reportWebVitals();