
document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken'); 
    if (!authToken) {
        window.location.href = 'login.html';
    }
    const decodedToken = jwt_decode(authToken);
    const userId = decodedToken.id;

    LoadUserData(userId);
   
    
});

//load dữa liệu người dùng
async function LoadUserData(userId) {
    try{
        const userData = await apiGetUserByID(userId);
        document.getElementById('userID').textContent = userId || 'N/A';
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


 // Đăng xuất
 const logoutButton = document.getElementById('logoutButton');
 if (logoutButton) {
     logoutButton.addEventListener('click', async () => {
         try {
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
          
             
         } catch (error) {
             console.error('Logout failed:', error);
         }
     });
 }

 
//#region Mở menu Edit
function toggleEditForm() {
    const profileCard = document.getElementById('profileCard');
    const form = document.getElementById('editForm');

    if (form.style.display === 'none') {
        profileCard.style.display = 'none'; 
        populateEditForm();
        form.style.display = 'block'; 
    } else {
        profileCard.style.display = 'block'; 
        form.style.display = 'none'; 
    }
}
    
    function populateEditForm() {
        document.getElementById('editFullName').value = document.getElementById('userFullName').innerText;
        document.getElementById('editEmail').value = document.getElementById('userEmail').innerText;
        document.getElementById('editAddress').value = document.getElementById('userAddress').innerText;
        document.getElementById('editPhone').value = document.getElementById('userPhone').innerText;
    }
 
    document.getElementById('editFullName').value = document.getElementById('userFullName').innerText;
    document.getElementById('editEmail').value = document.getElementById('userEmail').innerText;
    document.getElementById('editAddress').value = document.getElementById('userAddress').innerText;
    document.getElementById('editPhone').value = document.getElementById('userPhone').innerText;
    

    document.getElementById('profileEditForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const fullName = document.getElementById('editFullName').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const address = document.getElementById('editAddress').value.trim();
        const phone = document.getElementById('editPhone').value.trim();

        if (!fullName || !email || !address || !phone) {
            alert('Please fill out all fields: Full Name, Email, Address, and Phone.');
            return; 
        }


        const profileData = {
            Fullname: fullName,
            Mail: email,
            Address: address,
            Phone: phone
        };

         try
          {
            const token = localStorage.getItem('authToken'); 
            docID = jwt_decode(token).id;

            const result = await apiEditProfile(docID, profileData); 

            if (result.status === 200) {
                alert(result.message || 'Profile updated successfully!');
                toggleEditForm(); 
    
               
                document.getElementById('userFullName').innerText = fullName;
                document.getElementById('userEmail').innerText = email;
                document.getElementById('userAddress').innerText = address;
                document.getElementById('userPhone').innerText = phone;
            }
            else{
                alert(result.message);
            }
            
    } catch (error) {
        alert('Failed to update profile. Please try again.');
    }
    
        toggleEditForm();
    });
//#endregion