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
            //const response = await fetch('http://68.183.171.109/api/signup',
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
        <div id="signupDiv">
            <span id="inner-title">CREATE ACCOUNT</span><br />
            <input type="text" placeholder="First Name" onChange={handleSetFirstName} /><br />
            <input type="text" placeholder="Last Name" onChange={handleSetLastName} /><br />
            <input type="email" placeholder="Email" onChange={handleSetEmail} /><br />
            <input type="text" placeholder="Username" onChange={handleSetLogin} /><br />
            <input type="password" placeholder="Password" onChange={handleSetPassword} /><br />
            <input type="submit" className="buttons" value="Sign Up" onClick={doSignup} />
            <span id="signupResult">{message}</span>
        </div>
    );
}

export default Signup;