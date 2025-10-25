import { useState } from 'react';

function ForgotPassword()
{
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    function handleSetEmail(e: any): void {
        setEmail(e.target.value);
    }

    async function requestReset(event: any): Promise<void> {
        event.preventDefault();
        
        var obj = { email: email };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/request-password-reset`,
                {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            if(res.error && res.error.length > 0) {
                setMessage(res.error);
            } else {
                setMessage('Reset code sent! Check your email (or backend logs for testing).');
                localStorage.setItem('reset_email', email);
                setTimeout(() => {
                    window.location.href = '/reset-password';
                }, 2000);
            }
        }
        catch(error: any) {
            setMessage(error.toString());
        }
    }

    return(
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <div className="logo-container">
                    <div className="logo-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                            <line x1="2" y1="2" x2="22" y2="22"></line>
                        </svg>
                    </div>
                </div>
                <span id="inner-title">FORGOT PASSWORD</span>
                <p>Enter your email address to receive a reset code.</p>
                <form onSubmit={requestReset}>
                    <div className="input-group">
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email}
                            onChange={handleSetEmail}
                            required 
                        />
                    </div>
                    {message && <div className="error-message">{message}</div>}
                    <button type="submit" className="forgot-password-button">Send Reset Code</button>
                </form>
                <div className="back-to-login">
                    <a href="/">Back to Login</a>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;