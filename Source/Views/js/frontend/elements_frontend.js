
document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken'); // Check for the auth token

    if (!authToken) {
        window.location.href = 'login.html';
    }

    const decodedToken = jwt_decode(authToken);
    
    document.getElementById('userName').textContent = decodedToken.name || 'N/A';
    document.getElementById('userEmail').textContent = decodedToken.mail || 'N/A';
    document.getElementById('userID').textContent = decodedToken.id || 'N/A';
    document.getElementById('userFullName').textContent = decodedToken.fullname || 'N/A';
    document.getElementById('userAddress').textContent = decodedToken.address || 'N/A';
    document.getElementById('userRole').textContent = decodedToken.role || 'N/A';
    document.getElementById('userCredit').textContent = decodedToken.credit !== undefined ? decodedToken.credit : 'N/A';
    document.getElementById('userPhone').textContent = decodedToken.phone || 'N/A';
    document.getElementById('userSince').textContent = 'Account Creation Date'; // This might need to be updated based on your data
  
});


 // Logout button event listener
 const logoutButton = document.getElementById('logoutButton');
 if (logoutButton) {
     logoutButton.addEventListener('click', async () => {
         try {
             localStorage.removeItem('authToken'); // Remove token from localStorage
             window.location.href = 'login.html'; // Redirect to login page
         } catch (error) {
             console.error('Logout failed:', error);
         }
     });
 }
