import { useState } from 'react';

function Verify()
{
    const [message, setMessage] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    
    // Get login from localStorage instead of router state
    const login = localStorage.getItem('pending_verification') || '';

    function handleSetCode(e: any): void {
        setVerificationCode(e.target.value);
    }

    async function doVerify(event: any): Promise<void> {
        event.preventDefault();
        
        var obj = {
            login: login,
            verificationCode: verificationCode
        };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verify`,
                {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            if(res.error && res.error.length > 0) {
                setMessage(res.error);
            } else {
                setMessage('Email verified! Redirecting to login...');
                localStorage.removeItem('pending_verification');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }
        }
        catch(error: any) {
            setMessage(error.toString());
        }
    }

    return(
        <div className="verify-container">
            <div className="verify-card">
                <div className="logo-container">
                    <div className="logo-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12l2 2 4-4"></path>
                            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                            <path d="M3 12v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"></path>
                        </svg>
                    </div>
                </div>
                <span id="inner-title">VERIFY YOUR EMAIL</span>
                <p>A verification code has been sent. Check the backend terminal for the code.</p>
                <p>Verifying account: <strong>{login}</strong></p>
                <form onSubmit={doVerify}>
                    <div className="input-group">
                        <input 
                            type="text" 
                            placeholder="Enter 6-digit code" 
                            value={verificationCode}
                            onChange={handleSetCode}
                            maxLength={6}
                            required
                        />
                    </div>
                    {message && <div className="error-message">{message}</div>}
                    <button type="submit" className="verify-button">Verify</button>
                </form>
                <div className="back-to-login">
                    <a href="/">Back to Login</a>
                </div>
            </div>
        </div>
    );
}

export default Verify;