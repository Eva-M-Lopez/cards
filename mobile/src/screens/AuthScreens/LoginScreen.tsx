const handleLogin = async () => {
  try {
    const response = await login(email, password);
    
    if (response.success) {
      // Save token securely
      await SecureStore.setItemAsync('userToken', response.token);
      
      // Navigate to Cards Page
      navigation.replace('Cards');
    } else {
      setError(response.message || 'Login failed');
    }
  } catch (err) {
    setError('An error occurred during login');
  }
};