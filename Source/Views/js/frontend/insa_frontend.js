  let userId;
  //Load trang
  document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken'); 

    if (!authToken) {
        window.location.href = 'login.html'; 
    } else 
    {
        const decodedToken = jwt_decode(authToken);
        userId = decodedToken.id;
        console.log('Auth token is present. User is logged in.');
        
    }
});

//funcion lưu điểm người chơi
function SaveTimeForPoint(time4point) {
     try{
        let x = parseFloat((time4point * 0.01).toFixed(2));

// Kiểm tra và cập nhật lại giá trị trong LocalStorage
if (localStorage.getItem("time4point")) {
    localStorage.removeItem("time4point"); // Xóa giá trị cũ nếu đã tồn tại
}

// Lưu giá trị mới vào LocalStorage
localStorage.setItem("time4point", time4point);
const currentDate = new Date();
currentDate.setDate(currentDate.getDate() + 2);

// Hiển thị thông báo

const couponData = {
  cou_exp: currentDate,
  cou_discount: x, // Use the discount with '%'
  cou_user: userId,
  cou_status: 'available' // Set default status or modify as needed
};
apiAddCoupon(couponData);
alert(`Bạn được tặng voucher ${x}% với điểm số ${time4point}`);
     }
  catch(error){
    console.log(error);
  }
}
