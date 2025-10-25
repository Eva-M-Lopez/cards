import { useState } from 'react';

function Signup()
{
    
    const [message, setMessage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    function handleSetFirstName(e: any): void {
        setFirstName(e.target.value);
    }

    function handleSetLastName(e: any): void {
        setLastName(e.target.value);
    }

    function handleSetEmail(e: any): void {
        setEmail(e.target.value);
    }

    function handleSetLogin(e: any): void {
        setLogin(e.target.value);
    }

    function handleSetPassword(e: any): void {
        setPassword(e.target.value);
    }

    async function doSignup(event: any): Promise<void> {
        event.preventDefault();
        
        var obj = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            login: login,
            password: password
        };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`,
                {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            if(res.error && res.error.length > 0) {
                setMessage(res.error);
            } else {
                setMessage('Account created! Redirecting to verification...');
                // Store the login name in localStorage so verify page can access it
                localStorage.setItem('pending_verification', login);
                setTimeout(() => {
                    window.location.href = '/verify';
                }, 2000);
            }
        }
        catch(error: any) {
            setMessage(error.toString());
        }
    }

    return(
        <div className="signup-container">
            <div className="signup-card">
                <div className="logo-container">
                    <div className="logo-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                    </div>
                </div>
                <span id="inner-title">CREATE ACCOUNT</span>
                <form onSubmit={doSignup}>
                    <div className="input-group">
                        <input 
                            type="text" 
                            placeholder="First Name" 
                            value={firstName}
                            onChange={handleSetFirstName}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="text" 
                            placeholder="Last Name" 
                            value={lastName}
                            onChange={handleSetLastName}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={handleSetEmail}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={login}
                            onChange={handleSetLogin}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={handleSetPassword}
                            required 
                        />
                    </div>
                    {message && <div className="error-message">{message}</div>}
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>
                <div className="login-link">
                    Already have an account? <a href="/">Log In</a>
                </div>
            </div>
        </div>
    );
}

export default Signup;