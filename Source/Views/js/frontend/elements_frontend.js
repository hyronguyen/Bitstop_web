
document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken'); 
    if (!authToken) {
        window.location.href = 'login.html';
    }
    const decodedToken = jwt_decode(authToken);
    const userID = decodedToken.id;
    
    LoadData(userID)
    
});

//load data
async function LoadData(userid) {
    try{
        const userData = await apiGetUserByID(userid);
        document.getElementById('userID').textContent = userid || 'N/A';
        document.getElementById('userName').textContent = userData.user_name || 'N/A';
        document.getElementById('userEmail').textContent = userData.user_mail || 'N/A';
        document.getElementById('userFullName').textContent = userData.user_fullname || 'N/A';
        document.getElementById('userAddress').textContent = userData.user_address || 'N/A';
        document.getElementById('userRole').textContent = userData.user_role || 'N/A';
        document.getElementById('userCredit').textContent = userData.user_credit || 'N/A';
        document.getElementById('userPhone').textContent = userData.user_phone || 'N/A';
        document.getElementById('userSince').textContent = userData.createdAt || 'N/A'; 
    }
    catch(error){
        console.log(error);
    }
}


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
