document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken'); // Assuming you store the token in localStorage

    if (!authToken) {
        // Redirect to login page if authToken is not present
        window.location.href = 'login.html'; // Adjust the path if necessary
    } else {
        console.log('Auth token is present. User is logged in.');
        // You can add more logic here to handle authenticated users
    }
});
