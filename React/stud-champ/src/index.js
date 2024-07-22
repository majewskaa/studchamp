import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './pages/homePage/HomePage';
import SubjectPage from './pages/subjectPage/SubjectPage';
import TeamPage from './pages/teamPage/TeamPage';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './security/AuthProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

ReactDOM.render(
    <Router>
        <AuthProvider>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/subjects/:subject_id" element={<SubjectPage />} />
                <Route path="/subjects/:subject_id/teams/:team_id" element={<TeamPage />} />
            </Routes>
        </AuthProvider>
    </Router>,
    document.getElementById('root')
);

reportWebVitals();