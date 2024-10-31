document.addEventListener('DOMContentLoaded', () => {
    
    const authToken = localStorage.getItem('authToken'); 

    if (!authToken) {
        window.location.href = 'login.html'; 
    } else 
    {
        const decodedToken = jwt_decode(authToken);
        userId = decodedToken.id;
        console.log('Auth token is present. User is logged in.');
        LoadCoupons(userId)
        
    }
});

async function LoadCoupons(userId) {
    const coupon_list = await apigetCouponsByCustomerId(userId);
    RenderCoupons(coupon_list);
}

function RenderCoupons(coupons) {
    const couponList = document.getElementById('coupon_cards_row');
    couponList.innerHTML = ''; 

    coupons.forEach(coupon => {
    
        const expirationDate = new Date(coupon.cou_exp.seconds * 1000);
        const currentDate = new Date();

        // Calculate time difference in days
        const timeDiff = expirationDate - currentDate;
        const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        // Only show the "Use Now" button if the coupon is not expired
        const isExpired = daysRemaining < 0;
        const countdownText = isExpired
            ? "<span class='text-danger'>Expired</span>"
            : `<span class="text-success">${daysRemaining} days left</span>`;

        // Create HTML content for each coupon card with enhanced styling
        const couponCard = `
            <div class="col-md-3 mb-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title">Coupon: ${coupon.id}</h5>
                        <p class="card-text text-muted"><strong>Status:</strong> ${coupon.cou_status}</p>
                        <p class="card-text text-success"><strong>Discount:</strong> ${Math.round(coupon.cou_discount * 100)}%</p>
                        <p class="card-text "><strong>Expires in:</strong> ${countdownText}</p>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 text-center">
                        ${isExpired ? '' : `
                        <a href="category.html">
                            <button class="btn btn-outline-success btn-sm">Use Now</button>
                        </a>`}
                    </div>
                </div>
            </div>
        `;

        // Append each coupon card to the row in coupon list section
        couponList.insertAdjacentHTML('beforeend', couponCard);
    });
}


