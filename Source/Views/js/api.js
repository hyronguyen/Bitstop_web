const URL = 'http://localhost:8080'; 


//login
async function apiLogin(user_name, user_password) {
  try {
    // thông tin đăng nhập
    const loginPayload = {
      user_name,
      user_password
    };

    // tạo yêu cầu post
    const response = await axios({
      method: 'POST',
      url: `${URL}/api/auth/login`,
      data: loginPayload
    });

    // thành công
    if (response.status === 200) {
      const { token } = response.data; 
      console.log('Login successful!', token);

      // lưu vào local storage
      localStorage.setItem('authToken', token);

      return token;
    }
  } catch (error) {
    //  Báo lỗi
    if (error.response) {
      console.error('Login failed:', error.response.data.message);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// lấy thông tin người dùng
async function apiGetUserByID(userId) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/users/get_byDocID/${userId}`,
    });
    // Thành công
    if (response.status === 200) {
      const userData = response.data;  
      console.log('User fetched successfully!', userData);
      return userData;
    }
  } catch (error) {
      console.error('Error:', error.message);

  }
}