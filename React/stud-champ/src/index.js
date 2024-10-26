import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './pages/homePage/HomePage';
import SubjectPage from './pages/subjectPage/SubjectPage';
import ProjectPage from './pages/projectPage/ProjectPage';
import TeamPage from './pages/teamPage/TeamPage';
import ExternalHomePage from './pages/externalHomePage/ExternalHomePage';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './security/AuthProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './security/PrivateRoute';

ReactDOM.render(
    <Router>
        <AuthProvider>
            <Routes>
                <Route path="/" element={<ExternalHomePage />} />
                <Route path="/home" element={<PrivateRoute element={<HomePage />} />} />
                <Route path="/subjects/:subject_id" element={<PrivateRoute element={<SubjectPage />} />} />
                <Route path="/subjects/:subject_id/teams/:team_id" element={<PrivateRoute element={<TeamPage />} />} />
                <Route path="/subjects/:subject_id/teams/:team_id/projects/:project_id" element={<PrivateRoute element={<ProjectPage />} />} />
            </Routes>
        </AuthProvider>
    </Router>,
    document.getElementById('root')
);

reportWebVitals();