const URL = 'http://localhost:8080'; 


// API LOGIN
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

// API LẤY USERS THEO ID
async function apiGetUserByID(userId) {
  try {
    const authToken = localStorage.getItem('authToken');
    
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/users/get_byDocID/${userId}`,
      headers: {
        Authorization: `Bearer ${authToken}` 
      }
    });
    // Thành công
    if (response.status === 200) {
      const userData = response.data;  
      
      return userData;
    }
  } catch (error) {
      console.error('Error:', error.message);

  }
}

//APi LẤY TẤT CẢ 
async function apigetAllProducts() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/products/get_products`,
    });
    // Thành công
    if (response.status === 200) {
      const productsData = response.data;
      return productsData;
    }
  } catch (error) {
      console.error('Error:', error.message);
  }
}

//API LẤY PRODUCT THEO PLATFORM
async function apigetProductsByPlat(platform) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/products/get_productbyplat/${platform}`,
    });
    
    if (response.status === 200) {
      const Data = response.data;  
      return Data;
    }
  } catch (error) {
      console.error('Error:', error.message);

  }
}

//API LẤY PRODUCT THEO CATEGORY
async function apigetProductsByCategory(category) {
  try{
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/products/get_productbycategory/${category}`, 
    });

    if (response.status === 200){
      const Data = response.data;  
      return Data;
    }
  }
  catch (error){
    console.error(error.message);
  }
  
}

//API SEARCH THEO KEYWORD
async function apigetProductsByKeyword(keyword) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/products/get_productbykey/${keyword}`,
    });
    
    if (response.status === 200) {
      const Data = response.data;  
      return Data;
    }
  } catch (error) {
      console.error('Error:', error.message);

  }
}

//API SEARCH THEO ID
async function apigetProductsById(id) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/products/get_productbyid/${id}`,
    });
    
    if (response.status === 200) {
      const Data = response.data;  
      return Data;
    }
  } catch (error) {
      console.error('Lỗi: ', error.message);

  }
}
