document.addEventListener('DOMContentLoaded', () => {
    
    const authToken = localStorage.getItem('authToken'); 

    if (!authToken) {
        window.location.href = 'login.html'; 
    } else 
    {
        const decodedToken = jwt_decode(authToken);
        userId = decodedToken.id;
        loadCustomerTickets(userId);
   
    }
});


async function loadCustomerTickets(customerId) {
    try {
      const tickets = await apiGetTicketByCustomer(customerId);
      
      const ticketsContainer = document.getElementById("ticketsContainer");
      ticketsContainer.innerHTML = ""; // Clear existing content
      
      if (tickets && tickets.length > 0) {
        tickets.forEach(ticket => {
          // Create HTML element for each ticket with Bootstrap styling
          const ticketElement = document.createElement("div");
          ticketElement.classList.add("col-lg-4", "col-md-6", "mb-4");
  
          // Convert Firestore timestamp to readable date
          const ticketDate = new Date(ticket.tic_date.seconds * 1000 + ticket.tic_date.nanoseconds / 1000000).toLocaleDateString();
  
          // Split description into subject and detailed description
          const [subject, description] = ticket.tic_des.split('|');
  
          ticketElement.innerHTML = `
            <div class="card border-primary">
              <div class="card-header">
                <h5 class="card-title">Ticket ID: ${ticket.id}</h5>
              </div>
              <div class="card-body">
                <h6 class="card-subtitle mb-2 text-muted">${ticket.tic_name}</h6>
                <p><strong>Email:</strong> ${ticket.tic_mail}</p>
                <p><strong>Subject:</strong> ${subject.trim()}</p>
                <p><strong>Description:</strong> ${description.trim()}</p>
                <p><strong>Order ID:</strong> ${ticket.tic_order}</p>
                <p><strong>User ID:</strong> ${ticket.tic_user}</p>
                <p><strong>Status:</strong> ${ticket.tic_status}</p>
                <p><strong>Date:</strong> ${ticketDate}</p>
              </div>
              <div class="card-footer text-muted">
                <small>Updated just now</small>
              </div>
            </div>
          `;
          
          ticketsContainer.appendChild(ticketElement);
        });
      } else {
        // Display a message if no tickets found
        ticketsContainer.innerHTML = "<p>No tickets found for this customer.</p>";
      }
    } catch (error) {
      console.error("Error loading tickets:", error);
      ticketsContainer.innerHTML = "<p>An error occurred while loading tickets.</p>";
    }
  }
