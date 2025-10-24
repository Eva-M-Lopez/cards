import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loginName, setLoginName] = useState('');
    const [loginPassword, setPassword] = useState('');

    async function doLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const obj = { login: loginName, password: loginPassword };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });
            
            const res = await response.json();

            if (res.id <= 0) {
                setMessage('User/Password combination incorrect');
            } else {
                const user = { 
                    firstName: res.firstName, 
                    lastName: res.lastName, 
                    id: res.id 
                };
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                navigate('/cards');
            }
        } catch (error) {
            alert(error instanceof Error ? error.toString() : 'An error occurred');
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo-container">
                    <div className="logo-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                        </svg>
                    </div>
                </div>
                <form onSubmit={doLogin}>
                    <div className="input-group">
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={loginName}
                            onChange={(e) => setLoginName(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={loginPassword}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    {message && <div className="error-message">{message}</div>}
                    <button type="submit" className="login-button">Log in</button>
                </form>
                <div className="additional-links">
                    <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
                    <div className="signup-link">
                        Don't have an account? <a href="/signup">Sign Up</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;