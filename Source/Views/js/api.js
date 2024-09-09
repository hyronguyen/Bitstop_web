const URL = 'http://localhost:8080'; 


//login
async function apiLogin(user_name, user_password) {
  try {
    // Prepare the login payload
    const loginPayload = {
      user_name,
      user_password
    };

    // Make the POST request to the login endpoint using the specified format
    const response = await axios({
      method: 'POST',
      url: `${URL}/api/auth/login`,
      data: loginPayload
    });

    // Handle the successful response
    if (response.status === 200) {
      const { token } = response.data;  // Extract the token from the response
      console.log('Login successful!', token);

      // Optionally, you can store the token for later requests (e.g., in localStorage)
      localStorage.setItem('authToken', token);

      return token;
    }
  } catch (error) {
    // Handle errors, such as invalid credentials or server issues
    if (error.response) {
      console.error('Login failed:', error.response.data.message);
    } else {
      console.error('Error:', error.message);
    }
  }
}
