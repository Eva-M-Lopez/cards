function LoggedInName()
{
    function getCurrentUserName() {
        var data;
        data = JSON.parse(localStorage.getItem('user_data') || '');
        return data.firstName + ' ' + data.lastName;
    }
    
    function goToProfile() {
        window.location.href = '/profile';
    }
    
    function goToHome() {
        window.location.href = '/cards';
    }
    
    function doLogout(event:any) : void
    {
        event.preventDefault();
        localStorage.removeItem('user_data');
        window.location.href = '/';
    };    
    
    return(
        <div className="logged-in-header">
            <div className="user-info">
                <div className="user-avatar" onClick={goToProfile}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <span className="user-name">Welcome, {getCurrentUserName()}</span>
            </div>
            <div className="header-actions">
                <button type="button" className="home-button" onClick={goToHome}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Home
                </button>
                <button type="button" className="logout-button" onClick={doLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16,17 21,12 16,7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Log Out
                </button>
            </div>
        </div>
    );
};
export default LoggedInName;