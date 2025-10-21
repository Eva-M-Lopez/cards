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
        <div id="forgotPasswordDiv">
            <span id="inner-title">FORGOT PASSWORD</span><br />
            <p>Enter your email address to receive a reset code.</p>
            <input 
                type="email" 
                placeholder="Email Address" 
                onChange={handleSetEmail} 
            /><br />
            <input 
                type="submit" 
                className="buttons" 
                value="Send Reset Code" 
                onClick={requestReset} 
            />
            <span id="forgotPasswordResult">{message}</span>
            <br /><br />
            <a href="/">Back to Login</a>
        </div>
    );
}

export default ForgotPassword;