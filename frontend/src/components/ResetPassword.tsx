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
        <div id="resetPasswordDiv">
            <span id="inner-title">RESET PASSWORD</span><br />
            <p>Resetting password for: <strong>{email}</strong></p>
            <input 
                type="text" 
                placeholder="Enter 6-digit code" 
                onChange={handleSetCode}
                maxLength={6}
            /><br />
            <input 
                type="password" 
                placeholder="New Password" 
                onChange={handleSetNewPassword}
            /><br />
            <input 
                type="password" 
                placeholder="Confirm Password" 
                onChange={handleSetConfirmPassword}
            /><br />
            <input 
                type="submit" 
                className="buttons" 
                value="Reset Password" 
                onClick={doReset} 
            />
            <span id="resetPasswordResult">{message}</span>
            <br /><br />
            <a href="/">Back to Login</a>
        </div>
    );
}

export default ResetPassword;