let userId;

document.addEventListener('DOMContentLoaded', () => {
    
    const authToken = localStorage.getItem('authToken'); 

    if (!authToken) {
        window.location.href = 'login.html'; 
    } else 
    {
        const decodedToken = jwt_decode(authToken);
        userId = decodedToken.id;
        console.log("user: "+userId);
   
    }
});

// sự kiện tạo tickets
document.getElementById("contactForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Ngăn form submit mặc định

    // Lấy dữ liệu từ form
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Kiểm tra các trường bắt buộc
    if (!name || !email || !message) {
      alert("Please fill in all required fields.");
      return;
    }
    const ticketData = {
      customerId: userId,
      customerName: name,
      customerMail: email,
      ticketDescription: subject+"|"+message,
      orderId:""
    };

    try {
      const response = await apiCreateNewTicket(ticketData);
      if (response) {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("An error occurred while creating the ticket.");
    }
  });