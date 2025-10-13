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
            const response = await fetch('http://68.183.171.109/api/verify',
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
        <div id="verifyDiv">
            <span id="inner-title">VERIFY YOUR EMAIL</span><br />
            <p>A verification code has been sent. Check the backend terminal for the code.</p>
            <p>Verifying account: <strong>{login}</strong></p>
            <input 
                type="text" 
                placeholder="Enter 6-digit code" 
                onChange={handleSetCode}
                maxLength={6}
            /><br />
            <input type="submit" className="buttons" value="Verify" onClick={doVerify} />
            <span id="verifyResult">{message}</span>
        </div>
    );
}

export default Verify;