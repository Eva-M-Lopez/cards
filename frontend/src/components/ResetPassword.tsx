import { useState } from 'react';

function ResetPassword()
{
    const [message, setMessage] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const email = localStorage.getItem('reset_email') || '';

    function handleSetCode(e: any): void {
        setResetCode(e.target.value);
    }

    function handleSetNewPassword(e: any): void {
        setNewPassword(e.target.value);
    }

    function handleSetConfirmPassword(e: any): void {
        setConfirmPassword(e.target.value);
    }

    async function doReset(event: any): Promise<void> {
        event.preventDefault();
        
        if(newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if(newPassword.length < 6) {
            setMessage('Password must be at least 6 characters');
            return;
        }
        
        var obj = {
            email: email,
            resetCode: resetCode,
            newPassword: newPassword
        };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reset-password`,
                {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            if(res.error && res.error.length > 0) {
                setMessage(res.error);
            } else {
                setMessage('Password reset successful! Redirecting to login...');
                localStorage.removeItem('reset_email');
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
        <div className="reset-password-container">
            <div className="reset-password-card">
                <div className="logo-container">
                    <div className="logo-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                </div>
                <span id="inner-title">RESET PASSWORD</span>
                <p>Resetting password for: <strong>{email}</strong></p>
                <form onSubmit={doReset}>
                    <div className="input-group">
                        <input 
                            type="text" 
                            placeholder="Enter 6-digit code" 
                            value={resetCode}
                            onChange={handleSetCode}
                            maxLength={6}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="New Password" 
                            value={newPassword}
                            onChange={handleSetNewPassword}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="Confirm Password" 
                            value={confirmPassword}
                            onChange={handleSetConfirmPassword}
                            required
                        />
                    </div>
                    {message && <div className="error-message">{message}</div>}
                    <button type="submit" className="reset-password-button">Reset Password</button>
                </form>
                <div className="back-to-login">
                    <a href="/">Back to Login</a>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;