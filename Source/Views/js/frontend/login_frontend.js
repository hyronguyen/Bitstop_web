document.addEventListener('DOMContentLoaded', () => {
  const authToken = localStorage.getItem('authToken'); 

  if (authToken) {
      window.location.href = 'index.html'; 
  }
});


// Form đăng nhập
document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault(); 
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  try {
    // tạo token từ apiLogin
      const token = await apiLogin(username, password);
      
      if (token) {
          console.log('Successfully logged in and token stored.');
          localStorage.setItem('authToken', token);
          window.location.href = 'index.html';
      }
  } catch (error) {
      console.error('Login failed:', error);
  }
});