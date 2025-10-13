import  { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Verify()
{
    const navigate = useNavigate();
    const location = useLocation();
    const login = location.state?.login || '';
    const [message, setMessage] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

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
                setTimeout(() => {
                    navigate('/');
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
            <p>A verification code has been sent to your email.</p>
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