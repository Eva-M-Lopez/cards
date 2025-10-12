import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import SignupPage from './pages/SignupPage';
import VerifyPage from './pages/VerifyPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignupPage/>}/>
                <Route path="/verify" element={<VerifyPage/>}/>
                <Route path="/cards" element={<CardPage/>}/>
                <Route path="*" element={<Navigate to="/" replace />}/>
            </Routes>
        </Router>
    );
}

export default App;