import { useState, useRef } from 'react';
import LoggedInName from './LoggedInName';

function Profile() {
    const [activeTab, setActiveTab] = useState('info');
    const [message, setMessage] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Get user data
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    
    // User info states
    const [firstName, setFirstName] = useState(userData.firstName || '');
    const [lastName, setLastName] = useState(userData.lastName || '');
    const [email, setEmail] = useState(userData.email || '');
    const [username, setUsername] = useState(userData.username || '');    
    
    // Password states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function handleImageClick() {
        fileInputRef.current?.click();
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
                setMessage('Profile picture updated!');
                setTimeout(() => setMessage(''), 3000);
            };
            reader.readAsDataURL(file);
        }
    }

    async function handleUpdateInfo(e: React.FormEvent) {
        e.preventDefault();
        
        const obj = {
            userId: userData.id,
            firstName: firstName,
            lastName: lastName,
            email: email
        };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/update-profile`, {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });
            
            const res = await response.json();

            if (res.error) {
                setMessage(res.error);
            } else {
                // Update localStorage
                const updatedUser = {
                    ...userData,
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                };
                localStorage.setItem('user_data', JSON.stringify(updatedUser));
                setMessage('Profile updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            setMessage('Failed to update profile');
        }
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters');
            return;
        }

        const obj = {
            userId: userData.id,
            currentPassword: currentPassword,
            newPassword: newPassword
        };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/change-password`, {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });
            
            const res = await response.json();

            if (res.error) {
                setMessage(res.error);
            } else {
                setMessage('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            setMessage('Failed to change password');
        }
    }

    return (
        <div className="profile-page">
            <LoggedInName />
            
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-image-container" onClick={handleImageClick}>
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="profile-image" />
                            ) : (
                                <div className="profile-image-placeholder">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            )}
                            <div className="profile-image-overlay">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                    <circle cx="12" cy="13" r="4"></circle>
                                </svg>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <h2 className="profile-name">{firstName} {lastName}</h2>
                        <p className="profile-subtitle">Manage your account settings</p>
                    </div>

                    <div className="profile-tabs">
                        <button 
                            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
                            onClick={() => setActiveTab('info')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            User Info
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
                            onClick={() => setActiveTab('password')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Password
                        </button>
                    </div>

                    <div className="profile-content">
                        {activeTab === 'info' && (
                            <div className="tab-content">
                                <h3 className="content-title">Personal Information</h3>
                                <form onSubmit={handleUpdateInfo}>
                                    <div className="input-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="username"
                                            disabled
                                        />
                                        <small className="input-note">Username cannot be changed</small>
                                    </div>
                                    {message && <div className="result-message">{message}</div>}
                                    <button type="submit" className="action-button">
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <div className="tab-content">
                                <h3 className="content-title">Change Password</h3>
                                <form onSubmit={handleChangePassword}>
                                    <div className="input-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {message && <div className="result-message">{message}</div>}
                                    <button type="submit" className="action-button">
                                        Update Password
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;